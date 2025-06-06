require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
        details: {
          yul: true,
          yulDetails: {
            stackAllocation: true,
            optimizerSteps: "dhfoDgvulfnTUtnIf"
          }
        }
      },
      viaIR: true
    }
  },
  networks: {
    paseoPasset: {
      url: "https://testnet-passet-hub-eth-rpc.polkadot.io",
      chainId: 420420421,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 gwei
      gas: 5000000, // Gas limit
      timeoutBlocks: 200,
      confirmations: 2
    }
  },
  etherscan: {
    apiKey: {
      paseoPasset: "your-api-key" // You'll need to get this from the explorer
    }
  }
}; 