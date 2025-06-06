const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ShieldedPool", function () {
    let ShieldedPool;
    let Poseidon;
    let TestToken;
    let shieldedPool;
    let poseidon;
    let token;
    let owner;
    let alice;
    let bob;
    let carol;

    beforeEach(async function () {
        [owner, alice, bob, carol] = await ethers.getSigners();

        // Deploy Poseidon contract
        Poseidon = await ethers.getContractFactory("Poseidon");
        poseidon = await Poseidon.deploy();
        await poseidon.deployed();

        // Deploy test token
        TestToken = await ethers.getContractFactory("TestToken");
        token = await TestToken.deploy();
        await token.deployed();

        // Deploy ShieldedPool
        ShieldedPool = await ethers.getContractFactory("ShieldedPool");
        shieldedPool = await ShieldedPool.deploy(poseidon.address, token.address);
        await shieldedPool.deployed();

        // Mint tokens to test accounts
        await token.mint(alice.address, ethers.utils.parseEther("10"));
        await token.mint(bob.address, ethers.utils.parseEther("10"));
        await token.mint(carol.address, ethers.utils.parseEther("10"));

        // Approve ShieldedPool to spend tokens
        await token.connect(alice).approve(shieldedPool.address, ethers.utils.parseEther("10"));
        await token.connect(bob).approve(shieldedPool.address, ethers.utils.parseEther("10"));
        await token.connect(carol).approve(shieldedPool.address, ethers.utils.parseEther("10"));
    });

    describe("Shielding", function () {
        it("Should allow users to shield tokens", async function () {
            const amount = ethers.utils.parseEther("1");
            const commitment = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
                ["address", "uint256"],
                [alice.address, amount]
            ));

            const tx = await shieldedPool.connect(alice).shield(amount, commitment);
            const receipt = await tx.wait();
            const block = await ethers.provider.getBlock(receipt.blockNumber);

            await expect(tx)
                .to.emit(shieldedPool, "Shielded")
                .withArgs(alice.address, commitment, block.timestamp);

            expect(await shieldedPool.isCommitmentValid(commitment)).to.be.true;
        });

        it("Should revert with invalid commitment", async function () {
            const amount = ethers.utils.parseEther("1");
            const invalidCommitment = ethers.constants.HashZero;

            await expect(shieldedPool.connect(alice).shield(amount, invalidCommitment))
                .to.be.revertedWith("Invalid commitment");
        });

        it("Should revert with zero amount", async function () {
            const amount = 0;
            const commitment = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
                ["address", "uint256"],
                [alice.address, amount]
            ));

            await expect(shieldedPool.connect(alice).shield(amount, commitment))
                .to.be.revertedWith("Amount must be greater than 0");
        });
    });

    describe("Mixing and Withdrawing", function () {
        it("Should allow mixing and withdrawing after mixing period", async function () {
            // Create commitments for three users
            const amount = ethers.utils.parseEther("1");
            const commitments = [];
            const nullifiers = [];
            const recipients = [alice.address, bob.address, carol.address];
            const amounts = [amount, amount, amount];

            // Create and store commitments
            for (let i = 0; i < 3; i++) {
                const commitment = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
                    ["address", "uint256"],
                    [recipients[i], amounts[i]]
                ));
                commitments.push(commitment);
                nullifiers.push(ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
                    ["uint256"],
                    [i]
                )));

                await shieldedPool.connect(recipients[i]).shield(amount, commitment);
            }

            // Fast forward time
            await ethers.provider.send("evm_increaseTime", [3600]); // 1 hour
            await ethers.provider.send("evm_mine");

            // Mix and withdraw using owner as the caller
            const tx = await shieldedPool.connect(owner).mixAndWithdraw(
                recipients,
                amounts,
                nullifiers,
                commitments
            );
            await tx.wait();

            // Verify balances
            for (let i = 0; i < recipients.length; i++) {
                expect(await token.balanceOf(recipients[i])).to.equal(ethers.utils.parseEther("10"));
            }
        });

        it("Should revert if mixing period hasn't elapsed", async function () {
            const amount = ethers.utils.parseEther("1");
            const commitments = [];
            const nullifiers = [];
            const recipients = [alice.address, bob.address];
            const amounts = [amount, amount];

            // Create and store commitments
            for (let i = 0; i < 2; i++) {
                const commitment = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
                    ["address", "uint256"],
                    [recipients[i], amounts[i]]
                ));
                commitments.push(commitment);
                nullifiers.push(ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
                    ["uint256"],
                    [i]
                )));

                await shieldedPool.connect(recipients[i]).shield(amount, commitment);
            }

            // Try to mix immediately
            await expect(shieldedPool.connect(owner).mixAndWithdraw(
                recipients,
                amounts,
                nullifiers,
                commitments
            )).to.be.revertedWith("Mixing period not elapsed");
        });

        it("Should revert with invalid commitment in mixing", async function () {
            const amount = ethers.utils.parseEther("1");
            const commitments = [];
            const nullifiers = [];
            const recipients = [alice.address, bob.address];
            const amounts = [amount, amount];

            // Create and store commitments
            for (let i = 0; i < 2; i++) {
                const commitment = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
                    ["address", "uint256"],
                    [recipients[i], amounts[i]]
                ));
                commitments.push(commitment);
                nullifiers.push(ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
                    ["uint256"],
                    [i]
                )));

                await shieldedPool.connect(recipients[i]).shield(amount, commitment);
            }

            // Fast forward time
            await ethers.provider.send("evm_increaseTime", [3600]);
            await ethers.provider.send("evm_mine");

            // Try to mix with invalid commitment
            commitments[1] = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
                ["address", "uint256"],
                [carol.address, amount]
            ));

            await expect(shieldedPool.connect(owner).mixAndWithdraw(
                recipients,
                amounts,
                nullifiers,
                commitments
            )).to.be.revertedWith("Invalid commitment");
        });
    });
}); 