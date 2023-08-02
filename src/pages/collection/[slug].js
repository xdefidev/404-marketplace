import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import testNFT from "../../../public/test.jpg";
import Image from "next/image";
import NftCard from "@/components/cards/NftCard";
import Link from "next/link";
import { MdVerified } from "react-icons/md";
import { BsFillExclamationCircleFill } from "react-icons/bs";
import Head from "next/head";
import Loader from "@/components/Loader";
import { ethers } from "ethers";
import umaPng from "../../../public/tech/uma.jpeg";

const Collection = ({
  fetch_collection_data_from_polybase,
  fetch_nfts_from_collection,
  signer_address,
  deploy_uma,
  request_verification_UMA,
  uma_settle_request,
  chainIdMain,
  setChainIdMain,
  txnHashCollection,
}) => {
  const router = useRouter();
  const { slug } = router.query;

  const [loading, setLoading] = useState(false);
  const [btnLoading1, setBtnLoading1] = useState(false);
  const [btnLoading2, setBtnLoading2] = useState(false);
  const [btnLoading3, setBtnLoading3] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const [share, setShare] = useState(false);
  const [collection, set_collection] = useState({});
  const [nfts, set_nfts] = useState([]);
  const [volume, set_volume] = useState(0);
  const [floor_price, set_floor_price] = useState(0);

  const get_collection = async () => {
    setLoading(true);
    const collection = await fetch_collection_data_from_polybase(slug);
    set_collection(collection.data[0].data);
    setLoading(false);
  };

  const get_nfts = async () => {
    const res = await fetch_nfts_from_collection(slug);
    console.log(res, "coll page");

    let volume = 0;
    let lowest_price = 0;
    if (res) {
      for (let i = 0; i < res.length; i++) {
        if (res[i]?.listingPrice && res[i + 1]?.listingPrice) {
          lowest_price =
            res[i].listingPrice > res[i + 1].listingPrice
              ? res[i + 1].listingPrice
              : res[i].listingPrice;

          const summed_price =
            parseFloat(res[i]?.listingPrice) +
            parseFloat(res[i + 1]?.listingPrice);
          volume = summed_price;
        }
      }
      set_floor_price(lowest_price);
      set_volume(volume);
    }
    set_nfts(res);
  };

  const start_verification = async () => {
    try {
      setBtnLoading1(true);
      const res = await deploy_uma(slug);
      setBtnLoading1(false);
    } catch (error) {
      console.log(error);
    }
  };

  const request_verification = async () => {
    try {
      setBtnLoading2(true);
      const res = await request_verification_UMA(slug);
      setBtnLoading2(false);
    } catch (error) {
      console.log(error);
    }
  };

  const settle_verification = async () => {
    try {
      setBtnLoading3(true);
      const res = await uma_settle_request(slug);
      setBtnLoading3(false);
      setTimeout(() => {
        router.reload();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const chainSwitchReload = async () => {
    try {
      setChainIdMain();
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const checkGoerli = async () => {
    if (chainIdMain == 5) {
      setShowVerification(!showVerification);
    }

    if (chainIdMain != 5) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x5" }],
        });
        chainSwitchReload("5");
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
            chainSwitchReload("5");
          } catch (addError) {
            console.error(addError);
          }
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      get_collection();
      get_nfts();
    };
    fetchData();
  }, [slug, txnHashCollection]);

  return (
    <>
      <Head>
        <title>Collection - 404 Marketplace</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* <!-- Banner IMG--> */}
          <div className="relative mt-24 ">
            <Image
              src={collection.coverImage?.replace(
                /^(ipfs:\/\/|https:\/\/ipfs\.moralis\.io:2053\/ipfs\/)/,
                "https://gateway.ipfscdn.io/ipfs/"
              )}
              width={100}
              height={100}
              alt="banner"
              className="h-[18.75rem] w-[100%] object-cover"
            />
          </div>

          {/* <!-- Collection Section --> */}
          <section className="relative bg-light-base pb-12 pt-28 dark:bg-black">
            <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <div className="relative">
                <Image
                  src={collection.logo?.replace(
                    /^(ipfs:\/\/|https:\/\/ipfs\.moralis\.io:2053\/ipfs\/)/,
                    "https://gateway.ipfscdn.io/ipfs/"
                  )}
                  width={100}
                  height={100}
                  alt="collection avatar"
                  className="rounded-xl border-[5px] border-white dark:border-jacarta-600 h-[130px] w-[auto]"
                />
                <div className="absolute -right-3 bottom-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-white dark:border-jacarta-600">
                  {collection.isCollectionVerified ? (
                    <MdVerified
                      style={{ color: "#4f87ff", cursor: "pointer" }}
                      size={30}
                    />
                  ) : (
                    <BsFillExclamationCircleFill
                      style={{ color: "#cfc62d", cursor: "pointer" }}
                      size={30}
                    />
                  )}
                </div>
              </div>
            </div>

            {slug != signer_address && !collection.isCollectionVerified && (
              <div className="flex justify-center align-middle mt-[-50px] mb-6">
                <button
                  onClick={async () => await checkGoerli()}
                  type="button"
                  className="rounded-full bg-accent py-2 px-6 text-center text-sm font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark mt-4"
                >
                  Verify Collection
                </button>
              </div>
            )}

            <div className="container">
              {showVerification && (
                <div>
                  <div className="modal-dialog max-w-2xl">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="placeBidLabel">
                          Collection Verification
                        </h5>
                        {/* <h5 className="modal-title flex mr-12" id="placeBidLabel">
                          <p className="text-lg font-semibold">Powered by</p>
                          <Image src={umaPng} height={15} width={30} className="ml-2" />
                        </h5> */}
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setShowVerification(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="h-6 w-6 fill-jacarta-700 dark:fill-white"
                          >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                          </svg>
                        </button>
                      </div>

                      <div className="modal-body p-6">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-vt323 text-sm font-semibold text-jacarta-700 dark:text-white">
                            Complete all the three steps to verify your
                            collection{" "}
                          </span>
                          <div className="flex items-center justify-center space-x-2 mr-6">
                            <div className="w-3 h-3 rounded-full animate-pulse dark:bg-violet-400"></div>
                            <div className="w-3 h-3 rounded-full animate-pulse dark:bg-violet-400"></div>
                            <div className="w-3 h-3 rounded-full animate-pulse dark:bg-violet-400"></div>
                          </div>
                        </div>

                        {/* step 1  */}
                        <div className="mt-4 flex items-center space-x-2 flex-col">
                          <label
                            htmlFor="terms"
                            className="text-xl font-semibold font-vt323 mt-2"
                          >
                            Step 1 -
                          </label>

                          <div className="mt-4 ">
                            <label
                              htmlFor="terms"
                              className="text-sm dark:text-jacarta-200"
                            >
                              In the first step a contract (OptimisticOracleV2)
                              will be deployed on goerli chain{" "}
                            </label>
                          </div>

                          <div className="flex items-center justify-center space-x-4">
                            {collection.isStarted ? (
                              <button
                                disabled
                                type="button"
                                className="rounded-full bg-accent bg-gray-500 py-3 px-8 text-center font-semibold text-white hover:bg-accent-dark mt-4"
                              >
                                Verification Is Already Started
                              </button>
                            ) : (
                              <button
                                onClick={start_verification}
                                type="button"
                                className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark mt-4"
                              >
                                {!btnLoading1 ? (
                                  <>Start Verification</>
                                ) : (
                                  <>
                                    Starting
                                    <svg
                                      aria-hidden="true"
                                      className="inline w-6 h-6 ml-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                      viewBox="0 0 100 101"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                      />
                                    </svg>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* step 2  */}
                      <div className="modal-footer">
                        <label
                          htmlFor="terms"
                          className="text-xl font-semibold font-vt323 mt-2"
                        >
                          Step 2 -
                        </label>

                        <div className="mt-4 text-center">
                          <label
                            htmlFor="terms"
                            className="text-sm dark:text-jacarta-200"
                          >
                            In the second step you will request verification
                            which will be posted on uma oracle website (where
                            verification happens){" "}
                          </label>
                        </div>
                        <div className="flex items-center justify-center space-x-4">
                          {collection.isRequested ? (
                            <button
                              disabled
                              type="button"
                              className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark mt-4"
                            >
                              Verification Requested
                            </button>
                          ) : (
                            <button
                              onClick={request_verification}
                              type="button"
                              className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark mt-4"
                            >
                              {!btnLoading2 ? (
                                <>Request Verification</>
                              ) : (
                                <>
                                  Requesting
                                  <svg
                                    aria-hidden="true"
                                    className="inline w-6 h-6 ml-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                      fill="currentFill"
                                    />
                                  </svg>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        <label
                          htmlFor="terms"
                          className="text-sm dark:text-jacarta-200 mt-4 text-center"
                        >
                          You have initited the verification process,{" "}
                          <a
                            href={`https://testnet.oracle.uma.xyz/request?transactionHash=${txnHashCollection}&chainId=5&oracleType=OptimisticV2`}
                            className="text-red-400"
                            target="_blank"
                          >
                            Click Here{" "}
                          </a>{" "}
                          to visit UMA Oracle website and self-verify your
                          collection (Submit a proposal with input 1)
                        </label>
                      </div>

                      {/* step 3  */}
                      <div className="modal-footer">
                        <label
                          htmlFor="terms"
                          className="text-xl font-semibold font-vt323 mt-2"
                        >
                          Step 3 -
                        </label>

                        <div className="mt-4 text-center">
                          <label
                            htmlFor="terms"
                            className="text-sm dark:text-jacarta-200"
                          >
                            In this step you will settle the verification, after
                            self-verification if there are no disputes your
                            collection verification process will be completed
                            here{" "}
                          </label>
                        </div>
                        <div className="flex items-center justify-center space-x-4">
                          {collection.isSettled ? (
                            <button
                              disabled
                              type="button"
                              className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark mt-4"
                            >
                              Verification Is Settled
                            </button>
                          ) : (
                            <button
                              onClick={settle_verification}
                              type="button"
                              className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark mt-4"
                            >
                              {!btnLoading3 ? (
                                <>Settle Verification</>
                              ) : (
                                <>
                                  Settleing
                                  <svg
                                    aria-hidden="true"
                                    className="inline w-6 h-6 ml-3 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                      fill="currentColor"
                                    />
                                    <path
                                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                      fill="currentFill"
                                    />
                                  </svg>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center">
                <div className="mb-6 inline-flex items-center justify-center rounded-full border border-jacarta-100 bg-white py-1.5 px-4 dark:border-jacarta-600 dark:bg-jacarta-700">
                  <a
                    href={`${collection?.chain_block}address/${collection.id}`}
                    target="_blank"
                    className="js-copy-clipboard max-w-[10rem] select-none overflow-hidden text-ellipsis whitespace-nowrap dark:text-jacarta-200"
                  >
                    <span>{slug}</span>
                  </a>
                </div>
                <h2 className="mb-2 mt-2 font-vt323 text-4xl font-medium text-jacarta-700 dark:text-white">
                  {collection.name}
                </h2>
                <div className="mb-4"></div>

                {/* desc  */}
                <p className="mx-auto mb-14 max-w-xl text-lg dark:text-jacarta-300">
                  {collection.description}
                </p>

                {/* stats  */}
                <div className="mb-8 inline-flex flex-wrap items-center justify-center rounded-xl border border-jacarta-100 bg-white dark:border-jacarta-600 dark:bg-black">
                  <a
                    href="#"
                    className="w-1/2 rounded-l-xl border-r border-jacarta-100 py-4 hover:shadow-md dark:border-jacarta-600 sm:w-32"
                  >
                    <div className="mb-1 text-base font-bold text-jacarta-700 dark:text-white">
                      {nfts ? nfts?.length : "0"}
                    </div>
                    <div className="text-2xs font-medium tracking-tight dark:text-jacarta-400">
                      Items
                    </div>
                  </a>
                  <a
                    href="#"
                    className="w-1/2 border-jacarta-100 py-4 hover:shadow-md dark:border-jacarta-600 sm:w-32 sm:border-r"
                  >
                    <div className="mb-1 text-base font-bold text-jacarta-700 dark:text-white">
                      {nfts ? nfts?.length : "0"}
                    </div>
                    <div className="text-2xs font-medium tracking-tight dark:text-jacarta-400">
                      Owners
                    </div>
                  </a>
                  <a
                    href="#"
                    className="w-1/2 border-r border-jacarta-100 py-4 hover:shadow-md dark:border-jacarta-600 sm:w-32"
                  >
                    <div className="mb-1 flex items-center justify-center text-base font-medium text-jacarta-700 dark:text-white">
                      <span className="font-bold mr-2">{floor_price}</span>
                      <Image
                        src={`../${
                          collection?.chain_image
                            ? collection?.chain_image
                            : "chains/polygon.png"
                        }`}
                        height={18}
                        width={18}
                      />
                    </div>
                    <div className="text-2xs font-medium tracking-tight dark:text-jacarta-400">
                      Floor Price
                    </div>
                  </a>
                  <a
                    href="#"
                    className="w-1/2 rounded-r-xl border-jacarta-100 py-4 hover:shadow-md sm:w-32"
                  >
                    <div className="mb-1 flex items-center justify-center text-base font-medium text-jacarta-700 dark:text-white">
                      <span className="font-bold mr-2">{volume}</span>
                      <Image
                        src={`../${
                          collection?.chain_image
                            ? collection?.chain_image
                            : "chains/polygon.png"
                        }`}
                        height={18}
                        width={18}
                      />
                    </div>
                    <div className="text-2xs font-medium tracking-tight dark:text-jacarta-400">
                      Volume Traded
                    </div>
                  </a>
                </div>

                <div className="mt-6 flex items-center justify-center space-x-2.5">
                  {/* <div className="rounded-xl border border-jacarta-100 bg-white hover:bg-jacarta-100 dark:border-jacarta-600 dark:bg-jacarta-700 dark:hover:bg-jacarta-600">
                    <div
                      className="js-likes relative inline-flex h-10 w-10 cursor-pointer items-center justify-center text-sm before:absolute before:h-4 before:w-4 before:bg-cover before:bg-center before:bg-no-repeat before:opacity-0"
                      role="button"
                      data-tippy-content="Favorite"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="h-4 w-4 fill-jacarta-500 dark:fill-jacarta-200"
                      >
                        <path fill="none" d="M0 0H24V24H0z" />
                        <path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228zm6.826 1.641c-1.5-1.502-3.92-1.563-5.49-.153l-1.335 1.198-1.336-1.197c-1.575-1.412-3.99-1.35-5.494.154-1.49 1.49-1.565 3.875-.192 5.451L12 18.654l7.02-7.03c1.374-1.577 1.299-3.959-.193-5.454z" />
                      </svg>
                    </div>
                  </div> */}
                  {/* Share  */}
                  <div
                    onClick={() => setShare(!share)}
                    className="dropdown rounded-xl border border-jacarta-100 bg-white hover:bg-jacarta-100 dark:border-jacarta-600 dark:bg-jacarta-700 dark:hover:bg-jacarta-600"
                  >
                    <a
                      className="dropdown-toggle inline-flex h-10 w-10 items-center justify-center text-sm"
                      role="button"
                      id="collectionShare"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      data-tippy-content="Share"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="h-4 w-4 fill-jacarta-500 dark:fill-jacarta-200"
                      >
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path d="M13.576 17.271l-5.11-2.787a3.5 3.5 0 1 1 0-4.968l5.11-2.787a3.5 3.5 0 1 1 .958 1.755l-5.11 2.787a3.514 3.514 0 0 1 0 1.458l5.11 2.787a3.5 3.5 0 1 1-.958 1.755z" />
                      </svg>
                    </a>

                    {share && (
                      <div className="dropdown-menu dropdown-menu-end z-10 min-w-[200px] whitespace-nowrap rounded-xl bg-white py-4 px-2 text-left shadow-xl dark:bg-black">
                        <a
                          href="https://twitter.com/home"
                          target="_blank"
                          className="flex w-full items-center rounded-xl px-5 py-2 text-left font-vt323 text-sm transition-colors hover:bg-jacarta-50 dark:text-white dark:hover:bg-jacarta-600"
                        >
                          <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fab"
                            data-icon="twitter"
                            className="mr-2 h-4 w-4 fill-jacarta-300 group-hover:fill-accent dark:group-hover:fill-white"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
                          </svg>
                          <span className="mt-1 inline-block text-black">
                            Twitter
                          </span>
                        </a>
                        <a
                          href="https://gmail.com"
                          target="_blank"
                          className="flex w-full items-center rounded-xl px-5 py-2 text-left font-vt323 text-sm transition-colors hover:bg-jacarta-50 dark:text-white dark:hover:bg-jacarta-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="mr-2 h-4 w-4 fill-jacarta-300 group-hover:fill-accent dark:group-hover:fill-white"
                          >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm9.06 8.683L5.648 6.238 4.353 7.762l7.72 6.555 7.581-6.56-1.308-1.513-6.285 5.439z" />
                          </svg>
                          <span className="mt-1 inline-block text-black">
                            Email
                          </span>
                        </a>
                        <a
                          href="#"
                          className="flex w-full items-center rounded-xl px-5 py-2 text-left font-vt323 text-sm transition-colors hover:bg-jacarta-50 dark:text-white dark:hover:bg-jacarta-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="mr-2 h-4 w-4 fill-jacarta-300 group-hover:fill-accent dark:group-hover:fill-white"
                          >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414zm-2.828 2.828l-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z" />
                          </svg>
                          <span className="mt-1 inline-block text-black">
                            Copy
                          </span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* nft section  */}
          <section className="relative py-24 pt-20">
            <div className="container">
              <div className="tab-content">
                <div
                  className="tab-pane fade show active"
                  id="on-sale"
                  role="tabpanel"
                  aria-labelledby="on-sale-tab"
                >
                  <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-2 lg:grid-cols-4 dark:bg-black">
                    {nfts?.map((e, index) => {
                      return (
                        <NftCard
                          key={index}
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
                          listedBool={e.isListed}
                          listingPrice={e.listingPrice}
                          chainImgPre={"../"}
                          chain_image={e.chain_image}
                          chain_symbol={e.chain_symbol}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-center dark:bg-black">
                    {nfts?.length <= 0 && (
                      <h2 className="text-xl font-vt323 font-thin dark:text-white">
                        This collection has no NFTs !!
                      </h2>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Collection;
