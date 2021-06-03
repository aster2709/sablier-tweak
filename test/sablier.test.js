const BN = require("bn.js");
const { ethers } = require("hardhat");

describe("Sablier Test", function () {
  it("successfully creates a stream", async function () {
    try {
      const [account1, account2] = await ethers.getSigners();
      console.log("account1 address:", account1.address);
      const CTokenManager = await ethers.getContractFactory("CTokenManager");
      const DummyToken = await ethers.getContractFactory("DummyToken");
      const dummyToken = await DummyToken.deploy();
      const DMTBalance = await dummyToken.balanceOf(account1.address);
      const cTokenManager = await CTokenManager.deploy();
      const Sablier = await ethers.getContractFactory("Sablier");
      const sablier = await Sablier.deploy(cTokenManager.address);
      const START_TIME = Math.floor(Date.now() / 1000) + 1800;
      const END_TIME = START_TIME + 3600;
      const deposit = DMTBalance.sub(DMTBalance.mod(3600));
      await dummyToken.approve(sablier.address, DMTBalance.toString());
      await sablier.createStream(
        account2.address,
        deposit.toString(),
        dummyToken.address,
        START_TIME,
        END_TIME
      );
      const stream = await sablier.getStream(1);
      console.log("sender:", stream.sender);
      console.log("recipient:", stream.recipient);
      console.log("deposit amount:", stream.deposit.toString());
      console.log("token Address", stream.tokenAddress);
      console.log("start time:", stream.startTime.toString());
      console.log("stop time:", stream.stopTime.toString());
      console.log("remaining Balance:", stream.remainingBalance.toString());
      console.log("rate per second:", stream.ratePerSecond.toString());
    } catch (err) {
      console.log(err);
    }
  });
});
