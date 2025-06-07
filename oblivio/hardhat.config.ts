import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "@typechain/ethers-v6";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
        
      },
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    paseoPasset: {
      url: "https://testnet-passet-hub-eth-rpc.polkadot.io",
      chainId: 420420421,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 gwei
      gas: 5000000 // Gas limit
    },
    coston2: {
      url: "https://coston2-api.flare.network/ext/bc/C/rpc",
      chainId: 114,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 25000000000, // 25 gwei (default for Flare testnets)
      gas: 5000000 // Gas limit
    }
  },
  etherscan: {
    apiKey: {
      paseoPasset: "your-api-key", // You'll need to get this from the explorer
      coston2: "your-api-key" // You'll need to get this from Flarescan
    },
    customChains: [
      {
        network: "paseoPasset",
        chainId: 420420421,
        urls: {
          apiURL: "https://blockscout-passet-hub.parity-testnet.parity.io/api",
          browserURL: "https://blockscout-passet-hub.parity-testnet.parity.io"
        }
      },
      {
        network: "coston2",
        chainId: 114,
        urls: {
          apiURL: "https://114.testnet.flarescan.com/api",
          browserURL: "https://114.testnet.flarescan.com"
        }
      }
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

export default config; 