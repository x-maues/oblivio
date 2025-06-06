const { ethers } = require("hardhat");

async function main() {
    console.log("Starting Shielding System Demo...\n");

    // Get signers
    const [owner, alice, bob, charlie] = await ethers.getSigners();
    console.log("Deployer:", owner.address);
    console.log("Alice:", alice.address);
    console.log("Bob:", bob.address);
    console.log("Charlie:", charlie.address);
    console.log("\n");

    // Deploy Poseidon contract
    console.log("Deploying Poseidon contract...");
    const Poseidon = await ethers.getContractFactory("Poseidon");
    const poseidon = await Poseidon.deploy();
    await poseidon.waitForDeployment();
    console.log("Poseidon deployed to:", await poseidon.getAddress());
    console.log("\n");

    // Deploy ShieldingERC20
    console.log("Deploying ShieldingERC20 contract...");
    const ShieldingERC20 = await ethers.getContractFactory("ShieldingERC20");
    const shieldingToken = await ShieldingERC20.deploy(await poseidon.getAddress());
    await shieldingToken.waitForDeployment();
    console.log("ShieldingERC20 deployed to:", await shieldingToken.getAddress());
    console.log("\n");

    // Initial token distribution
    console.log("Distributing initial tokens...");
    const initialAmount = ethers.parseEther("1000");
    await shieldingToken.transfer(alice.address, initialAmount);
    await shieldingToken.transfer(bob.address, initialAmount);
    await shieldingToken.transfer(charlie.address, initialAmount);
    console.log("Initial distribution complete");
    console.log("Alice balance:", ethers.formatEther(await shieldingToken.balanceOf(alice.address)));
    console.log("Bob balance:", ethers.formatEther(await shieldingToken.balanceOf(bob.address)));
    console.log("Charlie balance:", ethers.formatEther(await shieldingToken.balanceOf(charlie.address)));
    console.log("\n");

    // Demonstrate shielded transfer
    console.log("Demonstrating shielded transfer...");
    const transferAmount = ethers.parseEther("100");
    
    console.log("Alice performing shielded transfer to Bob...");
    const tx = await shieldingToken.connect(alice).shieldedTransfer(bob.address, transferAmount);
    const receipt = await tx.wait();
    
    // Get the CommitmentCreated event
    const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'CommitmentCreated');
    console.log("Commitment created:", event.args.commitment);
    
    // Verify the commitment
    const isValid = await shieldingToken.verifyCommitment(bob.address, transferAmount);
    console.log("Commitment verification:", isValid ? "Valid" : "Invalid");
    
    // Check new balances
    console.log("\nUpdated balances after shielded transfer:");
    console.log("Alice balance:", ethers.formatEther(await shieldingToken.balanceOf(alice.address)));
    console.log("Bob balance:", ethers.formatEther(await shieldingToken.balanceOf(bob.address)));
    console.log("\n");

    // Demonstrate multiple shielded transfers
    console.log("Demonstrating multiple shielded transfers...");
    
    console.log("Bob performing shielded transfer to Charlie...");
    await shieldingToken.connect(bob).shieldedTransfer(charlie.address, transferAmount);
    
    console.log("Charlie performing shielded transfer to Alice...");
    await shieldingToken.connect(charlie).shieldedTransfer(alice.address, transferAmount);
    
    console.log("\nFinal balances after multiple transfers:");
    console.log("Alice balance:", ethers.formatEther(await shieldingToken.balanceOf(alice.address)));
    console.log("Bob balance:", ethers.formatEther(await shieldingToken.balanceOf(bob.address)));
    console.log("Charlie balance:", ethers.formatEther(await shieldingToken.balanceOf(charlie.address)));
    console.log("\n");

    // Demonstrate emergency controls
    console.log("Demonstrating emergency controls...");
    
    console.log("Pausing contract...");
    await shieldingToken.pause();
    console.log("Contract paused");
    
    console.log("Attempting shielded transfer while paused...");
    try {
        await shieldingToken.connect(alice).shieldedTransfer(bob.address, transferAmount);
    } catch (error) {
        console.log("Transfer failed as expected:", error.message);
    }
    
    console.log("Unpausing contract...");
    await shieldingToken.unpause();
    console.log("Contract unpaused");
    
    console.log("Attempting shielded transfer after unpause...");
    await shieldingToken.connect(alice).shieldedTransfer(bob.address, transferAmount);
    console.log("Transfer successful after unpause");
    console.log("\n");

    // Demonstrate blacklisting
    console.log("Demonstrating blacklisting...");
    
    console.log("Blacklisting Bob...");
    await shieldingToken.blacklist(bob.address);
    console.log("Bob blacklisted");
    
    console.log("Attempting transfer to blacklisted address...");
    try {
        await shieldingToken.connect(alice).shieldedTransfer(bob.address, transferAmount);
    } catch (error) {
        console.log("Transfer failed as expected:", error.message);
    }
    
    console.log("Unblacklisting Bob...");
    await shieldingToken.unblacklist(bob.address);
    console.log("Bob unblacklisted");
    
    console.log("Attempting transfer after unblacklist...");
    await shieldingToken.connect(alice).shieldedTransfer(bob.address, transferAmount);
    console.log("Transfer successful after unblacklist");
    console.log("\n");

    console.log("Demo completed successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 