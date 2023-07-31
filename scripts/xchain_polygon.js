// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    const xchainPolygon = await hre.ethers.getContractFactory("xChainPolygon");
    const x_chain_polygon_contract = await xchainPolygon.deploy("0xd3F1A0782AFD768f8929343Fb44344A2a49fE343");

    await x_chain_polygon_contract.deployed();

    console.log(` x-chain_polygon address : ${x_chain_polygon_contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
