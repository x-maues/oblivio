const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment...");
  
  // Get the network info
  const network = await ethers.provider.getNetwork();
  console.log(`Deploying to network: ${network.name} (chainId: ${network.chainId})`);

  // Get the deployer's address
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from address:", deployer.address);

  // Get the contract factory
  console.log("Getting contract factory...");
  const Counter = await ethers.getContractFactory("Counter");

  // Deploy the contract
  console.log("Deploying Counter contract...");
  const counter = await Counter.deploy();
  
  console.log("Waiting for deployment transaction to be mined...");
  await counter.deployed();

  console.log("Counter contract deployed to:", counter.address);
  console.log("Transaction hash:", counter.deployTransaction.hash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed!");
    console.error(error);
    process.exit(1);
  }); 