// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Poseidon.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EnhancedShieldedPool
 * @dev An improved shielded pool implementation with enhanced privacy features
 */
contract EnhancedShieldedPool is ReentrancyGuard, Pausable, Ownable {
    //state variables
    Poseidon public poseidon;
    
    // Token registry for multiple token support
    mapping(address => bool) public supportedTokens;
    mapping(address => uint256) public tokenBalances;
    
    // Privacy parameters
    uint256 public constant MIN_MIXING_PERIOD = 5 seconds;  // Changed from 1 hour
    uint256 public constant MAX_MIXING_PERIOD = 30 seconds; // Changed from 24 hours
    uint256 public constant MIN_MIX_SIZE = 2;
    uint256 public constant MAX_MIX_SIZE = 10;  // Reduced from 10 for testing
    
    // Dynamic mixing parameters
    uint256 public currentMixingPeriod;
    uint256 public currentMixSize;
    
    // Commitment tracking
    mapping(bytes32 => Commitment) public commitments;
    mapping(bytes32 => bool) public nullifierUsed;
    
    // Batch processing
    uint256 public constant BATCH_SIZE = 50;
    uint256 public currentBatchId;
    mapping(uint256 => Batch) public batches;
    
    struct Commitment {
        bool exists;
        uint256 timestamp;
        uint256 amount;
        address token;
        uint256 batchId;
    }
    
    struct Batch {
        bytes32[] commitments;
        uint256 timestamp;
        bool processed;
    }
    
    event TokenAdded(address indexed token);
    event TokenRemoved(address indexed token);
    event Shielded(
        address indexed token,
        bytes32 commitment,
        uint256 amount,
        uint256 batchId,
        uint256 timestamp
    );
    event Unshielded(
        address indexed token,
        address indexed recipient,
        uint256 amount,
        bytes32 nullifier,
        uint256 batchId
    );
    event BatchProcessed(uint256 indexed batchId, uint256 commitmentCount);
    event MixingParametersUpdated(uint256 mixingPeriod, uint256 mixSize);
    
    constructor(address _poseidonAddress) Ownable(msg.sender) {
        poseidon = Poseidon(_poseidonAddress);
        currentMixingPeriod = MIN_MIXING_PERIOD;
        currentMixSize = MIN_MIX_SIZE;
    }
    
    /**
     * @dev Add a supported token
     */
    function addToken(address token) external onlyOwner {
        require(token != address(0), "Invalid token address");
        require(!supportedTokens[token], "Token already supported");
        supportedTokens[token] = true;
        emit TokenAdded(token);
    }
    
    /**
     * @dev Remove a supported token
     */
    function removeToken(address token) external onlyOwner {
        require(supportedTokens[token], "Token not supported");
        supportedTokens[token] = false;
        emit TokenRemoved(token);
    }
    
    /**
     * @dev Update mixing parameters
     */
    function updateMixingParameters(uint256 newMixingPeriod, uint256 newMixSize) external onlyOwner {
        require(newMixingPeriod >= MIN_MIXING_PERIOD && newMixingPeriod <= MAX_MIXING_PERIOD, "Invalid mixing period");
        require(newMixSize >= MIN_MIX_SIZE && newMixSize <= MAX_MIX_SIZE, "Invalid mix size");
        currentMixingPeriod = newMixingPeriod;
        currentMixSize = newMixSize;
        emit MixingParametersUpdated(newMixingPeriod, newMixSize);
    }
    
    /**
     * @dev Shield tokens with enhanced privacy
     */
    function shield(
        address token,
        uint256 amount,
        bytes32 commitment,
        bytes32 salt
    ) external nonReentrant whenNotPaused {
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Amount must be greater than 0");
        require(commitment != bytes32(0), "Invalid commitment");
        require(!commitments[commitment].exists, "Commitment already exists");
        
        // Verify commitment using Poseidon hash
        bytes32 expectedCommitment = bytes32(poseidon.poseidon(
            uint256(uint160(msg.sender)),
            uint256(uint160(token)),
            amount,
            uint256(salt)
        ));
        require(commitment == expectedCommitment, "Invalid commitment");
        
        // Transfer tokens
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Create new batch if needed
        if (batches[currentBatchId].commitments.length >= BATCH_SIZE) {
            currentBatchId++;
        }
        
        // Store commitment
        commitments[commitment] = Commitment({
            exists: true,
            timestamp: block.timestamp,
            amount: amount,
            token: token,
            batchId: currentBatchId
        });
        
        // Add to current batch
        batches[currentBatchId].commitments.push(commitment);
        batches[currentBatchId].timestamp = block.timestamp;
        
        emit Shielded(token, commitment, amount, currentBatchId, block.timestamp);
    }
    
    /**
     * @dev Process a batch of commitments
     */
    function processBatch(uint256 batchId) external nonReentrant whenNotPaused {
        Batch storage batch = batches[batchId];
        require(!batch.processed, "Batch already processed");
        require(batch.commitments.length > 0, "Empty batch");
        require(block.timestamp >= batch.timestamp + currentMixingPeriod, "Mixing period not elapsed");
        
        batch.processed = true;
        emit BatchProcessed(batchId, batch.commitments.length);
    }
    
    /**
     * @dev Unshield tokens with enhanced privacy
     */
    function unshield(
        address token,
        address recipient,
        uint256 amount,
        bytes32 nullifier,
        bytes32[] calldata proof
    ) external nonReentrant whenNotPaused {
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Amount must be greater than 0");
        require(!nullifierUsed[nullifier], "Nullifier already used");
        
        // Verify nullifier and proof
        bytes32 expectedNullifier = bytes32(poseidon.poseidon(
            uint256(uint160(recipient)),
            uint256(uint160(token)),
            amount,
            uint256(block.timestamp)
        ));
        require(nullifier == expectedNullifier, "Invalid nullifier");
        
        // Verify proof (simplified for example)
        require(verifyProof(proof, nullifier), "Invalid proof");
        
        // Mark nullifier as used
        nullifierUsed[nullifier] = true;
        
        // Transfer tokens
        require(IERC20(token).transfer(recipient, amount), "Transfer failed");
        
        emit Unshielded(token, recipient, amount, nullifier, currentBatchId);
    }
    
    /**
     * @dev Verify zero-knowledge proof (placeholder)
     */
    function verifyProof(bytes32[] calldata proof, bytes32 nullifier) internal pure returns (bool) {
        // In a real implementation, this would verify a zero-knowledge proof
        // For now, we'll return true as a placeholder
        return true;
    }
    
    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get commitment details
     */
    function getCommitment(bytes32 commitment) external view returns (
        bool exists,
        uint256 timestamp,
        uint256 amount,
        address token,
        uint256 batchId
    ) {
        Commitment storage c = commitments[commitment];
        return (c.exists, c.timestamp, c.amount, c.token, c.batchId);
    }
    
    /**
     * @dev Get batch details
     */
    function getBatch(uint256 batchId) external view returns (
        bytes32[] memory batchCommitments,
        uint256 timestamp,
        bool processed
    ) {
        Batch storage b = batches[batchId];
        return (b.commitments, b.timestamp, b.processed);
    }
} 