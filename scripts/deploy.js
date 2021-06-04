async function deploy() {
  const DummyToken = await ethers.getContractFactory("DummyToken");
  const dummyToken = await DummyToken.deploy();
  const CTokenManager = await ethers.getContractFactory("CTokenManager");
  const cTokenManager = await CTokenManager.deploy();
  const Sablier = await ethers.getContractFactory("Sablier");
  const sablier = await Sablier.deploy(cTokenManager.address);
  console.log("token address:", dummyToken.address);
  console.log("cTokenManager address:", cTokenManager.address);
  console.log("sablier address", sablier.address);
}

deploy();
