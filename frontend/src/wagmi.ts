import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  Chain,
} from 'wagmi/chains';

const paseoPassetHub: Chain = {
  id: 420420421,
  name: 'Paseo Passet Hub',
  nativeCurrency: {
    decimals: 18,
    name: 'Paseo Passet',
    symbol: 'PAS',
  },
  rpcUrls: {
    default: { http: ['https://testnet-passet-hub-eth-rpc.polkadot.io'] },
    public: { http: ['https://testnet-passet-hub-eth-rpc.polkadot.io'] },
  },
  blockExplorers: {
    default: { name: 'Blockscout', url: 'https://blockscout-passet-hub.parity-testnet.parity.io' },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    paseoPassetHub,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});
