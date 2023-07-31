// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const Rarx_collection = await hre.ethers.getContractFactory("NFTCollection");
  const Rarx_collection_contract = await Rarx_collection.deploy(
    "Rarx NFT Collection",
    "RARX"
  );

  await Rarx_collection_contract.deployed();

  console.log(` NFT Collection address: ${Rarx_collection_contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
