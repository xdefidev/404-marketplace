import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TbArrowsUpDown } from "react-icons/tb";
import NftCard from "@/components/cards/NftCard";
import Loader from "@/components/Loader";
import Head from "next/head";

const BridgeNFT = ({
  connectToWallet,
  chainIdMain,
  setChainIdMain,
  fetch_nfts_from_user_wallet,
  signer_address,
  xchain_NFT,
  x_chain_polygon_address,
  x_chain_goerli_address,
  fetch_nfts_by_chain,
}) => {
  const [domainID, setDomainID] = useState("9991");
  const [assetContract, setAssesContract] = useState("");
  const [assetTokenID, setAssetTokenID] = useState();
  const [xChainContract, setxChainContract] = useState();

  const [defaultDomain, setDefaultDomain] = useState(true);
  const [showSelectNFT, setShowSelectNFT] = useState(false);
  const [isNFTBriding, setIsNFTBriding] = useState(false);
  const [isNFTBridged, SetIsNFTBridged] = useState(false);

  const [loading, set_loading] = useState(false);
  const [nfts, set_nfts] = useState([]);

  //   const get_nfts = async () => {
  //     set_loading(true);
  //     const nfts = await fetch_nfts_from_user_wallet(signer_address);
  //     set_nfts(nfts);
  //     set_loading(false);
  //   };

  const switchPolygonChain = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13881" }],
      });
      setChainIdMain("80001");
      get_nfts();
      setTimeout(() => {
        setShowSelectNFT(true);
      }, 2000);
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x13881",
                chainName: "Mumbai",
                nativeCurrency: {
                  name: "Polygon",
                  symbol: "MATIC",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://polygonscan.com/"],
                rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
              },
            ],
          });
          setChainIdMain("80001");
          setShowSelectNFT(true);
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  const switchGoerliChain = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }],
      });
      setChainIdMain("5");
      get_nfts();
      setTimeout(() => {
        setShowSelectNFT(true);
      }, 2000);
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x5",
                chainName: "Goerli Testnet",
                nativeCurrency: {
                  name: "Goerli Testnet",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://goerli.etherscan.io/"],
                rpcUrls: ["https://rpc.ankr.com/eth_goerli"],
              },
            ],
          });
          setChainIdMain("5");
          setShowSelectNFT(true);
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  const handleSubmitSelectChain = async (e) => {
    e.preventDefault();
    if (defaultDomain == true && chainIdMain != "80001") {
      switchPolygonChain();
    }
    if (defaultDomain == false && chainIdMain != "5") {
      switchGoerliChain();
    }

    if (defaultDomain == true && chainIdMain == "80001") {
      setShowSelectNFT(true);
      get_nfts(signer_address);
      setxChainContract(x_chain_polygon_address);
    }
    if (defaultDomain == false && chainIdMain == "5") {
      setShowSelectNFT(true);
      get_nfts(signer_address);
      setxChainContract(x_chain_goerli_address);
    }
  };

  const handleSubmitSelectNFT = async (e) => {
    setIsNFTBriding(true);
    if (assetContract != "") {
      try {
        const xChainBridgeTxn = await xchain_NFT(
          assetContract,
          assetTokenID,
          xChainContract,
          domainID
        );
        setIsNFTBriding(false);
        SetIsNFTBridged(true);
      } catch (error) {
        setIsNFTBriding(false);
        console.log({ someXChainBridgeTxnError: error });
      }
    } else {
      alert("Please select the NFT again!");
      setIsNFTBriding(false);
    }
  };

  const get_nfts = async () => {
    set_loading(true);
    const res = await fetch_nfts_by_chain();
    set_nfts(res);
    set_loading(false);
  };

  useEffect(() => {
    connectToWallet();
    fetch_nfts_by_chain();
    // setting domain id of xchain destination
    if (chainIdMain == "5") {
      setDomainID("9991");
    }
    if (chainIdMain == "80001") {
      setDomainID("1735353714");
    }
  }, [showSelectNFT, chainIdMain]);

  return (
    <>
      <Head>
        <title>Bridge NFT - 404 Marketplace</title>
        <meta name="description" content="Bridge NFT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      {isNFTBridged == false && (
        <>
          {showSelectNFT == false && (
            <form className="relative py-24">
              <div className="container">
                <h1 className="pt-16 text-center font-display text-4xl font-medium text-jacarta-700 ">
                  Bridge Your NFTs
                </h1>
                <p className="mb-16 mt-2 text-center text-sm font-medium text-jacarta-700">
                  Take your NFTs cross-chain, move your NFTs from one chain to
                  another chain
                </p>
                <div className="mx-auto max-w-[48.125rem]">
                  {/* select collection  */}
                  <div className="relative">
                    <div>
                      <label className="mb-1 block font-display text-jacarta-700 dark:text-black">
                        From
                      </label>
                      <div className="mb-2 flex items-center space-x-2">
                        <p className="text-2xs dark:text-jacarta-300">
                          This is the chain where your NFT is
                        </p>
                      </div>
                    </div>
                    {defaultDomain == true ? (
                      <select
                        name="collection"
                        className="dropdown my-1 cursor-pointer w-[100%]"
                      >
                        <option>Polygon Mumbai</option>
                      </select>
                    ) : (
                      <select
                        name="collection"
                        className="dropdown my-1 cursor-pointer w-[100%]"
                      >
                        <option>Ethereum Goerli Testnet</option>
                      </select>
                    )}

                    <button
                      onClick={() => {
                        setDefaultDomain(!defaultDomain);
                      }}
                      className="mt-10 mb-10 flex align-middle justify-center"
                      type="button"
                    >
                      <TbArrowsUpDown className="text-[20px]" />
                    </button>

                    <div>
                      <label className="mb-2 block font-display text-jacarta-700 dark:text-black">
                        Destination
                      </label>
                      <div className="mb-3 flex items-center space-x-2">
                        <p className="text-2xs dark:text-jacarta-300">
                          This is the chain where you want your NFT
                        </p>
                      </div>
                    </div>

                    {defaultDomain == false ? (
                      <select
                        name="collection"
                        className="dropdown my-1 cursor-pointer w-[100%]"
                      >
                        <option>Polygon Mumbai</option>
                      </select>
                    ) : (
                      <select
                        name="collection"
                        className="dropdown my-1 cursor-pointer w-[100%]"
                      >
                        <option>Ethereum Goerli Testnet</option>
                      </select>
                    )}
                  </div>

                  <button
                    onClick={handleSubmitSelectChain}
                    type="button"
                    className="rounded-full bg-accent mt-8 py-3 px-8 text-center font-semibold text-white transition-all cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </form>
          )}
          {showSelectNFT == true && (
            <form className="relative py-24">
              <div className="container">
                <h1 className="pt-16 text-center font-display text-4xl font-medium text-jacarta-700 ">
                  Select NFT For Bridging
                </h1>
                <p className="mb-2 mt-2 text-center text-sm font-medium text-jacarta-700">
                  Select the NFT which you want to xbridge
                </p>
                <section className="relative py-24 pt-20">
                  {loading ? (
                    <Loader />
                  ) : (
                    <>
                      {isNFTBriding ? (
                        <Loader />
                      ) : (
                        <div className="container">
                          <div className="tab-content">
                            <div
                              className="tab-pane fade show active"
                              id="on-sale"
                              role="tabpanel"
                              aria-labelledby="on-sale-tab"
                            >
                              <div className="grid grid-cols-1 gap-[2rem] md:grid-cols-3 lg:grid-cols-4">
                                {nfts?.map((e, index) => {
                                  return (
                                    e.isListed == false && (
                                      <div
                                        onClick={() => (
                                          setAssesContract(e.collection),
                                          setAssetTokenID(e.tokenId),
                                          handleSubmitSelectNFT()
                                        )}
                                      >
                                        <NftCard
                                          key={index}
                                          ImageSrc={e.image?.replace(
                                            /^(ipfs:\/\/|https:\/\/ipfs\.moralis\.io:2053\/ipfs\/)/,
                                            "https://gateway.ipfscdn.io/ipfs/"
                                          )}
                                          Name={e.nft_name}
                                          Description={e.nft_description}
                                          Address={e.collection}
                                          tokenId={e.tokenId}
                                          onClickOpen={false}
                                          listedBool={e.isListed}
                                          listingPrice={e.listingPrice}
                                          chain_image={e.chain_image}
                                          chain_symbol={e.chain_symbol}
                                        />
                                      </div>
                                    )
                                  );
                                })}
                              </div>
                              {nfts?.length == 0 && (
                                <div className="flex flex-col justify-center w-full">
                                  <p className="mb-2 mt-2 text-center text-xl font-medium text-jacarta-700">
                                    No NFTS Found!
                                  </p>
                                  <div className="flex justify-center">
                                    <Link
                                      href="/mint/CreateNFT"
                                      className="mt-6 w-40 align-middle rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                                    >
                                      Create NFT
                                    </Link>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </section>
              </div>
            </form>
          )}
        </>
      )}
      {isNFTBridged == true && (
        <div className="flex flex-col justify-center w-full mt-44 mb-44">
          <p className="mb-2 mt-2 text-center text-xl font-medium text-jacarta-700">
            You NFT is bridged successfully 🎉
          </p>
          <p className="mb-2 mt-2 text-center text-sm font-sans text-jacarta-700">
            You shall see the NFT in your wallet in few mins..
          </p>
          <div className="flex justify-center">
            <Link
              href="/Transactions"
              className="mt-6 w-70 align-middle rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
            >
              View Transaction
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default BridgeNFT;
