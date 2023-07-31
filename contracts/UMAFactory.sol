// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./UMAVerification.sol";
import "./NFTCollection.sol";

contract UMAFactory {
    address payable owner;
    using Counters for Counters.Counter;
    Counters.Counter private uma_count;

    struct UMA {
        uint256 id;
        NFTCollection collection_address;
        UMAVerify uma_contract;
    }

    event UMA_Created(
        uint256 id,
        NFTCollection collection_address,
        UMAVerify uma_contract
    );

    mapping(uint256 => UMA) public id_to_uma_contract;
    mapping(NFTCollection => UMA) public collectionAddress_to_UMA;

    constructor() {
        owner = payable(msg.sender);
    }

    function deploy_uma(NFTCollection collection_address) public {
        uint256 current_count = uma_count.current();

        UMAVerify current_uma = new UMAVerify();
        UMA memory uma = UMA(current_count, collection_address, current_uma);

        id_to_uma_contract[current_count] = uma;
        collectionAddress_to_UMA[collection_address] = uma;
        uma_count.increment();

        emit UMA_Created(current_count, collection_address, current_uma);
    }

    function get_all_umas() public view returns (UMA[] memory) {
        uint256 current_count = uma_count.current();
        UMA[] memory umas = new UMA[](current_count);
        uint256 current_index;

        for (uint256 i = 0; i < current_count; i++) {
            UMA storage current_uma = id_to_uma_contract[i];
            umas[current_index] = current_uma;
            current_index++;
        }

        return umas;
    }
}
