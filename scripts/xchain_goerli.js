// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const xchain_goerli = await hre.ethers.getContractFactory("xChainGoerli");
  const xchain_goerli_contract = await xchain_goerli.deploy(
    "0xb8336251667A3c73faA7e646d3686596069c9D1C"
  );

  await xchain_goerli_contract.deployed();

  console.log(` xchain_goerli address : ${xchain_goerli_contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
