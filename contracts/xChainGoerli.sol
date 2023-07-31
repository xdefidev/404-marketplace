// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IHashi721Bridge {
    function xCall(
        uint32 destination,
        uint256 relayerFee,
        uint256 slippage,
        address asset,
        address to,
        uint256 tokenId,
        bool isTokenURIIgnored
    ) external payable returns (bytes32);
}

contract xChainGoerli {
    address nftHashiBridgeContract;

    constructor(address _nftHashiBridgeContract) {
        nftHashiBridgeContract = _nftHashiBridgeContract;
    }

    function XChainCall(
        uint32 destination,
        uint256 relayerFee,
        uint256 slippage,
        address asset,
        address to,
        uint256 tokenId,
        bool isTokenURIIgnored
    ) public {
        IHashi721Bridge(nftHashiBridgeContract).xCall(
            destination,
            relayerFee,
            slippage,
            asset,
            to,
            tokenId,
            isTokenURIIgnored
        );
    }
}
