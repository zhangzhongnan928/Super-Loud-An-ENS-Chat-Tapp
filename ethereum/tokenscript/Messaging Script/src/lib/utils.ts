import { error } from '@sveltejs/kit';
import { TokenboundClient } from '@tokenbound/sdk';
import { polygonMumbai, polygon } from "viem/chains";

export const getTokenBoundClientInstance = (chainId: number) => {

  // TODO: Add custom RPC URLS
  let chain = undefined;

  switch (chainId) {
    case 80001:
      chain = polygonMumbai;
      break;
    case 137:
      chain = polygon;
      break;
  }

  return new TokenboundClient({
    chainId: chainId,
    chain
  });
}

export const setTokenBoundAccountIsActive = async (tokenboundClient: any, tokenBoundAccount: string) => {
  return tokenboundClient.checkAccountDeployment({
    accountAddress: tokenBoundAccount as `0x${string}`
  });
}

export const setChainIdName = (id: number) => {
  const chainMap = {
    1: 'eth',
    5: 'goerli',
    11155111: 'sepolia',
    137: 'polygon',
    80001: 'mumbai',
    56: 'bsc',
    8453: 'base',
  };
  return chainMap[id];
}

export const setTokenBoundAccount = (tokenboundClient: any, tokenContract: `0x${string}`, tokenId: `0x${string}`) => {
  return tokenboundClient.getAccount({ tokenContract, tokenId });
}
