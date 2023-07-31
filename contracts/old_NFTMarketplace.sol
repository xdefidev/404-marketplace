//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./NFTCollection.sol";

contract old_NFTMarketplace {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    address payable owner;
    uint256 public listPrice = 0.01 ether;

    struct ListedToken {
        uint256 tokeId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    event TokenListedSuccess(
        uint256 tokeId,
        address payable owner,
        address payable seller,
        uint256 price,
        bool currentlyListed
    );

    mapping(uint256 => ListedToken) private idToListedToken;

    constructor() {
        owner = payable(msg.sender);
    }

    function ListToken(
        uint256 tokenId,
        uint256 price,
        NFTCollection collection
    ) public payable {
        require(msg.value == listPrice, "Please send the listing fees");
        require(price > 0, "Make sure the price isn't negative");
        uint256 nftId = _tokenIds.current();

        idToListedToken[nftId] = ListedToken(
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            price,
            true
        );

        collection.transferFrom(msg.sender, address(this), tokenId);

        emit TokenListedSuccess(
            tokenId,
            payable(address(this)),
            payable(msg.sender),
            price,
            true
        );
        _tokenIds.increment();
    }

    function executeSale(
        uint256 tokenId,
        NFTCollection collection
    ) public payable {
        uint256 price = idToListedToken[tokenId].price;
        address seller = idToListedToken[tokenId].seller;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        //update the details of the token
        idToListedToken[tokenId].currentlyListed = false;
        idToListedToken[tokenId].seller = payable(msg.sender);
        _itemsSold.increment();

        //Actually transfer the token to the new owner
        collection.transferFrom(address(this), msg.sender, tokenId);
        // collection.approve(address(this), tokenId);

        //Transfer the listing fee to the marketplace creator
        payable(owner).transfer(listPrice);
        payable(seller).transfer(msg.value);
    }

    function change_listing_fee(uint256 new_listing_fee) public {
        require(
            msg.sender == owner,
            "Only platform owner can call this function"
        );
        listPrice = new_listing_fee;
    }

    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint256 nftCount = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](nftCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < nftCount; i++) {
            ListedToken storage currentItem = idToListedToken[i];
            tokens[currentIndex] = currentItem;
            currentIndex++;
        }
        return tokens;
    }

    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i].owner == msg.sender ||
                idToListedToken[i].seller == msg.sender
            ) {
                itemCount += 1;
            }
        }

        ListedToken[] memory items = new ListedToken[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (
                idToListedToken[i].owner == msg.sender ||
                idToListedToken[i].seller == msg.sender
            ) {
                uint256 currentId = i;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function getLatestIdToListedToken()
        public
        view
        returns (ListedToken memory)
    {
        uint256 currentTokenId = _tokenIds.current();
        return idToListedToken[currentTokenId];
    }

    function getListedTokenById(
        uint256 tokenId
    ) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }
}
