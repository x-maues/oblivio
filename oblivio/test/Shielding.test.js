const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Shielding System", function () {
    let poseidon;
    let shieldingToken;
    let owner;
    let alice;
    let bob;
    let charlie;
    let initialSupply = ethers.parseEther("1000000"); // 1 million tokens

    beforeEach(async function () {
        [owner, alice, bob, charlie] = await ethers.getSigners();

        // Deploy Poseidon contract
        const Poseidon = await ethers.getContractFactory("Poseidon");
        poseidon = await Poseidon.deploy();

        // Deploy ShieldingERC20
        const ShieldingERC20 = await ethers.getContractFactory("ShieldingERC20");
        shieldingToken = await ShieldingERC20.deploy(await poseidon.getAddress());

        // Transfer some tokens to test users
        await shieldingToken.transfer(alice.address, ethers.parseEther("1000"));
        await shieldingToken.transfer(bob.address, ethers.parseEther("1000"));
        await shieldingToken.transfer(charlie.address, ethers.parseEther("1000"));
    });

    describe("Basic Token Functionality", function () {
        it("Should have correct initial supply", async function () {
            expect(await shieldingToken.totalSupply()).to.equal(initialSupply);
        });

        it("Should have correct balances after transfers", async function () {
            expect(await shieldingToken.balanceOf(alice.address)).to.equal(ethers.parseEther("1000"));
            expect(await shieldingToken.balanceOf(bob.address)).to.equal(ethers.parseEther("1000"));
            expect(await shieldingToken.balanceOf(charlie.address)).to.equal(ethers.parseEther("1000"));
        });
    });

    describe("Shielded Transfer Flow", function () {
        const transferAmount = ethers.parseEther("100");

        it("Should create and verify commitment for shielded transfer", async function () {
            // Alice performs a shielded transfer to Bob
            const tx = await shieldingToken.connect(alice).shieldedTransfer(bob.address, transferAmount);
            const receipt = await tx.wait();

            // Get the CommitmentCreated event
            const event = receipt.logs.find(log => log.fragment && log.fragment.name === 'CommitmentCreated');
            const commitment = event.args.commitment;

            // Verify the commitment
            const isValid = await shieldingToken.verifyCommitment(bob.address, transferAmount);
            expect(isValid).to.be.true;

            // Check balances
            expect(await shieldingToken.balanceOf(alice.address)).to.equal(ethers.parseEther("900"));
            expect(await shieldingToken.balanceOf(bob.address)).to.equal(ethers.parseEther("1100"));
        });

        it("Should fail shielded transfer with insufficient balance", async function () {
            const largeAmount = ethers.parseEther("2000"); // More than Alice's balance
            await expect(
                shieldingToken.connect(alice).shieldedTransfer(bob.address, largeAmount)
            ).to.be.revertedWith("Insufficient balance");
        });

        it("Should fail shielded transfer to blacklisted address", async function () {
            // Blacklist Bob
            await shieldingToken.blacklist(bob.address);

            // Attempt shielded transfer to blacklisted address
            await expect(
                shieldingToken.connect(alice).shieldedTransfer(bob.address, transferAmount)
            ).to.be.revertedWith("Recipient is blacklisted");

            // Unblacklist Bob
            await shieldingToken.unblacklist(bob.address);

            // Now transfer should work
            await shieldingToken.connect(alice).shieldedTransfer(bob.address, transferAmount);
            expect(await shieldingToken.balanceOf(bob.address)).to.equal(ethers.parseEther("1100"));
        });
    });

    describe("Multiple Shielded Transfers", function () {
        const transferAmount = ethers.parseEther("50");

        it("Should handle multiple shielded transfers correctly", async function () {
            // Alice transfers to Bob
            await shieldingToken.connect(alice).shieldedTransfer(bob.address, transferAmount);
            
            // Bob transfers to Charlie
            await shieldingToken.connect(bob).shieldedTransfer(charlie.address, transferAmount);
            
            // Charlie transfers back to Alice
            await shieldingToken.connect(charlie).shieldedTransfer(alice.address, transferAmount);

            // Verify final balances
            expect(await shieldingToken.balanceOf(alice.address)).to.equal(ethers.parseEther("1000"));
            expect(await shieldingToken.balanceOf(bob.address)).to.equal(ethers.parseEther("950"));
            expect(await shieldingToken.balanceOf(charlie.address)).to.equal(ethers.parseEther("1050"));
        });

        it("Should maintain correct commitments for multiple transfers", async function () {
            // Perform multiple transfers
            await shieldingToken.connect(alice).shieldedTransfer(bob.address, transferAmount);
            await shieldingToken.connect(bob).shieldedTransfer(charlie.address, transferAmount);
            await shieldingToken.connect(charlie).shieldedTransfer(alice.address, transferAmount);

            // Verify all commitments
            const commitment1 = await shieldingToken.verifyCommitment(bob.address, transferAmount);
            const commitment2 = await shieldingToken.verifyCommitment(charlie.address, transferAmount);
            const commitment3 = await shieldingToken.verifyCommitment(alice.address, transferAmount);

            expect(commitment1).to.be.true;
            expect(commitment2).to.be.true;
            expect(commitment3).to.be.true;
        });
    });

    describe("Emergency Controls", function () {
        it("Should pause and unpause shielded transfers", async function () {
            // Pause the contract
            await shieldingToken.pause();

            // Attempt shielded transfer while paused
            await expect(
                shieldingToken.connect(alice).shieldedTransfer(bob.address, ethers.parseEther("100"))
            ).to.be.revertedWith("Pausable: paused");

            // Unpause the contract
            await shieldingToken.unpause();

            // Now transfer should work
            await shieldingToken.connect(alice).shieldedTransfer(bob.address, ethers.parseEther("100"));
            expect(await shieldingToken.balanceOf(bob.address)).to.equal(ethers.parseEther("1100"));
        });

        it("Should only allow owner to pause/unpause", async function () {
            // Non-owner attempts to pause
            await expect(
                shieldingToken.connect(alice).pause()
            ).to.be.revertedWith("Ownable: caller is not the owner");

            // Non-owner attempts to unpause
            await expect(
                shieldingToken.connect(alice).unpause()
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe("Edge Cases", function () {
        it("Should handle zero amount transfers", async function () {
            await expect(
                shieldingToken.connect(alice).shieldedTransfer(bob.address, 0)
            ).to.be.revertedWith("Amount must be greater than 0");
        });

        it("Should handle transfers to zero address", async function () {
            await expect(
                shieldingToken.connect(alice).shieldedTransfer(ethers.ZeroAddress, ethers.parseEther("100"))
            ).to.be.revertedWith("ERC20: transfer to the zero address");
        });

        it("Should handle transfers from blacklisted sender", async function () {
            // Blacklist Alice
            await shieldingToken.blacklist(alice.address);

            // Attempt transfer from blacklisted address
            await expect(
                shieldingToken.connect(alice).shieldedTransfer(bob.address, ethers.parseEther("100"))
            ).to.be.revertedWith("Sender is blacklisted");
        });
    });
}); 