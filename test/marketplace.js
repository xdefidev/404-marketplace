// SimpleContract.test.js
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace Contract", function () {
  let default_collection;
  let marketplace;
  let seller;
  let buyer;
  let nft_selling_price = ethers.utils.parseEther("1");
  let seller_prev_balance;

  it("deploys the default collection contract", async () => {
    const [this_seller, this_buyer] = await ethers.getSigners();
    seller = this_seller;
    buyer = this_buyer;

    seller_prev_balance = await this_seller.getBalance();

    const contract_collection = await ethers.getContractFactory(
      "NFTCollection"
    );
    default_collection = await contract_collection.deploy(
      "DEFAULT_COLLECTION",
      "SMPL"
    );
    const txn = await default_collection.deployed();
  });

  it("deploys the MARKETPLACE contract", async () => {
    const marketplace_contract = await ethers.getContractFactory(
      "NFTMarketplace"
    );

    marketplace = await marketplace_contract.deploy();
    const txn = await marketplace.deployed();
  });

  it("it mints an nft to default collection", async function () {
    const txn = await default_collection
      .connect(seller)
      .createToken("this is shravan");
    const token_uri = await default_collection.tokenURI(0);
  });

  it("it create a new collection by user", async () => {
    const collection_contract = await ethers.getContractFactory(
      "CollectionFactory"
    );
    const collection = await collection_contract.deploy();
    const txn = collection.deployed();

    await collection.create_collection(
      "shrava_collection",
      "SHRVN",
      "my_image",
      "my_logo",
      "lorem",
    );

    const collection_by_id = await collection.getCollectionById(0);
    const new_collection_contract = await ethers.getContractAt(
      "NFTCollection",
      collection_by_id.collection_address,
      seller
    );

    await new_collection_contract.createToken("this is a new collection");

    const token_URI = await new_collection_contract.tokenURI(0);

    await marketplace.ListToken(0, ethers.utils.parse)
  });

  it("User Approves Marketplace & Lists the minted nft to the marketplace", async () => {
    //NFT Seller approving the marketplace to transfer nft to marketplace contract
    await default_collection.setApprovalForAll(marketplace.address, true);

    //NFT gets transferred to marketplace contract
    await marketplace.ListToken(
      0,
      nft_selling_price,
      default_collection.address,
      {
        value: ethers.utils.parseEther("0.01"),
      }
    );

    const nft = await marketplace.getListedTokenById(0);

    let marketplace_balance = await default_collection.balanceOf(
      marketplace.address
    );
    assert.equal(nft.seller, seller.address);
  });

  it("buyer buys the nft", async () => {
    await marketplace
      .connect(buyer)
      .executeSale(0, default_collection.address, {
        value: nft_selling_price,
      });

    let buyer_balance = await default_collection.balanceOf(buyer.address);
    let seller_balance = await default_collection.balanceOf(seller.address);
    assert.equal(buyer_balance.toString(), "1");
    assert.equal(seller_balance.toString(), "0");
  });
});
