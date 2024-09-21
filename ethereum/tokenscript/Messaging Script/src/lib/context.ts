import { writable } from 'svelte/store';
import { MessageClient } from './messageClient';
import { Token } from './types';
import { getContract } from './data';
import { Contract } from 'ethers';

let messageClient: MessageClient;

const data = writable<{ token: Token; contract: Contract }>();

export const cachedNames = new Map<string, string>();
export const cachedIds = new Map<string, string>();

// for secure encrypting
const messagingKey = writable<string>('');
const derivedPrivateKey = writable<string>('');

async function setToken(token: Token) {
	console.log("tesf1");
	data.set({
		...data,
		token,
		contract: await getContract(token)
	});

	// Do some other stuff
}

async function getMessageClient():Promise<MessageClient> {
	console.log("get message client")
	if (messageClient) return messageClient;

	return new Promise((resolve) => {
		data.subscribe((data) => {
			messageClient = new MessageClient(data.token);
			resolve(messageClient);
		});
	});
}

export default {
	data,
	setToken,
	getMessageClient,
	messagingKey,
	derivedPrivateKey
};
