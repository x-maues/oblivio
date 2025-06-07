// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Poseidon.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PrivateTransfer is ReentrancyGuard {
    Poseidon public poseidon;
    IERC20 public token;
    
    // Commitment => amount
    mapping(uint256 => uint256) public commitments;
    // Nullifier => bool (to prevent double spending)
    mapping(uint256 => bool) public nullifiers;
    
    event CommitmentCreated(uint256 commitment, uint256 amount);
    event FundsWithdrawn(uint256 nullifier, address recipient, uint256 amount);
    
    constructor(address _token) {
        poseidon = new Poseidon();
        token = IERC20(_token);
    }
    
    // Create a commitment by depositing tokens
    function createCommitment(uint256 amount, uint256 secret) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Create commitment using Poseidon hash
        uint256 commitment = poseidon.poseidon(amount, secret, 0, 0);
        
        commitments[commitment] = amount;
        emit CommitmentCreated(commitment, amount);
    }
    
    // Withdraw funds using a nullifier
    function withdraw(
        uint256 amount,
        uint256 secret,
        uint256 nullifier
    ) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(!nullifiers[nullifier], "Nullifier already used");
        
        // Verify the commitment
        uint256 commitment = poseidon.poseidon(amount, secret, 0, 0);
        require(commitments[commitment] >= amount, "Insufficient commitment");
        
        // Mark nullifier as used
        nullifiers[nullifier] = true;
        
        // Update commitment amount
        commitments[commitment] -= amount;
        
        // Transfer tokens to recipient
        require(token.transfer(msg.sender, amount), "Transfer failed");
        
        emit FundsWithdrawn(nullifier, msg.sender, amount);
    }
    
    // Get commitment balance
    function getCommitmentBalance(uint256 commitment) external view returns (uint256) {
        return commitments[commitment];
    }
} 