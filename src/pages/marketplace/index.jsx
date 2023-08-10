import React, { useEffect, useState } from "react";
import Image from "next/image";
import testNFT from "../../../public/test.jpg";
import NftCard from "@/components/cards/NftCard";
import Head from "next/head";
import Loader from "@/components/Loader";

const Marketplace = ({
  fetch_listed_nfts,
  chainImg,
  fetch_all_nfts_from_polybase,
}) => {
  const [loading, setLoading] = useState(false);
  const [nfts, set_nfts] = useState([]);
  const [notListedNFts, setNotListedNFts] = useState([]);

  const [propShow, setPropShow] = useState(true);
  const [bananaShow, setBananaShow] = useState(false);

  const get_nfts = async () => {
    setLoading(true);
    const res = await fetch_listed_nfts();
    set_nfts(res);
    setLoading(false);
  };

  const get_all_nfts = async () => {
    setLoading(true);
    const res = await fetch_all_nfts_from_polybase();
    setNotListedNFts(res);
    setLoading(false);
  };

  useEffect(() => {
    get_nfts();
    get_all_nfts();
  }, []);

  return (
    <>
      <Head>
        <title>Marketplace of 404</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      {loading ? (
        <Loader />
      ) : (
        <section className="relative py-24 dark:bg-black" id="pageBack">
          <div className="">
            {/* <h1 className="py-16 text-center font-vt323 text-4xl font-medium text-jacarta-700 dark:text-white">
              Explore NFTs
            </h1> */}

            {/* <!-- Filters --> */}
            <div className="mb-8 flex flex-wrap items-center justify-center">
              <ul className="flex flex-wrap items-center text-center px-2">
                <li
                  className="my-1 mr-2.5"
                  onClick={() => {
                    setPropShow(true);
                    setBananaShow(false);
                  }}
                >
                  <a
                    href="#"
                    className={`${propShow &&
                      !bananaShow &&
                      "border-transparent bg-accent text-white"} group flex h-9 items-center rounded-lg border border-jacarta-100 bg-white px-4 font-vt323 text-sm font-semibold text-jacarta-500 transition-colors `}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="mr-1 h-4 w-4 fill-jacarta-700"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M12 2c5.522 0 10 3.978 10 8.889a5.558 5.558 0 0 1-5.556 5.555h-1.966c-.922 0-1.667.745-1.667 1.667 0 .422.167.811.422 1.1.267.3.434.689.434 1.122C13.667 21.256 12.9 22 12 22 6.478 22 2 17.522 2 12S6.478 2 12 2zm-1.189 16.111a3.664 3.664 0 0 1 3.667-3.667h1.966A3.558 3.558 0 0 0 20 10.89C20 7.139 16.468 4 12 4a8 8 0 0 0-.676 15.972 3.648 3.648 0 0 1-.513-1.86zM7.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM12 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                    </svg>
                    <span>Listed 404s</span>
                  </a>
                </li>
                <li
                  className="my-1 mr-2.5"
                  onClick={() => {
                    setPropShow(false);
                    setBananaShow(false);
                  }}
                >
                  <a
                    href="#"
                    className={`${!propShow &&
                      !bananaShow &&
                      "border-transparent bg-accent text-white"} group flex h-9 items-center rounded-lg border border-jacarta-100 bg-white px-4 font-vt323 text-sm font-semibold text-jacarta-500 transition-colors `}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="mr-1 h-4 w-4 fill-jacarta-700"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M12 2c5.522 0 10 3.978 10 8.889a5.558 5.558 0 0 1-5.556 5.555h-1.966c-.922 0-1.667.745-1.667 1.667 0 .422.167.811.422 1.1.267.3.434.689.434 1.122C13.667 21.256 12.9 22 12 22 6.478 22 2 17.522 2 12S6.478 2 12 2zm-1.189 16.111a3.664 3.664 0 0 1 3.667-3.667h1.966A3.558 3.558 0 0 0 20 10.89C20 7.139 16.468 4 12 4a8 8 0 0 0-.676 15.972 3.648 3.648 0 0 1-.513-1.86zM7.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM12 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                    </svg>
                    <span>All 404s</span>
                  </a>
                </li>
                <li className="my-1 mr-2.5" onClick={() => setBananaShow(true)}>
                  <a
                    href="#"
                    className={`${bananaShow &&
                      !propShow &&
                      "border-transparent bg-accent text-white"} group flex h-9 items-center rounded-lg border border-jacarta-100 bg-white px-4 font-vt323 text-sm font-semibold text-jacarta-500 transition-colors `}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="mr-1 h-4 w-4 fill-jacarta-700"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M12 2c5.522 0 10 3.978 10 8.889a5.558 5.558 0 0 1-5.556 5.555h-1.966c-.922 0-1.667.745-1.667 1.667 0 .422.167.811.422 1.1.267.3.434.689.434 1.122C13.667 21.256 12.9 22 12 22 6.478 22 2 17.522 2 12S6.478 2 12 2zm-1.189 16.111a3.664 3.664 0 0 1 3.667-3.667h1.966A3.558 3.558 0 0 0 20 10.89C20 7.139 16.468 4 12 4a8 8 0 0 0-.676 15.972 3.648 3.648 0 0 1-.513-1.86zM7.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM12 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                    </svg>
                    <span>Bananas</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex h-full mt-5 z-10 transition-all md:mt-0">
              <div className="hidden md:block md:w-[301px]  overflow-y-auto pb-20">
                <div className=" pb-[100px] overflow-y-auto overflow-x-hidden ">
                  <div className="flex items-center py-[31px] pl-5 pr-[26px]">
                    <div className="text-xl font-heavy-obl mr-auto text-[#e2e2e2]">
                      Filter(0)
                    </div>
                    <span
                      id="clearFilter"
                      className="text-[#f9b845] text-[13px] cursor-pointer"
                    >
                      Clear filter
                    </span>
                  </div>
                  <div className="text-[#9b9b9b] w-full justify-between flex px-5">
                    <div className="text-base text-[#666666] capitalize">
                      type
                    </div>
                  </div>
                  <div className="px-[35px]">
                    <div className="grid grid-cols-2 gap-y-[10px] gap-x-5 pt-5 pb-[30px] ">
                      <button className="border-dashed text-[#666666] border-[#666666] h-[25px] min-w-[70px] font-book-obl text-[13px] rounded-[12.5px] border-[1px]">
                        Simple
                      </button>
                      <button className="border-dashed text-[#666666] border-[#666666] h-[25px] min-w-[70px] font-book-obl text-[13px] rounded-[12.5px] border-[1px]">
                        Advanced
                      </button>
                      <button
                        data-test-filter-rainbow="true"
                        className="border-dashed text-[#666666] border-[#666666] h-[25px] min-w-[70px] font-book-obl text-[13px] rounded-[12.5px] border-[1px]"
                      >
                        Deluxe
                      </button>
                      <button
                        data-test-filter-rainbow="true"
                        className="border-dashed text-[#666666] border-[#666666] h-[25px] min-w-[70px] font-book-obl text-[13px] rounded-[12.5px] border-[1px]"
                      >
                        Ultimate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container ">
                {propShow ? (
                  <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
                    {nfts.map((e) => (
                      <NftCard
                        ImageSrc={
                          e.ipfsData.image
                            ? e.ipfsData.image?.replace(
                                /^(ipfs:\/\/|https:\/\/ipfs\.moralis\.io:2053\/ipfs\/)/,
                                "https://gateway.ipfscdn.io/ipfs/"
                              )
                            : "/test.jpg"
                        }
                        Name={e.ipfsData.name}
                        Description={e.ipfsData.description}
                        Address={e.ipfsData.collection}
                        tokenId={e.tokenId}
                        chainImg={chainImg}
                        listedBool={e.isListed}
                        listingPrice={e.listingPrice}
                        chain_image={e.chain_image}
                        chain_symbol={e.chain_symbol}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4">
                    {notListedNFts.map((e) => (
                      <NftCard
                        ImageSrc={
                          e.ipfsData.image
                            ? e.ipfsData.image?.replace(
                                /^(ipfs:\/\/|https:\/\/ipfs\.moralis\.io:2053\/ipfs\/)/,
                                "https://gateway.ipfscdn.io/ipfs/"
                              )
                            : "/test.jpg"
                        }
                        Name={e.ipfsData.name}
                        Description={e.ipfsData.description}
                        Address={e.ipfsData.collection}
                        tokenId={e.tokenId}
                        chainImg={chainImg}
                        // listedBool={e.isListed}
                        // listingPrice={e.listingPrice}
                        chain_image={e.chain_image}
                        chain_symbol={e.chain_symbol}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Marketplace;
