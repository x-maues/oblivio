import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Poseidon } from "../typechain-types";
import { MockERC20 } from "../typechain-types";
import { EnhancedShieldedPool } from "../typechain-types";

describe("ShieldedPool System", function () {
  let poseidon: Poseidon;
  let mockToken: MockERC20;
  let shieldedPool: EnhancedShieldedPool;
  let owner: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let bob: HardhatEthersSigner;
  let charlie: HardhatEthersSigner;

  const INITIAL_BALANCE = ethers.parseEther("1000");
  const SHIELD_AMOUNT = ethers.parseEther("100");

  beforeEach(async function () {
    [owner, alice, bob, charlie] = await ethers.getSigners();

    // Deploy Poseidon
    const Poseidon = await ethers.getContractFactory("Poseidon");
    poseidon = await Poseidon.deploy() as Poseidon;

    // Deploy MockERC20
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy() as MockERC20;

    // Deploy EnhancedShieldedPool
    const EnhancedShieldedPool = await ethers.getContractFactory("EnhancedShieldedPool");
    shieldedPool = await EnhancedShieldedPool.deploy(
      await poseidon.getAddress(),
      { from: owner.address }
    ) as EnhancedShieldedPool;

    // Add token to supported tokens
    await shieldedPool.addToken(await mockToken.getAddress());

    // Mint tokens to test accounts
    await mockToken.mint(owner.address, INITIAL_BALANCE);
    await mockToken.mint(alice.address, INITIAL_BALANCE);
    await mockToken.mint(bob.address, INITIAL_BALANCE);
    await mockToken.mint(charlie.address, INITIAL_BALANCE);

    // Approve tokens
    await mockToken.connect(owner).approve(await shieldedPool.getAddress(), INITIAL_BALANCE);
    await mockToken.connect(alice).approve(await shieldedPool.getAddress(), INITIAL_BALANCE);
    await mockToken.connect(bob).approve(await shieldedPool.getAddress(), INITIAL_BALANCE);
    await mockToken.connect(charlie).approve(await shieldedPool.getAddress(), INITIAL_BALANCE);
  });

  describe("Basic Shielding", function () {
    it("should allow users to shield tokens", async function () {
      // Create commitment
      const commitment = await poseidon.poseidon(
        ethers.toBigInt(owner.address),
        ethers.toBigInt(await mockToken.getAddress()),
        SHIELD_AMOUNT,
        ethers.toBigInt(1) // salt
      );

      // Pad commitment to 32 bytes
      const paddedCommitment = ethers.zeroPadValue(ethers.toBeHex(commitment), 32);

      // Shield tokens
      await shieldedPool.connect(owner).shield(
        await mockToken.getAddress(),
        SHIELD_AMOUNT,
        paddedCommitment,
        ethers.zeroPadValue(ethers.toBeHex(ethers.toBigInt(1)), 32) // salt
      );

      // Verify commitment exists
      const commitmentData = await shieldedPool.getCommitment(paddedCommitment);
      expect(commitmentData.exists).to.be.true;
      expect(commitmentData.amount).to.equal(SHIELD_AMOUNT);
    });

    it("should prevent double-shielding of the same commitment", async function () {
      const commitment = await poseidon.poseidon(
        ethers.toBigInt(owner.address),
        ethers.toBigInt(await mockToken.getAddress()),
        SHIELD_AMOUNT,
        ethers.toBigInt(1)
      );

      // Pad commitment to 32 bytes
      const paddedCommitment = ethers.zeroPadValue(ethers.toBeHex(commitment), 32);

      await shieldedPool.connect(owner).shield(
        await mockToken.getAddress(),
        SHIELD_AMOUNT,
        paddedCommitment,
        ethers.zeroPadValue(ethers.toBeHex(ethers.toBigInt(1)), 32)
      );

      await expect(
        shieldedPool.connect(owner).shield(
          await mockToken.getAddress(),
          SHIELD_AMOUNT,
          paddedCommitment,
          ethers.zeroPadValue(ethers.toBeHex(ethers.toBigInt(1)), 32)
        )
      ).to.be.revertedWith("Commitment already exists");
    });
  });

  describe("Mixing and Unshielding", function () {
    it("should allow mixing multiple shielded transactions", async function () {
      // Shield tokens from multiple users
      const commitment1 = await poseidon.poseidon(
        ethers.toBigInt(alice.address),
        ethers.toBigInt(await mockToken.getAddress()),
        SHIELD_AMOUNT,
        ethers.toBigInt(1)
      );
      const commitment2 = await poseidon.poseidon(
        ethers.toBigInt(bob.address),
        ethers.toBigInt(await mockToken.getAddress()),
        SHIELD_AMOUNT,
        ethers.toBigInt(2)
      );

      // Pad commitments to 32 bytes
      const paddedCommitment1 = ethers.zeroPadValue(ethers.toBeHex(commitment1), 32);
      const paddedCommitment2 = ethers.zeroPadValue(ethers.toBeHex(commitment2), 32);

      await shieldedPool.connect(alice).shield(
        await mockToken.getAddress(),
        SHIELD_AMOUNT,
        paddedCommitment1,
        ethers.zeroPadValue(ethers.toBeHex(ethers.toBigInt(1)), 32)
      );
      await shieldedPool.connect(bob).shield(
        await mockToken.getAddress(),
        SHIELD_AMOUNT,
        paddedCommitment2,
        ethers.zeroPadValue(ethers.toBeHex(ethers.toBigInt(2)), 32)
      );

      // Wait for mixing period
      await ethers.provider.send("evm_increaseTime", [3600]); // 1 hour
      await ethers.provider.send("evm_mine");

      // Process batch
      const batchId = 0;
      await shieldedPool.processBatch(batchId);

      // Create nullifiers for unshielding
      const currentTimestamp = await ethers.provider.getBlock("latest").then(b => b?.timestamp ?? 0);
      const nullifier1 = await poseidon.poseidon(
        ethers.toBigInt(charlie.address),
        ethers.toBigInt(await mockToken.getAddress()),
        SHIELD_AMOUNT,
        ethers.toBigInt(currentTimestamp)
      );
      const nullifier2 = await poseidon.poseidon(
        ethers.toBigInt(owner.address),
        ethers.toBigInt(await mockToken.getAddress()),
        SHIELD_AMOUNT,
        ethers.toBigInt(currentTimestamp + 1)
      );

      // Pad nullifiers to 32 bytes
      const paddedNullifier1 = ethers.zeroPadValue(ethers.toBeHex(nullifier1), 32);
      const paddedNullifier2 = ethers.zeroPadValue(ethers.toBeHex(nullifier2), 32);

      // Unshield tokens
      await shieldedPool.unshield(
        await mockToken.getAddress(),
        charlie.address,
        SHIELD_AMOUNT,
        paddedNullifier1,
        [] // proof would be generated off-chain
      );
      await shieldedPool.unshield(
        await mockToken.getAddress(),
        owner.address,
        SHIELD_AMOUNT,
        paddedNullifier2,
        [] // proof would be generated off-chain
      );

      // Verify balances
      expect(await mockToken.balanceOf(charlie.address)).to.equal(INITIAL_BALANCE + SHIELD_AMOUNT);
      expect(await mockToken.balanceOf(owner.address)).to.equal(INITIAL_BALANCE + SHIELD_AMOUNT);
    });

    it("should prevent double-spending of nullifiers", async function () {
      const commitment = await poseidon.poseidon(
        ethers.toBigInt(alice.address),
        ethers.toBigInt(await mockToken.getAddress()),
        SHIELD_AMOUNT,
        ethers.toBigInt(1)
      );

      // Pad commitment to 32 bytes
      const paddedCommitment = ethers.zeroPadValue(ethers.toBeHex(commitment), 32);

      await shieldedPool.connect(alice).shield(
        await mockToken.getAddress(),
        SHIELD_AMOUNT,
        paddedCommitment,
        ethers.zeroPadValue(ethers.toBeHex(ethers.toBigInt(1)), 32)
      );

      // Wait for mixing period
      await ethers.provider.send("evm_increaseTime", [3600]); // 1 hour
      await ethers.provider.send("evm_mine");

      // Process batch
      const batchId = 0;
      await shieldedPool.processBatch(batchId);

      // Create nullifier
      const currentTimestamp = await ethers.provider.getBlock("latest").then(b => b?.timestamp ?? 0);
      const nullifier = await poseidon.poseidon(
        ethers.toBigInt(bob.address),
        ethers.toBigInt(await mockToken.getAddress()),
        SHIELD_AMOUNT,
        ethers.toBigInt(currentTimestamp)
      );

      // Pad nullifier to 32 bytes
      const paddedNullifier = ethers.zeroPadValue(ethers.toBeHex(nullifier), 32);

      // First unshield should succeed
      await shieldedPool.unshield(
        await mockToken.getAddress(),
        bob.address,
        SHIELD_AMOUNT,
        paddedNullifier,
        [] // proof would be generated off-chain
      );

      // Second unshield with same nullifier should fail
      await expect(
        shieldedPool.unshield(
          await mockToken.getAddress(),
          bob.address,
          SHIELD_AMOUNT,
          paddedNullifier,
          [] // proof would be generated off-chain
        )
      ).to.be.revertedWith("Nullifier already used");
    });
  });

  describe("Admin Functions", function () {
    it("should allow owner to update mixing parameters", async function () {
      const newMixingPeriod = 7200; // 2 hours
      const newMixSize = 5;

      await shieldedPool.updateMixingParameters(newMixingPeriod, newMixSize);

      // Verify parameters were updated
      const currentMixingPeriod = await shieldedPool.currentMixingPeriod();
      const currentMixSize = await shieldedPool.currentMixSize();

      expect(currentMixingPeriod).to.equal(newMixingPeriod);
      expect(currentMixSize).to.equal(newMixSize);
    });

    it("should allow owner to pause and unpause the contract", async function () {
      await shieldedPool.pause();
      
      const commitment = await poseidon.poseidon(
        ethers.toBigInt(owner.address),
        ethers.toBigInt(await mockToken.getAddress()),
        SHIELD_AMOUNT,
        ethers.toBigInt(1)
      );

      await expect(
        shieldedPool.connect(owner).shield(
          await mockToken.getAddress(),
          SHIELD_AMOUNT,
          ethers.toBeHex(commitment),
          ethers.toBeHex(ethers.toBigInt(1))
        )
      ).to.be.revertedWith("Pausable: paused");

      await shieldedPool.unpause();

      await shieldedPool.connect(owner).shield(
        await mockToken.getAddress(),
        SHIELD_AMOUNT,
        ethers.toBeHex(commitment),
        ethers.toBeHex(ethers.toBigInt(1))
      );

      const commitmentData = await shieldedPool.getCommitment(ethers.toBeHex(commitment));
      expect(commitmentData.exists).to.be.true;
    });
  });
}); 