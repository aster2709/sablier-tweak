import { ethers, network } from "hardhat";
import { Signer } from "ethers";
import {
  Sablier,
  Sablier__factory,
  CTokenManager,
  CTokenManager__factory,
  Token,
  Token__factory,
} from "../typechain";
import { expect } from "chai";

describe("Sablier Interval Testing", function () {
  let sablierArtifact: Sablier__factory,
    cTokenManagerArtifact: CTokenManager__factory,
    tokenArtifact: Token__factory;
  let sablier: Sablier, cTokenManager: CTokenManager, token: Token;
  let accounts: Signer[], addr: string, addr1: string;
  const DEPOSIT = ethers.utils.parseEther("3000");
  const START_TIME = Math.round(new Date().getTime() / 1000) + 60;
  const INTERVAL_PERIOD = 3600;

  before(async function () {
    sablierArtifact = (await ethers.getContractFactory(
      "Sablier"
    )) as Sablier__factory;
    cTokenManagerArtifact = (await ethers.getContractFactory(
      "CTokenManager"
    )) as CTokenManager__factory;
    tokenArtifact = (await ethers.getContractFactory(
      "Token"
    )) as Token__factory;
  });
  beforeEach(async function () {
    cTokenManager = await cTokenManagerArtifact.deploy();
    sablier = await sablierArtifact.deploy(cTokenManager.address);
    token = await tokenArtifact.deploy();
    await token.mint();
    accounts = await ethers.getSigners();
    addr = await accounts[0].getAddress();
    addr1 = await accounts[1].getAddress();
    await token.approve(sablier.address, DEPOSIT);
  });
  xit("creates a stream", async function () {
    await expect(
      sablier.createStreamV2(
        addr1,
        DEPOSIT,
        token.address,
        START_TIME,
        3,
        INTERVAL_PERIOD
      )
    )
      .to.emit(sablier, "CreateStreamV2")
      .withArgs(
        1,
        addr,
        addr1,
        DEPOSIT,
        token.address,
        START_TIME,
        START_TIME + 3600 * 3
      );
  });
  xit("gets balance", async function () {
    await sablier.createStreamV2(
      addr1,
      DEPOSIT,
      token.address,
      START_TIME,
      3,
      INTERVAL_PERIOD
    );
    // const stream = await sablier.getStreamV2(1);
    // stream.map((x) => console.log(x.toString()));
    expect(await sablier.balanceOfV2(1, addr1)).to.equal(0);
    await network.provider.send("evm_increaseTime", [5400]);
    await network.provider.send("evm_mine");
    expect(await sablier.balanceOfV2(1, addr1)).to.equal(
      ethers.utils.parseEther("1000")
    );
  });
  xit("cancels stream", async function () {
    await sablier.createStreamV2(
      addr1,
      DEPOSIT,
      token.address,
      START_TIME,
      3,
      INTERVAL_PERIOD
    );
    await network.provider.send("evm_increaseTime", [4000]);
    await network.provider.send("evm_mine");
    expect(await sablier.balanceOfV2(1, addr1)).to.equal(
      ethers.utils.parseEther("1000")
    );
    await sablier.cancelStreamV2(1);
    expect(await token.balanceOf(addr)).to.equal(
      ethers.utils.parseEther("9000")
    );
    expect(await token.balanceOf(addr1)).to.equal(
      ethers.utils.parseEther("1000")
    );
  });
  xit("withdraws from stream", async function () {
    await sablier.createStreamV2(
      addr1,
      DEPOSIT,
      token.address,
      START_TIME,
      3,
      INTERVAL_PERIOD
    );
    await network.provider.send("evm_increaseTime", [8000]);
    await network.provider.send("evm_mine");
    expect(await sablier.balanceOfV2(1, addr1)).to.equal(
      ethers.utils.parseEther("2000")
    );
    await sablier.withdrawFromStreamV2(1);
    expect(await token.balanceOf(addr1)).to.equal(
      ethers.utils.parseEther("2000")
    );
  });
});
