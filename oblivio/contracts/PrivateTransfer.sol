// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Poseidon.sol";



/// @title Private Token Transfer using Poseidon hash
contract PrivateTransfer is Poseidon {
    ERC20 public token;

    struct Commitment {
        uint256 amount;
        uint256 nullifierHash;
        bool exists;
    }

    mapping(uint256 => Commitment) public commitments;
    mapping(uint256 => bool) public nullifierUsed;

    event Deposit(uint256 indexed commitmentHash, uint256 amount);
    event Withdrawal(uint256 indexed nullifierHash, address to, uint256 amount);

    constructor(address _token) {
        token = ERC20(_token);
    }

    function deposit(uint256 secret, uint256 nullifier, uint256 amount) external {
        require(amount > 0, "Amount must be positive");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        uint256 commitmentHash = hash(secret, nullifier);
        require(!commitments[commitmentHash].exists, "Already deposited");

        commitments[commitmentHash] = Commitment({
            amount: amount,
            nullifierHash: hash(nullifier, secret),
            exists: true
        });

        emit Deposit(commitmentHash, amount);
    }

    function withdraw(uint256 secret, uint256 nullifier, uint256 withdrawAmount, address to) external {
        uint256 commitmentHash = hash(secret, nullifier);
        require(commitments[commitmentHash].exists, "Invalid commitment");
        require(commitments[commitmentHash].amount >= withdrawAmount, "Insufficient committed amount");

        uint256 nullifierHash = hash(nullifier, secret);
        require(nullifierHash == commitments[commitmentHash].nullifierHash, "Invalid nullifier");
        require(!nullifierUsed[nullifierHash], "Nullifier already used");

        if (withdrawAmount == commitments[commitmentHash].amount) {
            nullifierUsed[nullifierHash] = true;
            delete commitments[commitmentHash];
        } else {
            commitments[commitmentHash].amount -= withdrawAmount;
        }

        require(token.transfer(to, withdrawAmount), "Transfer failed");

        emit Withdrawal(nullifierHash, to, withdrawAmount);
    }

    function generateCommitmentHash(uint256 secret, uint256 nullifier) external view returns (uint256) {
        return hash(secret, nullifier);
    }

    function generateNullifierHash(uint256 nullifier, uint256 secret) external view returns (uint256) {
        return hash(nullifier, secret);
    }

    function checkCommitment(uint256 commitmentHash) external view returns (bool exists, uint256 amount) {
        Commitment memory commitment = commitments[commitmentHash];
        return (commitment.exists, commitment.amount);
    }

    function isNullifierUsed(uint256 nullifierHash) external view returns (bool) {
        return nullifierUsed[nullifierHash];
    }
}

