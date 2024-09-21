import { ethers, upgrades } from "hardhat";

import { expect } from "chai";
import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

async function deployInitialFixture() {
  // Contracts are deployed using the first signer/account by default
  const [owner, otherAccount, otherAccount2, otherAccount3, otherAccount4] = await ethers.getSigners();

  const ExampleNFT = (await ethers.getContractFactory("ExampleNFT")).connect(
    owner
  );
  const exampleNFT = await ExampleNFT.deploy();
  await exampleNFT.waitForDeployment();

  const SLToken = (await ethers.getContractFactory("SLToken")).connect(
    owner
  );
  const slToken = await SLToken.deploy();
  await slToken.waitForDeployment();

  const MessageCoordinator = await ethers.getContractFactory("MessageCoordinator");
  const coordinator = await upgrades.deployProxy(MessageCoordinator.connect(owner), [slToken.target], { kind: 'uups' });
  await coordinator.waitForDeployment();

  await slToken.setCoordinator(coordinator.target);

  return {
    owner,
    otherAccount,
    otherAccount2,
    otherAccount3,
    otherAccount4,
    slToken,
    coordinator,
    exampleNFT
  };
}

async function showBalance(account: any) {
  const ownerBalance = await ethers.provider.getBalance(account.address);
  console.log(`Balance of ${account.address}: ${ethers.formatEther(ownerBalance)}`);
  return ownerBalance;
}

describe("MessageCoordinator", function () {

  it("mint and set scriptURI with owner", async function () {
    const {
      owner,
      otherAccount,
      otherAccount2,
      otherAccount3,
      otherAccount4,
      slToken,
      coordinator,
      exampleNFT
    } = await loadFixture(deployInitialFixture);

    //deploy NFTs
    await expect(exampleNFT.connect(owner).safeMint())
      .to.emit(exampleNFT, "Transfer")
      .withArgs(ethers.ZeroAddress, owner.address, 1);

    await expect(exampleNFT.connect(otherAccount).safeMint())
      .to.emit(exampleNFT, "Transfer")
      .withArgs(ethers.ZeroAddress, otherAccount.address, 2);  

    //create commitment
    await coordinator.connect(owner).createCommit(exampleNFT.target, 1, 2, {
          value: ethers.parseEther("0.1") // Sending 0.1 ETH, for example
    });

    //get balance of otherAccount
    await showBalance(otherAccount);

    let cData = await coordinator.commitValue(exampleNFT.target, 1, 2);
    console.log(`Data: ${ethers.formatEther(cData.value)} Complete: ${cData.complete}`);

    //accept commitment wrong addr
    await expect(coordinator.connect(otherAccount2).completeCommitment(exampleNFT.target, 1, 2))
      .to.be.revertedWith("Must own Token to accept commitment");

    //wrong commitment
    await expect(coordinator.connect(otherAccount2).completeCommitment(exampleNFT.target, 2, 1))
      .to.be.revertedWithCustomError(coordinator, "NoCommitment");    

    //accept commitment
    await coordinator.connect(otherAccount).completeCommitment(exampleNFT.target, 1, 2);

    cData = await coordinator.commitValue(exampleNFT.target, 1, 2);
    console.log(`Data: ${ethers.formatEther(cData.value)} Complete: ${cData.complete}`);

    //check balances
    await showBalance(otherAccount);

    await expect(coordinator.connect(otherAccount2).completeCommitment(exampleNFT.target, 1, 2))
      .to.be.revertedWithCustomError(coordinator, "CommitmentComplete");

    //SLT Balance
    let b1 = await slToken.balanceOf(owner);
    let b2 = await slToken.balanceOf(otherAccount);

    console.log(`SLBalance 1: ${ethers.formatEther(b1.toString())} SLBalance 2: ${ethers.formatEther(b2.toString())}`);
  });


  async function checkPageSize(pageSize: number, correctFinal: string[], registry: any, exampleNFT: any) {
      const totalPages = Math.ceil(correctFinal.length / pageSize);
  
      for (let page = 1; page <= totalPages; page++) {
          let start = (page - 1) * pageSize;
          let expected = [];
          
          for (let j = 0; j < pageSize; j++) {
              if (start + j < correctFinal.length) {
                  expected[j] = correctFinal[start + j];
              } else {
                  break;
              }
          }
  
          let contractReturn = await registry.scriptURI(exampleNFT.target, page, pageSize);
          //console.log(`Actual return = ${contractReturn} Expected = ${expected}`);
          expect(contractReturn.toString()).to.be.equal(expected.toString());
      }
  }
})