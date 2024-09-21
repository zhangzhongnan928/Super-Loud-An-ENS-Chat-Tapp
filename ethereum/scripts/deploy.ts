import dotenv from "dotenv";
const { ethers, upgrades, hre } = require("hardhat");
dotenv.config();

// Helper script to re-assign ownership of ENS domain to the registry contract
async function main() {
    const privateKey: any = process.env.PRIVATE_KEY_ENS;

    if (!privateKey) {
        throw new Error("PRIVATE_KEY not found in .env file");
    }

    const deployKey = new ethers.Wallet(privateKey, ethers.provider);
    console.log(`ADDR: ${deployKey.address}`);

    //Deploy SUD
    const SLToken = (await ethers.getContractFactory("SLToken")).connect(
        deployKey
    );
    const slToken = await SLToken.deploy();
    await slToken.waitForDeployment();

    //Deploy Commitment contract
    const MessageCoordinator = await ethers.getContractFactory("MessageCoordinator");
    const coordinator = await upgrades.deployProxy(MessageCoordinator.connect(deployKey), [slToken.target], { kind: 'uups' });
    await coordinator.waitForDeployment();

    await slToken.setCoordinator(coordinator.target);

    // what is the deployment address?
    console.log(`SLT Address: ${slToken.target}`);
    console.log(`MessageCoordinator Address: ${coordinator.target}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


    // to run: npx hardhat run .\scripts\deploy.ts --network base
    // to verify logic: npx hardhat verify <ADDRESS> --network base 
    // to verify full: npx hardhat verify <ADDRESS> --network base slToken.target
