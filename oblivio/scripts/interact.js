const { ethers } = require("hardhat");

async function main() {
  // Replace with the deployed contract address
  const contractAddress = "0xe5aB1b3638A9f4b2e0c7AE72b4334117F5aB1b1d";

  // Load the contract ABI
  const contractABI = require("../artifacts/contracts/Poseidon.sol/Poseidon.json").abi;

  // Connect to the contract
  const contract = new ethers.Contract(contractAddress, contractABI, ethers.provider);

  // Example: Call the poseidon function
  const x = 123; // Example input
  const y = 456; // Example input

  try {
    const result = await contract.poseidon(x, y);
    console.log("Poseidon hash result:", result.toString());
  } catch (error) {
    console.error("Error calling poseidon function:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script execution failed!");
    console.error(error);
    process.exit(1);
  }); 