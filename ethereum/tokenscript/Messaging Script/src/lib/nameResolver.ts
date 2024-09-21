import { ethers } from 'ethers';
import { cachedNames, cachedIds } from './context';

const baseDeployer = "0x4cCb0BB02FCABA27e82a56646E81d8c5bC4119a5";
const ensAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
const tokenDiscoveryAPI = "https://api.token-discovery.tokenscript.org/";

  export async function nameAvailable(name: string, chainId: number): Promise<boolean> {

    //const provider = new ethers.JsonRpcProvider(window.rpcURL, {
    const provider = new ethers.JsonRpcProvider(window.rpcURL, {
      chainId: chainId,
      name: 'base'
    });

    const nameResolver = new ethers.Contract(baseDeployer, [
      'function available(string name) view returns (bool)'
    ], provider);

    let isAvailable = false;

    try {
      isAvailable = await nameResolver.available(name);
    } catch (error) {

    }

    return isAvailable;
  }

  export async function getCommitmentData(coordinatorContractAddr: string, chainId: number, thisContractAddr: string, originId: string, targetId: string): Promise<any> {
    let baseRPC = "https://base-rpc.publicnode.com";
     const provider = new ethers.JsonRpcProvider(baseRPC, {
       chainId: chainId,
       name: 'base'
     });

     const commitController = new ethers.Contract(coordinatorContractAddr, [
       'function commitValue(address messagingContract, uint256 originId, uint256 targetId) view returns (uint256 value, bool complete)'
     ], provider);

     let result: any = null;
 
     try {
      result = await commitController.commitValue(thisContractAddr, originId, targetId);
     } catch (error) {
      console.log(`ERR: ${error}`);
 
     }
 
     return result;
  }

  //given tokenId, get the name
  export async function resolveNameFromTokenId(tokenId: string, contractAddress: string): Promise<string> {
    if (tokenId == null || tokenId.length == 0) {
      return "";
    }

    let cachedName = cachedNames.get(tokenId);

    if (cachedName != null && cachedName.length > 0) {
      return cachedName;
    }

    try {
      let urlString = `${tokenDiscoveryAPI}get-token?collectionAddress=${contractAddress}&chain=base&tokenId=${tokenId}&blockchain=evm`;
      const response = await fetch(
				urlString,
				{
					method: 'GET'
				}
			);

      //response should be JSON
      if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const responseData = await response.json();
      //need to pull the name
      if (responseData.title != null && responseData.title.length > 0) {
        cachedIds.set(responseData.title, tokenId);
        cachedNames.set(tokenId, responseData.title);
      }
      return responseData.title;

		} catch (e) {
			//
		}

    return "";
  }

  export async function resolveTokenId(name: string = '', contract: string, owner: string): Promise<string | null> {
		// does the name exist?
		//strip the domain if present
		const suffix = '.base.eth';
    let formName = name;
		if (!name.endsWith(suffix)) {
			formName = `${name}${suffix}`;// name.replace(suffix, '');
		}

    let cachedId = cachedIds.get(formName);

    if (cachedId != null && cachedId.length > 0) {
      return cachedId;
    }

		//find address of name
		try {
      // call 
      let urlString = `${tokenDiscoveryAPI}get-owner-tokens?smartContract=${contract}&chain=base&owner=${owner}&blockchain=evm`;
      const response = await fetch(
				urlString,
				{
					method: 'GET'
				}
			);

      //response should be JSON
      if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const responseData = await response.json();
      for (let i = 0; i < responseData.length; i++) {
        const thisToken = responseData[i];
        if (thisToken.title === formName) {
          cachedIds.set(formName, thisToken.tokenId);
          cachedNames.set(thisToken.tokenId, formName);
          return thisToken.tokenId;
        }
      }
		} catch (e){
			//
		}

    return null;
	}  

  //given tokenId, get the name
  export async function resolveOwnerOfTokenId(tokenId: string, chainId: number, contractAddress: string): Promise<string> {
    //const provider = new ethers.JsonRpcProvider(window.rpcURL, {
    //const basesep = "https://sepolia.base.org";
    let baseRPC = "https://base-rpc.publicnode.com";
    const provider = new ethers.JsonRpcProvider(baseRPC, {
       chainId: chainId,
       name: 'base'
     });
 
     const nameResolver = new ethers.Contract(contractAddress, [
       'function ownerOf(uint256 tokenId) view returns (address)'
     ], provider);

     let ownerAddress = "";
 
     try {
       ownerAddress = await nameResolver.ownerOf(tokenId);
     } catch (error) {
 
     }
 
     return ownerAddress;
 }


  export async function resolveOwner(name: string = ''): Promise<string | null> {
		// does the name exist?
		//strip the domain if present
		const suffix = '.base.eth';
		if (name.endsWith(suffix)) {
			name = name.replace(suffix, '');
		}

		//find address of name
		try {
			//resolve address
      const ethRPC = tokenscript.eth.getRpcUrls(1)[0];
			const provider = new ethers.JsonRpcProvider(ethRPC, {
				chainId: 1,
				name: 'mainnet',
				ensAddress
			});
			const formName = `${name!}.base.eth`;
			const address = await provider.resolveName(formName!);
			if (address) {
				console.log(`The address for ${formName!} is ${address}`);
        return address;
			} else {
				console.log(`ENS name ${formName!} could not be resolved.`);
			}

		} catch (e){
			console.error(e);
			alert("Message send failed: " + e.message);
		}

    return null;
	}  

function hexStripZeros(inputStr: string) {
  const pattern = /\b(?:0x)?([1-9a-fA-F][0-9a-fA-F]*|0)\b/g;
  const result = inputStr.replace(pattern, (match, group1) => group1);
  return result;
}


