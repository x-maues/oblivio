// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Poseidon.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CommitmentPool is ReentrancyGuard, Pausable, Ownable {
    Poseidon public poseidon;
    
    // Token registry
    mapping(address => bool) public supportedTokens;
    
    // Commitment tracking
    struct Commitment {
        bool exists;
        uint256 totalAmount;      // Total amount in the commitment
        uint256 remainingAmount;  // Amount still available to withdraw
        address token;            // Token address
    }
    
    // Track commitments and their usage
    mapping(uint256 => Commitment) public commitments;
    mapping(uint256 => bool) public nullifierUsed;
    
    // Events
    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    event CommitmentCreated(
        uint256 indexed commitment,
        address indexed token,
        uint256 amount
    );
    event TokensWithdrawn(
        uint256 indexed commitment,
        address indexed recipient,
        uint256 amount,
        uint256 remainingAmount
    );
    
    constructor(address _poseidonAddress) Ownable(msg.sender) {
        poseidon = Poseidon(_poseidonAddress);
    }
    
    function addToken(address token) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(!supportedTokens[token], "Token already supported");
        supportedTokens[token] = true;
        emit TokenAdded(token);
    }
    
    function removeToken(address token) external onlyOwner {
        require(supportedTokens[token], "Token not supported");
        supportedTokens[token] = false;
        emit TokenRemoved(token);
    }
    
    /**
     * @dev Create a commitment by depositing tokens
     * @param token The token to deposit
     * @param amount Total amount to commit
     * @param commitment The commitment hash
     * @param salt A random salt for the commitment
     * @param nonce A unique number for this commitment
     */
    function createCommitment(
        address token,
        uint256 amount,
        uint256 commitment,
        uint256 salt,
        uint256 nonce
    ) external nonReentrant whenNotPaused {
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Amount must be greater than 0");
        require(commitment != 0, "Invalid commitment");
        require(!commitments[commitment].exists, "Commitment already exists");
        
        // Verify commitment using Poseidon hash with simplified parameters
        uint256 expectedCommitment = poseidon.poseidon(
            salt,      // Use salt as first parameter
            nonce,     // Use nonce as second parameter
            amount,    // Use amount as third parameter
            0          // Use 0 as fourth parameter for simplicity
        );
        require(commitment == expectedCommitment, "Invalid commitment");
        
        // Transfer tokens from sender
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Store commitment
        commitments[commitment] = Commitment({
            exists: true,
            totalAmount: amount,
            remainingAmount: amount,
            token: token
        });
        
        emit CommitmentCreated(commitment, token, amount);
    }
    
    /**
     * @dev Withdraw tokens from a commitment using the pre-image
     * @param commitment The commitment hash
     * @param amount Amount to withdraw
     * @param recipient Address to receive the tokens
     * @param preImage The pre-image (secret) shared by the creator
     * @param nonce A unique number for this withdrawal
     */
    function withdrawFromCommitment(
        uint256 commitment,
        uint256 amount,
        address recipient,
        uint256 preImage,
        uint256 nonce
    ) external nonReentrant whenNotPaused {
        Commitment storage c = commitments[commitment];
        require(c.exists, "Commitment does not exist");
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= c.remainingAmount, "Insufficient remaining amount");
        
        // Verify the pre-image matches the commitment
        uint256 expectedCommitment = poseidon.poseidon(
            preImage,   // Use preImage as first parameter
            nonce,      // Use nonce as second parameter
            c.totalAmount, // Use total amount as third parameter
            0           // Use 0 as fourth parameter for simplicity
        );
        require(commitment == expectedCommitment, "Invalid pre-image");
        
        // Generate nullifier to prevent double-spending
        uint256 nullifier = poseidon.poseidon(
            preImage,   // Use preImage as first parameter
            nonce,      // Use nonce as second parameter
            amount,     // Use amount as third parameter
            0           // Use 0 as fourth parameter for simplicity
        );
        require(!nullifierUsed[nullifier], "Nullifier already used");
        
        // Mark nullifier as used
        nullifierUsed[nullifier] = true;
        
        // Update remaining amount
        c.remainingAmount -= amount;
        
        // Transfer tokens to recipient
        require(IERC20(c.token).transfer(recipient, amount), "Transfer failed");
        
        emit TokensWithdrawn(commitment, recipient, amount, c.remainingAmount);
    }
    
    /**
     * @dev Get commitment details
     */
    function getCommitment(uint256 commitment) external view returns (
        bool exists,
        uint256 totalAmount,
        uint256 remainingAmount,
        address token
    ) {
        Commitment storage c = commitments[commitment];
        return (c.exists, c.totalAmount, c.remainingAmount, c.token);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
} 