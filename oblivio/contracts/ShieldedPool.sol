// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Poseidon.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ShieldedPool is ReentrancyGuard {
    Poseidon public poseidon;
    IERC20 public token;
    
    // Store commitments for shielded deposits
    mapping(bytes32 => bool) public commitmentExists;
    // Store nullifiers to prevent double-spending
    mapping(bytes32 => bool) public nullifierUsed;
    // Store deposit timestamps for mixing
    mapping(bytes32 => uint256) public depositTimestamps;
    // Minimum time between deposit and withdrawal for mixing
    uint256 public constant MIXING_PERIOD = 1 hours;
    // Maximum number of deposits that can be mixed together
    uint256 public constant MAX_MIX_SIZE = 3;

    event Shielded(address indexed from, bytes32 commitment, uint256 timestamp);
    event Unshielded(address indexed to, uint256 amount, bytes32 nullifier);
    event Mixed(bytes32[] commitments, bytes32[] nullifiers);

    constructor(address _poseidonAddress, address _tokenAddress) {
        poseidon = Poseidon(_poseidonAddress);
        token = IERC20(_tokenAddress);
    }

    // Shield tokens: deposit tokens and create a commitment
    function shield(uint256 amount, bytes32 commitment) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(commitment != bytes32(0), "Invalid commitment");
        require(!commitmentExists[commitment], "Commitment already exists");
        
        // Transfer tokens from user to the pool
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Store the commitment and timestamp
        commitmentExists[commitment] = true;
        depositTimestamps[commitment] = block.timestamp;
        
        emit Shielded(msg.sender, commitment, block.timestamp);
    }

    // Mix multiple deposits together and withdraw
    function mixAndWithdraw(
        address[] calldata recipients,
        uint256[] calldata amounts,
        bytes32[] calldata nullifiers,
        bytes32[] calldata commitments
    ) external nonReentrant {
        require(recipients.length == amounts.length, "Array lengths must match");
        require(recipients.length == nullifiers.length, "Array lengths must match");
        require(recipients.length == commitments.length, "Array lengths must match");
        require(recipients.length <= MAX_MIX_SIZE, "Too many transactions");
        require(recipients.length > 1, "Need at least 2 transactions for mixing");

        // Verify all commitments exist and mixing period has passed
        for (uint256 i = 0; i < commitments.length; i++) {
            bytes32 commitment = commitments[i];
            require(commitment != bytes32(0), "Invalid commitment");
            require(commitmentExists[commitment], "Commitment not found");
            require(
                block.timestamp >= depositTimestamps[commitment] + MIXING_PERIOD,
                "Mixing period not elapsed"
            );
        }

        // Verify all nullifiers are unused
        for (uint256 i = 0; i < nullifiers.length; i++) {
            require(!nullifierUsed[nullifiers[i]], "Nullifier already used");
        }

        // Verify commitments match withdrawal details
        for (uint256 i = 0; i < commitments.length; i++) {
            bytes32 expectedCommitment = bytes32(poseidon.poseidon(uint256(uint160(recipients[i])), amounts[i]));
            require(commitments[i] == expectedCommitment, "Invalid commitment");
        }

        // Mark nullifiers as used
        for (uint256 i = 0; i < nullifiers.length; i++) {
            nullifierUsed[nullifiers[i]] = true;
        }

        // Transfer tokens to recipients using safe transfer
        for (uint256 i = 0; i < recipients.length; i++) {
            bool success = token.transfer(recipients[i], amounts[i]);
            require(success, "Transfer failed");
            emit Unshielded(recipients[i], amounts[i], nullifiers[i]);
        }

        emit Mixed(commitments, nullifiers);
    }

    // View function to check if a commitment exists
    function isCommitmentValid(bytes32 commitment) external view returns (bool) {
        return commitmentExists[commitment];
    }

    // View function to check if a nullifier has been used
    function isNullifierUsed(bytes32 nullifier) external view returns (bool) {
        return nullifierUsed[nullifier];
    }

    // View function to get deposit timestamp
    function getDepositTimestamp(bytes32 commitment) external view returns (uint256) {
        return depositTimestamps[commitment];
    }
} 