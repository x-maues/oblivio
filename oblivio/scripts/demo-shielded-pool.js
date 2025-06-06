const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Starting ShieldedPool Demo...");

    // Get signers (accounts)
    const [deployer, alice, bob, charlie, dave] = await ethers.getSigners();
    console.log("\n👥 Accounts:");
    console.log("Deployer:", deployer.address);
    console.log("Alice:", alice.address);
    console.log("Bob:", bob.address);
    console.log("Charlie:", charlie.address);
    console.log("Dave:", dave.address);

    // Deploy Poseidon contract
    console.log("\n📦 Deploying Poseidon contract...");
    const Poseidon = await ethers.getContractFactory("Poseidon");
    const poseidon = await Poseidon.deploy();
    await poseidon.deployed();
    console.log("Poseidon deployed to:", poseidon.address);

    // Deploy MockERC20 contract
    console.log("\n📦 Deploying MockERC20 contract...");
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const token = await MockERC20.deploy();
    await token.deployed();
    console.log("MockERC20 deployed to:", token.address);

    // Deploy ShieldedPool contract
    console.log("\n📦 Deploying ShieldedPool contract...");
    const ShieldedPool = await ethers.getContractFactory("ShieldedPool");
    const pool = await ShieldedPool.deploy(poseidon.address, token.address);
    await pool.deployed();
    console.log("ShieldedPool deployed to:", pool.address);

    // Initial token distribution
    console.log("\n💰 Distributing initial tokens...");
    const initialAmount = ethers.utils.parseEther("1000");
    await token.transfer(alice.address, initialAmount);
    await token.transfer(bob.address, initialAmount);
    await token.transfer(charlie.address, initialAmount);
    await token.transfer(dave.address, initialAmount);

    console.log("Initial balances:");
    console.log("Alice:", ethers.utils.formatEther(await token.balanceOf(alice.address)), "tokens");
    console.log("Bob:", ethers.utils.formatEther(await token.balanceOf(bob.address)), "tokens");
    console.log("Charlie:", ethers.utils.formatEther(await token.balanceOf(charlie.address)), "tokens");
    console.log("Dave:", ethers.utils.formatEther(await token.balanceOf(dave.address)), "tokens");

    // Alice wants to send 100 tokens to Bob privately
    console.log("\n🔒 Alice is shielding 100 tokens for Bob...");
    const shieldAmount = ethers.utils.parseEther("100");
    
    // Create commitment
    const commitment = await poseidon.poseidon(
        ethers.BigNumber.from(bob.address),
        shieldAmount
    );
    console.log("Created commitment:", commitment);

    // Approve and shield
    await token.connect(alice).approve(pool.address, shieldAmount);
    await pool.connect(alice).shield(shieldAmount, commitment);
    console.log("Tokens shielded successfully!");

    // Charlie wants to send 50 tokens to Dave privately
    console.log("\n🔒 Charlie is shielding 50 tokens for Dave...");
    const shieldAmount2 = ethers.utils.parseEther("50");
    
    // Create commitment
    const commitment2 = await poseidon.poseidon(
        ethers.BigNumber.from(dave.address),
        shieldAmount2
    );
    console.log("Created commitment:", commitment2);

    // Approve and shield
    await token.connect(charlie).approve(pool.address, shieldAmount2);
    await pool.connect(charlie).shield(shieldAmount2, commitment2);
    console.log("Tokens shielded successfully!");

    // Dave wants to send 75 tokens to Alice privately
    console.log("\n🔒 Dave is shielding 75 tokens for Alice...");
    const shieldAmount3 = ethers.utils.parseEther("75");
    
    // Create commitment
    const commitment3 = await poseidon.poseidon(
        ethers.BigNumber.from(alice.address),
        shieldAmount3
    );
    console.log("Created commitment:", commitment3);

    // Approve and shield
    await token.connect(dave).approve(pool.address, shieldAmount3);
    await pool.connect(dave).shield(shieldAmount3, commitment3);
    console.log("Tokens shielded successfully!");

    // Wait for mixing period (1 hour)
    console.log("\n⏳ Waiting for mixing period (1 hour)...");
    await ethers.provider.send("evm_increaseTime", [3600]); // Increase time by 1 hour
    await ethers.provider.send("evm_mine"); // Mine a new block

    // Create nullifiers
    console.log("\n🔑 Creating nullifiers for mixing...");
    const nullifier1 = await poseidon.poseidon(
        ethers.BigNumber.from(bob.address),
        ethers.BigNumber.from(Math.floor(Date.now() / 1000))
    );
    const nullifier2 = await poseidon.poseidon(
        ethers.BigNumber.from(dave.address),
        ethers.BigNumber.from(Math.floor(Date.now() / 1000))
    );
    const nullifier3 = await poseidon.poseidon(
        ethers.BigNumber.from(alice.address),
        ethers.BigNumber.from(Math.floor(Date.now() / 1000))
    );

    // Mix and withdraw
    console.log("\n🔄 Mixing and withdrawing tokens...");
    const recipients = [bob.address, dave.address, alice.address];
    const amounts = [shieldAmount, shieldAmount2, shieldAmount3];
    const nullifiers = [nullifier1, nullifier2, nullifier3];
    const commitments = [commitment, commitment2, commitment3];

    await pool.mixAndWithdraw(recipients, amounts, nullifiers, commitments);
    console.log("Mix and withdraw completed successfully!");

    // Check final balances
    console.log("\n💰 Final balances:");
    console.log("Alice:", ethers.utils.formatEther(await token.balanceOf(alice.address)), "tokens");
    console.log("Bob:", ethers.utils.formatEther(await token.balanceOf(bob.address)), "tokens");
    console.log("Charlie:", ethers.utils.formatEther(await token.balanceOf(charlie.address)), "tokens");
    console.log("Dave:", ethers.utils.formatEther(await token.balanceOf(dave.address)), "tokens");

    // Verify commitments are spent
    console.log("\n🔍 Verifying commitments are spent...");
    console.log("Commitment 1 spent:", await pool.isCommitmentValid(commitment));
    console.log("Commitment 2 spent:", await pool.isCommitmentValid(commitment2));
    console.log("Commitment 3 spent:", await pool.isCommitmentValid(commitment3));

    // Verify nullifiers are used
    console.log("\n🔍 Verifying nullifiers are used...");
    console.log("Nullifier 1 used:", await pool.isNullifierUsed(nullifier1));
    console.log("Nullifier 2 used:", await pool.isNullifierUsed(nullifier2));
    console.log("Nullifier 3 used:", await pool.isNullifierUsed(nullifier3));

    console.log("\n✅ Demo completed successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 