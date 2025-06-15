// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Poseidon.sol";

contract PrivateTransfer is Poseidon, Pausable, Ownable, ReentrancyGuard {
    // Token registry
    mapping(address => bool) public supportedTokens;
    mapping(address => uint256) public tokenDecimals;

    // Commitment tracking with improved privacy
    struct Commitment {
        uint256 amount;
        uint256 nullifierHash;
        uint256 timestamp;
        address token;
        bool exists;
    }

    // Enhanced privacy features
    struct MixingPool {
        uint256 totalAmount;
        uint256 lastMixTimestamp;
        uint256 mixingPeriod;
    }

    // State variables
    mapping(uint256 => Commitment) public commitments;
    mapping(uint256 => bool) public nullifierUsed;
    mapping(address => MixingPool) public mixingPools;
    
    // Constants
    uint256 public constant MIN_MIXING_PERIOD = 1 hours;
    uint256 public constant MAX_MIXING_PERIOD = 24 hours;
    uint256 public constant MIN_MIX_SIZE = 3;
    
    // Events
    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    event Deposit(
        uint256 indexed commitmentHash,
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );
    event Withdrawal(
        uint256 indexed nullifierHash,
        address indexed token,
        address indexed recipient,
        uint256 amount
    );
    event MixingPeriodUpdated(address indexed token, uint256 newPeriod);

    constructor() Ownable(msg.sender) {}

    // Token management
    function addToken(address token) external onlyOwner {
        require(token != address(0), "Invalid token");
        require(!supportedTokens[token], "Token already supported");
        supportedTokens[token] = true;
        tokenDecimals[token] = IERC20Metadata(token).decimals();
        emit TokenAdded(token);
    }

    function removeToken(address token) external onlyOwner {
        require(supportedTokens[token], "Token not supported");
        supportedTokens[token] = false;
        emit TokenRemoved(token);
    }

    // Internal deposit logic
    function _deposit(
        address token,
        uint256 amount,
        uint256 secret,
        uint256 nullifier
    ) internal {
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Amount must be positive");

        // Generate commitment with enhanced privacy
        uint256 commitmentHash = hash(
            hash(uint256(uint160(token)), amount),
            hash(secret, nullifier)
        );
        
        require(!commitments[commitmentHash].exists, "Commitment already exists");

        // Store commitment with timestamp
        commitments[commitmentHash] = Commitment({
            amount: amount,
            nullifierHash: hash(nullifier, secret),
            timestamp: block.timestamp,
            token: token,
            exists: true
        });

        // Update mixing pool
        MixingPool storage pool = mixingPools[token];
        pool.totalAmount += amount;
        pool.lastMixTimestamp = block.timestamp;

        emit Deposit(commitmentHash, token, amount, block.timestamp);
    }

    // Enhanced deposit with mixing
    function deposit(
        address token,
        uint256 amount,
        uint256 secret,
        uint256 nullifier
    ) external nonReentrant whenNotPaused {
        // Transfer tokens
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Call internal deposit logic
        _deposit(token, amount, secret, nullifier);
    }

    // Enhanced withdrawal with mixing
    function withdraw(
        address token,
        uint256 amount,
        uint256 secret,
        uint256 nullifier,
        address recipient
    ) external nonReentrant whenNotPaused {
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Amount must be positive");
        
        uint256 commitmentHash = hash(
            hash(uint256(uint160(token)), amount),
            hash(secret, nullifier)
        );
        
        Commitment storage commitment = commitments[commitmentHash];
        require(commitment.exists, "Invalid commitment");
        require(commitment.token == token, "Token mismatch");
        require(commitment.amount >= amount, "Insufficient amount");

        // Verify nullifier
        uint256 nullifierHash = hash(nullifier, secret);
        require(nullifierHash == commitment.nullifierHash, "Invalid nullifier");
        require(!nullifierUsed[nullifierHash], "Nullifier already used");

        // Check mixing period
        MixingPool storage pool = mixingPools[token];
        require(
            block.timestamp >= commitment.timestamp + pool.mixingPeriod,
            "Mixing period not elapsed"
        );

        // Mark nullifier as used
        nullifierUsed[nullifierHash] = true;

        // Update commitment
        if (amount == commitment.amount) {
            delete commitments[commitmentHash];
        } else {
            commitment.amount -= amount;
        }

        // Update mixing pool
        pool.totalAmount -= amount;

        // Transfer tokens
        require(IERC20(token).transfer(recipient, amount), "Transfer failed");

        emit Withdrawal(nullifierHash, token, recipient, amount);
    }

    // Batch operations for efficiency
    function batchDeposit(
        address token,
        uint256[] calldata amounts,
        uint256[] calldata secrets,
        uint256[] calldata nullifiers
    ) external nonReentrant whenNotPaused {
        require(amounts.length == secrets.length && secrets.length == nullifiers.length, "Array length mismatch");
        
        // Calculate total amount needed
        uint256 totalAmount = 0;
        for(uint i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        // Transfer total amount once
        require(IERC20(token).transferFrom(msg.sender, address(this), totalAmount), "Transfer failed");
        
        // Process each deposit
        for(uint i = 0; i < amounts.length; i++) {
            _deposit(token, amounts[i], secrets[i], nullifiers[i]);
        }
    }

    // Emergency functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // View functions
    function getMixingPool(address token) external view returns (
        uint256 totalAmount,
        uint256 lastMixTimestamp,
        uint256 mixingPeriod
    ) {
        MixingPool storage pool = mixingPools[token];
        return (pool.totalAmount, pool.lastMixTimestamp, pool.mixingPeriod);
    }

    function updateMixingPeriod(address token, uint256 newPeriod) external onlyOwner {
        require(newPeriod >= MIN_MIXING_PERIOD && newPeriod <= MAX_MIXING_PERIOD, "Invalid period");
        mixingPools[token].mixingPeriod = newPeriod;
        emit MixingPeriodUpdated(token, newPeriod);
    }
}