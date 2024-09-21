export type Token = {
	chainId: number;
	contractAddress: string;
	description: string;
	image_preview_url: string;
	label: string;
	name: string;
	ownerAddress: string;
	symbol: string;
	tokenId: string;
	contractOwner?: string;
	contractName?: string;
	contractURI?: string;
};

export type MessagesData = {
	unread?: number;
	messages?: [];
	friendsSharedKey: string;
	yourSharedKey: string;
	inviteCommitFee?: string;
};

export type Invite = {
	createdAt: string;
	sendingAddress: string;
	sendingTokenId: string;
	inviteCommitFee?: BigInt;
};

export type Friend = {
	receivingAddress: string;
	receivingSharedKey?: string;
	receivingTokenId: string;
	sendingAddress: string;
	sendingTokenId: string;
	sendingSharedKey?: string;
};

type NftCardData = {
	tokenIdName?: string;
};

export type ThreadItem = {
	contract?: string;
	chainId?: string;
	wrongOwner: boolean;
} & MessagesData &
	NftCardData;

export const NftCardTypes = {
	Messages: 0,
	Friends: 1,
	Admin: 2
};

