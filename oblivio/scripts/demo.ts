import { ethers } from "hardhat";
import { Contract } from "ethers";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy MockERC20 for testing
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockToken = await MockERC20.deploy() as unknown as Contract & { mint: (address: string, amount: bigint) => Promise<any>; approve: (spender: string, amount: bigint) => Promise<any>; balanceOf: (address: string) => Promise<bigint>; };
  await mockToken.waitForDeployment();
  console.log("MockERC20 deployed to:", await mockToken.getAddress());

  // Mint some tokens to the deployer
  const INITIAL_BALANCE = ethers.parseEther("1000");
  await mockToken.mint(deployer.address, INITIAL_BALANCE);
  console.log("Minted 1000 tokens to deployer");

  // Check balance
  const deployerBalance = await mockToken.balanceOf(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(deployerBalance));

  return {
    mockToken
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 