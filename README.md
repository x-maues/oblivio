# Oblivio: Privacy-Preserving Token System on Polkadot AssetHub

## Overview

Oblivio is a privacy-preserving token system built for the Polkadot AssetHub Hackathon 2025. At its core is an efficient implementation of the Poseidon hash function in Solidity, optimized for PolkaVM. This implementation serves as the cryptographic foundation for privacy-preserving transactional operations in the Polkadot ecosystem.

## Vision & Purpose

Oblivio aims to bring efficient cryptographic primitives to Polkadot AssetHub while maintaining full compatibility with the ecosystem. The project addresses several key challenges:

1. **Efficient Cryptographic Primitives**: Provides a gas-efficient Poseidon hash implementation
2. **PolkaVM Optimization**: Demonstrates efficient use of PolkaVM's enhanced capabilities
3. **Developer Experience**: Showcases best practices for Solidity development on PolkaVM
4. **Privacy Foundation**: Serves as a building block for privacy-preserving applications

## Technical Architecture

### Core Component: Poseidon Hash Function

The Poseidon hash function is a cryptographic primitive designed specifically for zero-knowledge proof systems. This implementation (`Poseidon.sol`) is practical, optimized and standardized for PolkaVM and serves as the foundation for privacy-preserving operations.

#### Key Features of Our Poseidon Implementation:

1. **Optimized for PolkaVM**
   

2. **Cryptographic Properties**
   - Collision resistance
   - Preimage resistance
   - Second preimage resistance
   - Efficient in zero-knowledge proof systems

3. **Technical Details**
   - Implemented in pure Solidity
   - No external dependencies
   - Gas-efficient operations
   - Compatible with standard zero-knowledge proof systems

#### Usage in Privacy Mechanisms

The Poseidon hash function is used in several privacy-preserving mechanisms:

1. **Commitment Generation**
   ```solidity
   bytes32 commitment = bytes32(poseidon.poseidon(uint256(uint160(recipient)), amount));
   ```
   - Combines recipient address and amount into a single commitment
   - Ensures privacy while maintaining verifiability
   - Efficient verification mechanism

2. **Nullifier Generation**
   - Prevents double-spending
   - Maintains privacy while ensuring security
   - Efficient verification mechanism

### Supporting Components

#### Shielded Pool (`ShieldedPool.sol`)
- Utilizes Poseidon hash for commitment and nullifier generation
- Implements mixing mechanism for enhanced privacy
- Features time-based mixing periods and maximum mix size limits

#### Shielding Token (`ShieldingERC20.sol`)
- Basic ERC20 token with privacy features
- Uses Poseidon hash for commitment verification
- Implements standard security features

## Development & Deployment

### Prerequisites
- Node.js >= 16
- Hardhat
- Polkadot AssetHub testnet access

### Installation
```bash
npm install
```

### Testing
```bash
npx hardhat test
```

### Deployment
```bash
npx hardhat run scripts/deploy.js --network paseoPasset
```

## Security Considerations

1. **Cryptographic Security**
   - Thorough testing of hash function properties
   - Constant-time operations where possible
   - Protection against timing attacks

2. **Access Control**
   - Owner-only functions for critical operations
   - Blacklist mechanism for compliance

3. **Emergency Controls**
   - Pause mechanism for critical situations
   - Blacklist functionality for compliance

## Future Enhancements

1. **Advanced Privacy Features**
   - Zero-knowledge proof integration
   - Enhanced mixing mechanisms

2. **ERC-20 Modifications**

3. **Analytics**
   - Privacy-preserving analytics
   - Compliance reporting

## Acknowledgments

- Polkadot AssetHub Hackathon 2025
- PolkaVM team
- OpenZeppelin for security patterns

