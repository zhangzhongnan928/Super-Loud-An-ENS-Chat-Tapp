//DVP contract needs to

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface ERC20Minter {
    function mint(address to, uint256 amount) external;
}

contract MessageCoordinator is Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable {
    uint256 constant PLATFORM_FEE_FACTOR = 1 * 10000;
    uint256 constant _FEE_DECIMALS = 1000 * 10000;
    uint256 constant COLLECTOR_FEE_FACTOR = _FEE_DECIMALS - PLATFORM_FEE_FACTOR;
    uint256 constant MINT_FACTOR_DENOM = 3000;
    uint256 constant MINT_FACTOR_NOM = 10000;
    uint256 constant DEFAULT_ERC20_AWARD = (10 ** 18) * 100;
    uint256 constant SLTOKEN_AWARD_FACTOR = 3000 * 1000;

    struct Commit {
        uint256 commitmentValue;
        uint256 timeStamp;
    }

    address private _sltAddress;
    mapping(bytes32 => Commit) public _commitments;
    uint256 private _currentFeeTotal;

    error NoCommitment();
    error CommitmentComplete();
    error PaymentFailed();

    event CreateCommitment(
        address indexed tokenContract,
        uint256 indexed creatorId,
        uint256 indexed targetId,
        uint256 value
    );
    event CompleteCommitment(
        address indexed tokenContract,
        uint256 indexed targetId,
        uint256 value
    );

    function initialize(address sltAddress) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        _sltAddress = sltAddress;
        _currentFeeTotal = 0;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function setDaoContract(address sltAddress) public onlyOwner {
        _sltAddress = sltAddress;
    }

    // Create commit
    function createCommit(
        address messagingContract,
        uint256 originId,
        uint256 targetId
    ) public payable {
        //first ensure originId is owned by originator
        require(
            getERC721Owner(messagingContract, originId) == msg.sender,
            "Must own Token to create commit"
        );
        require(
            getERC721Owner(messagingContract, targetId) != address(0),
            "Target Token must exist"
        );

        //check existing commit, replace if so
        bytes32 commitHash = keccak256(
            abi.encodePacked(messagingContract, originId, targetId)
        );
        Commit memory thisCommit = _commitments[commitHash];

        if (thisCommit.commitmentValue > 0) {
            // replace commitment
            // first update the commitement value to avoid re-entrancy attack
            uint256 refundValue = thisCommit.commitmentValue;
            _commitments[commitHash].commitmentValue = 0;

            // refund amount
            (bool success, ) = msg.sender.call{value: refundValue}(""); //unchecked
            if (!success) revert PaymentFailed();
        }

        // create deposit
        _commitments[commitHash].commitmentValue = msg.value;
        _commitments[commitHash].timeStamp = uint32(block.timestamp);
        emit CreateCommitment(messagingContract, originId, targetId, msg.value);
    }

    // Completed commitment, how to allow target to verify?
    function completeCommitment(
        address messagingContract,
        uint256 originId,
        uint256 targetId
    ) external {
        bytes32 commitHash = keccak256(
            abi.encodePacked(messagingContract, originId, targetId)
        );

        uint256 timeStamp = _commitments[commitHash].timeStamp;

        if (timeStamp == 0) {
            revert NoCommitment();
        }

        if (isComplete(timeStamp)) {
            revert CommitmentComplete();
        }

        address targetOwner = getERC721Owner(messagingContract, targetId);
        address originOwner = getERC721Owner(messagingContract, originId);
        uint256 collectorAmount = 0;

        require(
            targetOwner == msg.sender,
            "Must own Token to accept commitment"
        ); // Use text revert for user facing error

        // mark as complete first to avoid re-entrant attack
        setComplete(commitHash);

        uint256 commitmentValue = _commitments[commitHash].commitmentValue;
        if (commitmentValue > 0) {
            //split value
            collectorAmount =
                (commitmentValue * COLLECTOR_FEE_FACTOR) /
                _FEE_DECIMALS;
            _currentFeeTotal += (commitmentValue - collectorAmount);
            (bool success, ) = msg.sender.call{value: collectorAmount}(""); //unchecked
            if (!success) revert PaymentFailed();
        }

        // Now mint tokens.
        // Each paid connection, on top of 100 tokens each, will reward both party (ETH amount paid/3000) *10000 tokens.
        uint256 tokenMintValue = DEFAULT_ERC20_AWARD +
            (commitmentValue * SLTOKEN_AWARD_FACTOR);
        ERC20Minter(_sltAddress).mint(originOwner, tokenMintValue);
        ERC20Minter(_sltAddress).mint(targetOwner, tokenMintValue);

        emit CompleteCommitment(messagingContract, targetId, collectorAmount);
    }

    function commitValue(
        address messagingContract,
        uint256 originId,
        uint256 targetId
    ) external view returns (uint256 value, bool complete) {
        bytes32 commitHash = keccak256(
            abi.encodePacked(messagingContract, originId, targetId)
        );
        value = _commitments[commitHash].commitmentValue;
        complete = isComplete(_commitments[commitHash].timeStamp);
    }

    function takeFees() public onlyOwner {
        if (_currentFeeTotal > 0) {
            (bool success, ) = msg.sender.call{value: _currentFeeTotal}("");
            if (!success) revert PaymentFailed();
        }
    }

    // Helper functions
    function getERC721Owner(
        address contractAddress,
        uint256 tokenId
    ) public view returns (address) {
        try IERC721(contractAddress).ownerOf(tokenId) returns (address owner) {
            return owner;
        } catch {
            return address(0);
        }
    }

    function setComplete(bytes32 commitHash) public {
        _commitments[commitHash].timeStamp =
            _commitments[commitHash].timeStamp |
            (1 << 255);
    }

    function getTimestamp(uint256 timestamp) public pure returns (uint256) {
        return timestamp & ((1 << 255) - 1);
    }

    function isComplete(uint256 timestamp) public pure returns (bool) {
        return (timestamp & (1 << 255)) > 0;
    }

    function calcCommit(
        address messagingContract,
        uint256 originId,
        uint256 targetId
    ) public pure returns (bytes32) {
        return
            keccak256(abi.encodePacked(messagingContract, originId, targetId));
    }
}
