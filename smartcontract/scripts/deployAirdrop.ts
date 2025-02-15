// scripts/deployAirdrop.ts
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying Airdrop contract with account:", deployer.address);

  const tokenAddress = "";
  const initialAirdropAmount = ethers.parseUnits("100", 18); // Example: 100 tokens


  const Airdrop = await ethers.getContractFactory("Airdrop");
  const airdrop = await Airdrop.deploy(tokenAddress, initialAirdropAmount);
  await airdrop.waitForDeployment();
  console.log("Airdrop deployed to:", await airdrop.getAddress());


  await airdrop.startAirdrop(true);
  console.log("Airdrop started.");

  const newAmount = ethers.parseUnits("50", 18);
  await airdrop.setAirdropAmount(newAmount);
  console.log("Airdrop amount updated to 50 tokens.");

  const recipients = ["<ADDRESS_1>", "<ADDRESS_2>"];
  await airdrop.batchAirdrop(recipients);
  console.log("Batch airdrop executed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
