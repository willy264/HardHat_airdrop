import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Airdrop Contract", function () {
  async function deployAirdropFixture() {
    const [owner, account1, account2, account3] = await hre.ethers.getSigners();

    // Deploy ERC20 Token
    const Token = await hre.ethers.getContractFactory("MyToken"); // Change to your token name
    const token = await Token.deploy("TestToken", "TTK", 18, hre.ethers.parseEther("100000"));

    // Deploy Airdrop Contract
    const Airdrop = await hre.ethers.getContractFactory("Airdrop");
    const airdrop = await Airdrop.deploy(token.target);

    // Transfer some tokens to the airdrop contract
    await token.transfer(airdrop.target, hre.ethers.parseEther("50000"));

    return { airdrop, token, owner, account1, account2, account3 };
  }

  describe("Deployment", function () {
    it("should deploy the contract successfully", async function () {
      const { airdrop, owner } = await loadFixture(deployAirdropFixture);
    const runner = airdrop.runner as HardhatEthersSigner;
      expect(runner.address).to.equal(owner.address);
    });

    it("should have a valid token address", async function () {
      const { airdrop, token } = await loadFixture(deployAirdropFixture);
      expect(await airdrop.token()).to.equal(token.target);
    });
  });

  describe("Airdrop Functionality", function () {
    it("should distribute tokens to users", async function () {
      const { airdrop, token, owner, account1, account2 } = await loadFixture(deployAirdropFixture);
      const amount = hre.ethers.parseEther("100");

      await airdrop.connect(owner).airdropTokens([account1.address, account2.address], [amount, amount]);

      expect(await token.balanceOf(account1.address)).to.equal(amount);
      expect(await token.balanceOf(account2.address)).to.equal(amount);
    });

    it("should not allow non-owner to distribute tokens", async function () {
      const { airdrop, account1, account2 } = await loadFixture(deployAirdropFixture);
      const amount = hre.ethers.parseEther("100");

      await expect(
        airdrop.connect(account1).airdropTokens([account2.address], [amount])
      ).to.be.revertedWith("Only owner can airdrop");
    });

    it("should allow only one claim per address", async function () {
      const { airdrop, token, owner, account1 } = await loadFixture(deployAirdropFixture);
      const amount = hre.ethers.parseEther("100");

      await airdrop.connect(owner).airdropTokens([account1.address], [amount]);

      await expect(
        airdrop.connect(owner).airdropTokens([account1.address], [amount])
      ).to.be.revertedWith("User already claimed");
    });

    it("should allow the owner to withdraw remaining tokens", async function () {
      const { airdrop, token, owner } = await loadFixture(deployAirdropFixture);

      const balanceBefore = await token.balanceOf(owner.address);
      await airdrop.connect(owner).withdrawRemainingTokens();
      const balanceAfter = await token.balanceOf(owner.address);

      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });
  });
});
