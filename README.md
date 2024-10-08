# Super Loud: An ENS Chat Tapp
![Super Loud Tapp Cover image](https://github.com/user-attachments/assets/0d721f95-9ab3-4c66-ba8b-ab9c422ecf8c)

#### I don't want to read the doc, I want to try it now, click [here](https://github.com/zhangzhongnan928/Super-Loud-An-ENS-Chat-Tapp/blob/main/README.md#usage)

## Description
Super Loud is a cross-platform mini-app (Tapp) built on top of ENS name NFTs. It uses the [Tapp framework](https://sln-doc.vercel.app/getting-started/quick-start) (ERC-7738/5169 + TokenScript) to enable ENS users to connect, chat, and earn tokens. 

## Cross-Platform Accessibility
As a Tapp, Super Loud embodies the principle of "build once, run anywhere". After a single development process, Super Loud can be accessed from various platforms, including:

- Social media platforms (e.g., Twitter, Farcaster)
- Messaging apps (e.g., Telegram)
- Smart Token viewers
- Wallet interfaces
- NFT marketplaces

This wide-ranging accessibility ensures that users can interact with Super Loud wherever they are, using their preferred platforms and tools.

## What is a Tapp?
Tapp stands for "Tokens as Applications". It's a cross-platform mini-app that goes wherever you go, seamlessly usable across various platforms and channels.

### How Tapps Work:
1. The token contract (in this case, the ENS name NFT) uses the ERC-5169/ERC-7738 standard to link to a script.
2. The script contains the user interface and logic for interacting with the token.
3. When a user accesses the token in any supported platform, it reads the script.
4. The platform checks the script's signature and then shows the interface for the user.
5. Users can use various functions directly on the token without needing a separate app.

### Key Advantages of Tapps:
- **Portability**: Your ENS tokens are owned by you, and you can bring Super Loud functionality anywhere.
- **Universal Access**: Access and use Super Loud wherever you go, across multiple platforms.
- **Developer Efficiency**: Developers create one interface that works in multiple places.
- **Seamless Integration**: Allows for seamless integration of Super Loud across various platforms, enhancing user experience and developer productivity.

## Features of Super Loud
- **An ENS Tapp**: The mini app is linked with ENS NFTs via ERC-7738, users can easily find the mini app from 7738 script regestion contracts.
- **Friend Requests**: Send and receive friend requests to other ENS users, with optional ETH attachments.
- **E2E Encrypted Messaging**: Securely chat with accepted friends.
- **Token Rewards**: Earn Super Loud Tokens (SLT) for successful connections and transactions.
- **Base Blockchain Integration**: Utilizes Base for efficient, low-cost transactions.

## Technical Implementation

### Tapp Framework
Super Loud is built using the Tapp framework, which combines:
- ERC-7738 (Permissionless Script Registry): [ERC-7738 Specification](https://github.com/ethereum/ERCs/blob/master/ERCS/erc-7738.md)
- ERC-5169 (Scriptable Token): [ERC-5169 Specification](https://github.com/ethereum/ercs/blob/master/ERCS/erc-5169.md)
- TokenScript: [TokenScript Documentation](https://sln-doc.vercel.app/getting-started/quick-start)

This framework allows Super Loud to be a portable, scriptable application tied to ENS name NFTs.

### ERC-7738 Integration
We have implemented the ERC-7738 standard to associate scripts with ENS name NFTs. This allows for a decentralized approach to script management and execution.

#### ERC-7738 Contract Address
The official ERC-7738 contract we're using is deployed at:
`0x0077380bCDb2717C9640e892B9d5Ee02Bb5e0682`

### TokenScript
We use TokenScript to define the behavior and interface of Super Loud. The TokenScript file is registered with the ERC-7738 contract, allowing for permissionless updates and easy access for wallets and dApps that interact with ENS names.

## How It Works
1. ENS users can send friend requests to other ENS users, optionally attaching ETH.
2. Recipients can accept or refuse these requests.
3. Upon acceptance, both parties can start messaging each other with end-to-end encryption.
4. Each successful friend request grants both parties 100 Super Loud Tokens (SLT).
5. If ETH is included in the request, the protocol takes a 1% fee.
6. Additional SLT are awarded based on the ETH amount: (ETH amount * 3000)* 1000 SLT.

## Token Utility
Super Loud Tokens (SLT) can be used for:
- Voting in protocol decisions
- Building reputation within the ecosystem
- Paying for future services

## Installation
To set up the Super Loud development environment:

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your .env file with necessary keys (see .env.example)

## Usage
Super Loud can be accessed and used on various platforms. Here are some examples:
#### (To use Super Loud, you need to have a Base ENS name, like xxx.base.eth, you can get one from [Basenames](https://www.base.org/names))

1. In a Smart Token viewer: [Example in Smart Token Viewer](https://viewer.tokenscript.org/?chain=8453&contract=0x03c4738ee98ae44591e1a4a4f3cab6641d95dd9a&scriptId=7738_2&tokenId=2193099050839623518412852132320421961485623907317328399883739888564917023876)
2. On Twitter: [Example on Twitter feed](https://x.com/Victor928/status/1837417853873803530) ##### [Need to install tapp link Extension](https://chromewebstore.google.com/detail/tlink/eblnpllcmmepkmpaalggpibindkplcjj)
3. On Farcaster: [Example on Farcaster as frame](https://warpcast.com/victor928/0xd261399e)

4. On Telegram: [Example on Telegram as mini app](https://t.me/SmartLayerBot/SmartTokenViewer/?startapp=dmlld1R5cGU9am95aWQtdG9rZW4mY2hhaW49ODQ1MyZ0b2tlbklkPTIxOTMwOTkwNTA4Mzk2MjM1MTg0MTI4NTIxMzIzMjA0MjE5NjE0ODU2MjM5MDczMTczMjgzOTk4ODM3Mzk4ODg1NjQ5MTcwMjM4NzYmY29udHJhY3Q9MHgwM2M0NzM4ZWU5OGFlNDQ1OTFlMWE0YTRmM2NhYjY2NDFkOTVkZDlh)
5. In wallet interfaces: [Example in Joy.ID wallet interface](https://app.joy.id/evm-nft/8453/0x03c4738ee98ae44591e1a4a4f3cab6641d95dd9a/2193099050839623518412852132320421961485623907317328399883739888564917023876)
6. On NFT marketplaces: [Example on NFT Marketplace MOOAR](https://mooar.com/item/0x03c4738Ee98aE44591e1A4A4F3CaB6641d95DD9a/2193099050839623518412852132320421961485623907317328399883739888564917023876)


## Roadmap
- ✅ Implement Tapp framework integration (ERC-7738/5169 + TokenScript) (Completed)
- ✅ Develop ENS-based friend request system
- ✅ Implement E2E encrypted messaging
- Create and integrate Super Loud Token (SLT) reward system
- Expand token utility features (voting, reputation, services)

