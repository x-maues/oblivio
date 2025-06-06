import { Chain } from 'viem';

export const paseoPassetHub = {
  id: 420420421,
  name: 'Paseo Passet Hub',
  nativeCurrency: {
    decimals: 18,
    name: 'Paseo',
    symbol: 'PAS',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-passet-hub-eth-rpc.polkadot.io'],
    },
    public: {
      http: ['https://testnet-passet-hub-eth-rpc.polkadot.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://blockscout-passet-hub.parity-testnet.parity.io',
    },
  },
  testnet: true,
} as const;

export const chains = [paseoPassetHub] as const; 