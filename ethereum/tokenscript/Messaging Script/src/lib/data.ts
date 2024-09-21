import { ethers, Contract, JsonRpcProvider, Network } from 'ethers';
import { Token } from './types';

const ensLookupCache: { [address: string]: string } = {};
const ensAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";

export async function lookupEnsName(address: string) {
	if (ensLookupCache[address]) return ensLookupCache[address];

	const ethRPC = tokenscript.eth.getRpcUrls(1)[0];
	const provider = new ethers.JsonRpcProvider(ethRPC, {
		chainId: 1,
		name: 'mainnet',
		ensAddress
	});

	return await provider.lookupAddress(address) || "";
}

export interface CatListItem {
	tokenId: string;
	tokenUri: string;
	owner: string;
}

export async function getContract(token: Token) {

	// @ts-expect-error chainID embedded as global variable
	const network = new Network('polygon', chainID);

	// @ts-expect-error rpcURL embedded as global variable
	const provider = new JsonRpcProvider(rpcURL, network, {
		staticNetwork: network
	});

	// TODO: get contract address from engine by origin name.
	return new Contract(
		token.contractAddress,
		[
			{
				inputs: [
					{
						internalType: 'uint256',
						name: 'tokenId',
						type: 'uint256'
					}
				],
				name: 'ownerOf',
				outputs: [
					{
						internalType: 'address',
						name: 'address',
						type: 'address'
					}
				],
				stateMutability: 'view',
				type: 'function'
			},
			{
				inputs: [
					{
						internalType: 'uint256',
						name: 'tokenId',
						type: 'uint256'
					}
				],
				name: 'tokenURI',
				outputs: [
					{
						internalType: 'string',
						name: 'tokenURI',
						type: 'string'
					}
				],
				stateMutability: 'view',
				type: 'function'
			}
		],
		provider
	);
}

export async function signMessage(msg: string): Promise<string> {
	console.log("tesf1");
	return new Promise((resolve, reject) => {
		web3.personal.sign({ data: msg }, function (error, value) {
			if (error != null) {
				reject(error);
			} else {
				resolve(value);
				console.log(value);
			}
		});
	});
}
