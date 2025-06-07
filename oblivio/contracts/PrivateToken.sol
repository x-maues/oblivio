// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Poseidon.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract MockERC20 is ERC20 {
    constructor() ERC20("Mock Token", "MTK") {
        // Mint initial supply to the deployer
        _mint(msg.sender, 1000000 * 10**decimals());
    }
    
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract PrivateTransfer {
    using SafeERC20 for ERC20;
    
    Poseidon public poseidon;
    ERC20 public token;
    
    // Commitment => amount
    mapping(uint256 => uint256) public commitments;
    // Commitment => withdrawn
    mapping(uint256 => bool) public withdrawn;
    
    event Deposit(uint256 commitment, uint256 amount);
    event Withdraw(address recipient, uint256 amount);
    
    constructor(address _token) {
        poseidon = new Poseidon();
        token = ERC20(_token);
    }
    
    // Debug function to check token balance
    function getTokenBalance(address account) public view returns (uint256) {
        return token.balanceOf(account);
    }
    
    // Debug function to check allowance
    function getAllowance(address owner, address spender) public view returns (uint256) {
        return token.allowance(owner, spender);
    }
    
    // Deposit tokens with a secret
    function deposit(uint256 amount, uint256 secret) public {
        require(amount > 0, "Amount must be positive");
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(token.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");
        
        token.safeTransferFrom(msg.sender, address(this), amount);
        
        // Create commitment using Poseidon hash
        uint256 commitment = poseidon.poseidon(secret, 0, 0, 0);
        
        commitments[commitment] = amount;
        emit Deposit(commitment, amount);
    }
    
    // Withdraw tokens using the secret
    function withdraw(uint256 secret) public {
        uint256 commitment = poseidon.poseidon(secret, 0, 0, 0);
        require(commitments[commitment] > 0, "Invalid commitment");
        require(!withdrawn[commitment], "Already withdrawn");
        
        uint256 amount = commitments[commitment];
        withdrawn[commitment] = true;
        
        token.safeTransfer(msg.sender, amount);
        emit Withdraw(msg.sender, amount);
    }
} 