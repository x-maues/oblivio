import { ethers } from "hardhat";
import { Contract } from "ethers";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Poseidon hash contract
  const Poseidon = await ethers.getContractFactory("Poseidon");
  const poseidon = await Poseidon.deploy();
  await poseidon.waitForDeployment();
  console.log("Poseidon deployed to:", await poseidon.getAddress());

  // Deploy MockERC20 for testing
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockToken = await MockERC20.deploy("Mock Token", "MTK");
  await mockToken.waitForDeployment();
  console.log("MockERC20 deployed to:", await mockToken.getAddress());

  // Deploy EnhancedShieldedPool
  const EnhancedShieldedPool = await ethers.getContractFactory("EnhancedShieldedPool");
  const shieldedPool = await EnhancedShieldedPool.deploy(await poseidon.getAddress());
  await shieldedPool.waitForDeployment();
  console.log("EnhancedShieldedPool deployed to:", await shieldedPool.getAddress());

  // Add mock token to supported tokens
  const addTokenTx = await shieldedPool.addToken(await mockToken.getAddress());
  await addTokenTx.wait();
  console.log("Added mock token to supported tokens");

  // Mint some tokens to the deployer
  const mintTx = await mockToken.mint(deployer.address, ethers.parseEther("1000"));
  await mintTx.wait();
  console.log("Minted 1000 tokens to deployer");

  // Approve shielded pool to spend tokens
  const approveTx = await mockToken.approve(await shieldedPool.getAddress(), ethers.parseEther("1000"));
  await approveTx.wait();
  console.log("Approved shielded pool to spend tokens");

  return {
    poseidon,
    mockToken,
    shieldedPool
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 