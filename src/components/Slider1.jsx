import { React, useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Link from "next/link";

const Slider = ({ nfts }) => {
  return (
    <div className="flex overflow-hidden max-w-full">
      <div>
        <div className="mb-4 flex space-x-4">
          {nfts
            .filter((nft, index) => index > 10 && index < 20)
            .map((e, i) => (
              <Link href={`/nft/${e.ipfsData.collection}/${e.tokenId}`}>
                <div
                  className="rounded-lg flex overflow-hidden flex-shrink-0 items-center justify-center border border-jacarta-100 max-h-[120px]"
                  key={i}
                >
                  <img
                    width={240}
                    height={120}
                    className=" hover:scale-110 ease-in duration-400 min-w-[240px] min-h-[120px] aspect-auto"
                    src={
                      e.ipfsData.image
                        ? e.ipfsData.image?.replace(
                            /^(ipfs:\/\/|https:\/\/ipfs\.moralis\.io:2053\/ipfs\/)/,
                            "https://gateway.ipfscdn.io/ipfs/"
                          )
                        : "/test.jpg"
                    }
                    alt="partner item"
                  />
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
