const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Oblivio System Walkthrough", function () {
  let poseidon, shieldedPool, mockToken;
  let owner, alice, bob, charlie, dave, eve;
  let aliceCommitment, bobCommitment, charlieCommitment, daveCommitment, eveCommitment;
  let aliceNullifier, bobNullifier, charlieNullifier, daveNullifier, eveNullifier;
  
  const DEPOSIT_AMOUNT = ethers.parseEther("100");
  const MIXING_PERIOD = 3600; // 1 hour in seconds

  beforeEach(async function () {
    // Get signers
    [owner, alice, bob, charlie, dave, eve] = await ethers.getSigners();

    // Deploy MockERC20 token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy();
    await mockToken.waitForDeployment();

    // Deploy Poseidon contract
    const Poseidon = await ethers.getContractFactory("Poseidon");
    poseidon = await Poseidon.deploy();
    await poseidon.waitForDeployment();

    // Deploy ShieldedPool contract
    const ShieldedPool = await ethers.getContractFactory("ShieldedPool");
    shieldedPool = await ShieldedPool.deploy(
      await poseidon.getAddress(),
      await mockToken.getAddress()
    );
    await shieldedPool.waitForDeployment();

    // Mint tokens to users
    await mockToken.mint(alice.address, ethers.parseEther("1000"));
    await mockToken.mint(bob.address, ethers.parseEther("1000"));
    await mockToken.mint(charlie.address, ethers.parseEther("1000"));
    await mockToken.mint(dave.address, ethers.parseEther("1000"));
    await mockToken.mint(eve.address, ethers.parseEther("1000"));

    // Approve tokens for shielded pool
    await mockToken.connect(alice).approve(await shieldedPool.getAddress(), ethers.parseEther("1000"));
    await mockToken.connect(bob).approve(await shieldedPool.getAddress(), ethers.parseEther("1000"));
    await mockToken.connect(charlie).approve(await shieldedPool.getAddress(), ethers.parseEther("1000"));
    await mockToken.connect(dave).approve(await shieldedPool.getAddress(), ethers.parseEther("1000"));
    await mockToken.connect(eve).approve(await shieldedPool.getAddress(), ethers.parseEther("1000"));

    // Generate commitments using Poseidon hash
    aliceCommitment = await poseidon.poseidon(
      BigInt(alice.address),
      DEPOSIT_AMOUNT
    );
    bobCommitment = await poseidon.poseidon(
      BigInt(bob.address), 
      DEPOSIT_AMOUNT
    );
    charlieCommitment = await poseidon.poseidon(
      BigInt(charlie.address),
      DEPOSIT_AMOUNT
    );
    daveCommitment = await poseidon.poseidon(
      BigInt(dave.address),
      DEPOSIT_AMOUNT
    );
    eveCommitment = await poseidon.poseidon(
      BigInt(eve.address),
      DEPOSIT_AMOUNT
    );

    // Generate nullifiers
    aliceNullifier = ethers.keccak256(ethers.solidityPacked(["bytes32", "uint256"], [aliceCommitment, 1]));
    bobNullifier = ethers.keccak256(ethers.solidityPacked(["bytes32", "uint256"], [bobCommitment, 2]));
    charlieNullifier = ethers.keccak256(ethers.solidityPacked(["bytes32", "uint256"], [charlieCommitment, 3]));
    daveNullifier = ethers.keccak256(ethers.solidityPacked(["bytes32", "uint256"], [daveCommitment, 4]));
    eveNullifier = ethers.keccak256(ethers.solidityPacked(["bytes32", "uint256"], [eveCommitment, 5]));
  });

  it("Should demonstrate a complete system walkthrough", async function () {
    console.log("\n=== Starting Oblivio System Walkthrough ===\n");

    // Step 1: Initial State Verification
    console.log("Step 1: Verifying initial state...");
    expect(await mockToken.balanceOf(alice.address)).to.equal(ethers.parseEther("1000"));
    expect(await mockToken.balanceOf(await shieldedPool.getAddress())).to.equal(0);
    console.log("✅ Initial state verified\n");

    // Step 2: First Round of Deposits
    console.log("Step 2: First round of deposits...");
    console.log("Alice deposits 100 tokens...");
    await shieldedPool.connect(alice).shield(DEPOSIT_AMOUNT, aliceCommitment);
    console.log("Bob deposits 100 tokens...");
    await shieldedPool.connect(bob).shield(DEPOSIT_AMOUNT, bobCommitment);
    
    // Verify deposits
    expect(await mockToken.balanceOf(alice.address)).to.equal(ethers.parseEther("900"));
    expect(await mockToken.balanceOf(await shieldedPool.getAddress())).to.equal(ethers.parseEther("200"));
    expect(await shieldedPool.isCommitmentValid(aliceCommitment)).to.be.true;
    expect(await shieldedPool.isCommitmentValid(bobCommitment)).to.be.true;
    console.log("✅ First round deposits completed\n");

    // Step 3: Wait for Mixing Period
    console.log("Step 3: Waiting for mixing period...");
    await time.increase(MIXING_PERIOD + 1);
    console.log("✅ Mixing period elapsed\n");

    // Step 4: Second Round of Deposits
    console.log("Step 4: Second round of deposits...");
    console.log("Charlie deposits 100 tokens...");
    await shieldedPool.connect(charlie).shield(DEPOSIT_AMOUNT, charlieCommitment);
    console.log("Dave deposits 100 tokens...");
    await shieldedPool.connect(dave).shield(DEPOSIT_AMOUNT, daveCommitment);
    
    // Verify new deposits
    expect(await mockToken.balanceOf(await shieldedPool.getAddress())).to.equal(ethers.parseEther("400"));
    console.log("✅ Second round deposits completed\n");

    // Step 5: First Mixing Operation
    console.log("Step 5: Performing first mixing operation...");
    const firstMixRecipients = [bob.address, alice.address];
    const firstMixAmounts = [DEPOSIT_AMOUNT, DEPOSIT_AMOUNT];
    const firstMixNullifiers = [bobNullifier, aliceNullifier];
    const firstMixCommitments = [bobCommitment, aliceCommitment];

    await shieldedPool.mixAndWithdraw(
      firstMixRecipients,
      firstMixAmounts,
      firstMixNullifiers,
      firstMixCommitments
    );

    // Verify first mix
    expect(await mockToken.balanceOf(await shieldedPool.getAddress())).to.equal(ethers.parseEther("200"));
    expect(await shieldedPool.isNullifierUsed(aliceNullifier)).to.be.true;
    expect(await shieldedPool.isNullifierUsed(bobNullifier)).to.be.true;
    console.log("✅ First mixing operation completed\n");

    // Step 6: Wait for Another Mixing Period
    console.log("Step 6: Waiting for another mixing period...");
    await time.increase(MIXING_PERIOD + 1);
    console.log("✅ Second mixing period elapsed\n");

    // Step 7: Final Round of Deposits
    console.log("Step 7: Final round of deposits...");
    console.log("Eve deposits 100 tokens...");
    await shieldedPool.connect(eve).shield(DEPOSIT_AMOUNT, eveCommitment);
    
    // Verify final deposits
    expect(await mockToken.balanceOf(await shieldedPool.getAddress())).to.equal(ethers.parseEther("300"));
    console.log("✅ Final round deposits completed\n");

    // Step 8: Final Mixing Operation
    console.log("Step 8: Performing final mixing operation...");
    const finalMixRecipients = [eve.address, dave.address, charlie.address];
    const finalMixAmounts = [DEPOSIT_AMOUNT, DEPOSIT_AMOUNT, DEPOSIT_AMOUNT];
    const finalMixNullifiers = [eveNullifier, daveNullifier, charlieNullifier];
    const finalMixCommitments = [eveCommitment, daveCommitment, charlieCommitment];

    await shieldedPool.mixAndWithdraw(
      finalMixRecipients,
      finalMixAmounts,
      finalMixNullifiers,
      finalMixCommitments
    );

    // Verify final state
    expect(await mockToken.balanceOf(await shieldedPool.getAddress())).to.equal(0);
    expect(await shieldedPool.isNullifierUsed(eveNullifier)).to.be.true;
    expect(await shieldedPool.isNullifierUsed(daveNullifier)).to.be.true;
    expect(await shieldedPool.isNullifierUsed(charlieNullifier)).to.be.true;
    console.log("✅ Final mixing operation completed\n");

    // Step 9: Verify Final Balances
    console.log("Step 9: Verifying final balances...");
    expect(await mockToken.balanceOf(alice.address)).to.equal(ethers.parseEther("1000"));
    expect(await mockToken.balanceOf(bob.address)).to.equal(ethers.parseEther("1000"));
    expect(await mockToken.balanceOf(charlie.address)).to.equal(ethers.parseEther("1000"));
    expect(await mockToken.balanceOf(dave.address)).to.equal(ethers.parseEther("1000"));
    expect(await mockToken.balanceOf(eve.address)).to.equal(ethers.parseEther("1000"));
    console.log("✅ Final balances verified\n");

    console.log("=== System Walkthrough Completed Successfully ===\n");
  });

  it("Should demonstrate privacy features", async function () {
    console.log("\n=== Demonstrating Privacy Features ===\n");

    // Step 1: Multiple users deposit
    console.log("Step 1: Multiple users depositing...");
    await shieldedPool.connect(alice).shield(DEPOSIT_AMOUNT, aliceCommitment);
    await shieldedPool.connect(bob).shield(DEPOSIT_AMOUNT, bobCommitment);
    await shieldedPool.connect(charlie).shield(DEPOSIT_AMOUNT, charlieCommitment);
    console.log("✅ Deposits completed\n");

    // Step 2: Wait for mixing period
    console.log("Step 2: Waiting for mixing period...");
    await time.increase(MIXING_PERIOD + 1);
    console.log("✅ Mixing period elapsed\n");

    // Step 3: Demonstrate mixing with different recipients
    console.log("Step 3: Demonstrating mixing with different recipients...");
    const mixedRecipients = [charlie.address, alice.address, bob.address]; // Different order
    const mixedAmounts = [DEPOSIT_AMOUNT, DEPOSIT_AMOUNT, DEPOSIT_AMOUNT];
    const mixedNullifiers = [charlieNullifier, aliceNullifier, bobNullifier];
    const mixedCommitments = [charlieCommitment, aliceCommitment, bobCommitment];

    await shieldedPool.mixAndWithdraw(
      mixedRecipients,
      mixedAmounts,
      mixedNullifiers,
      mixedCommitments
    );

    // Verify final balances
    expect(await mockToken.balanceOf(alice.address)).to.equal(ethers.parseEther("1000"));
    expect(await mockToken.balanceOf(bob.address)).to.equal(ethers.parseEther("1000"));
    expect(await mockToken.balanceOf(charlie.address)).to.equal(ethers.parseEther("1000"));
    console.log("✅ Mixing with different recipients completed\n");

    console.log("=== Privacy Features Demonstration Completed ===\n");
  });

  it("Should demonstrate security features", async function () {
    console.log("\n=== Demonstrating Security Features ===\n");

    // Step 1: Test double-spending prevention
    console.log("Step 1: Testing double-spending prevention...");
    await shieldedPool.connect(alice).shield(DEPOSIT_AMOUNT, aliceCommitment);
    await time.increase(MIXING_PERIOD + 1);

    const recipients = [bob.address, alice.address];
    const amounts = [DEPOSIT_AMOUNT, DEPOSIT_AMOUNT];
    const nullifiers = [bobNullifier, aliceNullifier];
    const commitments = [bobCommitment, aliceCommitment];

    // First withdrawal should succeed
    await shieldedPool.mixAndWithdraw(recipients, amounts, nullifiers, commitments);

    // Second withdrawal with same nullifiers should fail
    await expect(
      shieldedPool.mixAndWithdraw(recipients, amounts, nullifiers, commitments)
    ).to.be.revertedWith("Nullifier already used");
    console.log("✅ Double-spending prevention verified\n");

    // Step 2: Test mixing period enforcement
    console.log("Step 2: Testing mixing period enforcement...");
    const newCommitment = await poseidon.poseidon(
      BigInt(alice.address),
      DEPOSIT_AMOUNT
    );
    await shieldedPool.connect(alice).shield(DEPOSIT_AMOUNT, newCommitment);

    await expect(
      shieldedPool.mixAndWithdraw(
        [alice.address],
        [DEPOSIT_AMOUNT],
        [aliceNullifier],
        [newCommitment]
      )
    ).to.be.revertedWith("Mixing period not elapsed");
    console.log("✅ Mixing period enforcement verified\n");

    // Step 3: Test commitment validation
    console.log("Step 3: Testing commitment validation...");
    const invalidCommitment = ethers.keccak256(ethers.toUtf8Bytes("invalid"));
    await expect(
      shieldedPool.mixAndWithdraw(
        [alice.address],
        [DEPOSIT_AMOUNT],
        [aliceNullifier],
        [invalidCommitment]
      )
    ).to.be.revertedWith("Commitment not found");
    console.log("✅ Commitment validation verified\n");

    console.log("=== Security Features Demonstration Completed ===\n");
  });
}); 