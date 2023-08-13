import { React, useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Link from "next/link";
import { BsChevronDown } from "react-icons/bs";
import * as PushAPI from "@pushprotocol/restapi";

import Image from "next/image";
import rarxlogo from "../../public/404-logo.png";
import filecoinLogo from "../../public/chains/filecoin.png";
import gnosisLogo from "../../public/chains/gnosis.png";
import goerliLogo from "../../public/chains/goerli.png";
import mantleLogo from "../../public/chains/mantle.png";
import polygonLogo from "../../public/chains/polygon.png";
import scrollLogo from "../../public/chains/scroll.png";
import TaikoLogo from "../../public/chains/taiko.png";
import bscLogo from "../../public/chains/bsc.png";

const Navbar = ({
  connectToWallet,
  signer,
  signer_address,
  signer_bal,
  connectToIntmax,
  chainIdMain,
  setChainIdMain,
  RARX_CHANNEL_ADDRESS,
  symbol,
  defaultCollectionAddress,
  blockURL,
  chainImg,
  search_nft,
  signOut,
}) => {
  const router = useRouter();
  const user_address = async () => {};
  const [notificationData, setNotificationData] = useState();

  const [profileDrop, setProfileDrop] = useState(false);
  const [mobieProfileDrop, setMobieProfileDrop] = useState(false);
  const [nullNotification, setNullNotification] = useState(true);
  const [optedIn, setOptedIn] = useState(false);
  const [showNotifications, SetShowNotifications] = useState(false);
  const [showNetworkPopup, setShowNetworkPopup] = useState(false);
  const [search_result, set_search_result] = useState([]);

  const chainSwitchReload = async () => {
    try {
      setChainIdMain();
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  // switch chain area
  const switchPolygonChain = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13881" }],
      });
      chainSwitchReload("80001");
      setShowNetworkPopup(!showNetworkPopup);
      // window.location.reload(false);
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
          chainSwitchReload("80001");
          setShowNetworkPopup(!showNetworkPopup);
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  const switchPolygonZkChain = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5A2" }],
      });
      chainSwitchReload("1442");
      setShowNetworkPopup(!showNetworkPopup);
      // window.location.reload(false);
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x5A2",
                chainName: "Polygon zkEVM Testnet",
                nativeCurrency: {
                  name: "Polygon",
                  symbol: "MATIC",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://explorer.public.zkevm-test.net"],
                rpcUrls: ["https://rpc.public.zkevm-test.net"],
              },
            ],
          });
          chainSwitchReload("1442");
          setShowNetworkPopup(!showNetworkPopup);
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  const switchFilChain = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xC45" }],
      });
      chainSwitchReload("3141");
      setShowNetworkPopup(!showNetworkPopup);
      // window.location.reload(false);
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xC45",
                chainName: "Filecoin - Filecoin testnet",
                nativeCurrency: {
                  name: "Filecoin",
                  symbol: "Fil",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://fil.com"],
                rpcUrls: ["https://api.Filecoin.node.glif.io/rpc/v1	"],
              },
            ],
          });
          chainSwitchReload("3141");
          setShowNetworkPopup(!showNetworkPopup);
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  const switchMantleChain = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1389" }],
      });
      chainSwitchReload("5001");
      setShowNetworkPopup(!showNetworkPopup);
      // window.location.reload(false);
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x1389",
                chainName: "Mantle",
                nativeCurrency: {
                  name: "Mantle",
                  symbol: "BIT",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://mantle.xyz/"],
                rpcUrls: ["https://rpc.testnet.mantle.xyz"],
              },
            ],
          });
          chainSwitchReload("5001");
          setShowNetworkPopup(!showNetworkPopup);
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  const switchScrollChain = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x82751" }],
      });
      chainSwitchReload("534353");
      setShowNetworkPopup(!showNetworkPopup);
      // window.location.reload(false);
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x82751",
                chainName: "Scroll Alpha Testnet",
                nativeCurrency: {
                  name: "Scroll",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://blockscout.scroll.io/"],
                rpcUrls: ["https://alpha-rpc.scroll.io/l2"],
              },
            ],
          });
          chainSwitchReload("534353");
          setShowNetworkPopup(!showNetworkPopup);
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  const switchTaikoChain = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x28C5C" }],
      });
      chainSwitchReload("167004");
      setShowNetworkPopup(!showNetworkPopup);
      // window.location.reload(false);
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x28C5C",
                chainName: "Taiko Testnet",
                nativeCurrency: {
                  name: "Taiko",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://blockscout.scroll.io/"],
                rpcUrls: ["https://l2rpc.hackathon.taiko.xyz"],
              },
            ],
          });
          chainSwitchReload("167004");
          setShowNetworkPopup(!showNetworkPopup);
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  const switchChiadoChain = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x27D8" }],
      });
      chainSwitchReload("10200");
      setShowNetworkPopup(!showNetworkPopup);
      // window.location.reload(false);
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x27D8",
                chainName: "Chiado Testnet",
                nativeCurrency: {
                  name: "Chiado",
                  symbol: "xDAI",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://blockscout.com/gnosis/chiado"],
                rpcUrls: ["https://rpc.chiadochain.net"],
              },
            ],
          });
          chainSwitchReload("10200");
          setShowNetworkPopup(!showNetworkPopup);
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  const switchEthereumChain = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }],
      });
      chainSwitchReload("1");
      setShowNetworkPopup(!showNetworkPopup);
      // window.location.reload(false);
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x1",
                chainName: "Ethereum Mainnet",
                nativeCurrency: {
                  name: "ETHEREUM",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://etherscan.io"],
                rpcUrls: [""],
              },
            ],
          });
          chainSwitchReload("1");
          setShowNetworkPopup(!showNetworkPopup);
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  const switchBSCChain = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }],
      });
      chainSwitchReload("56");
      setShowNetworkPopup(!showNetworkPopup);
      // window.location.reload(false);
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x38",
                chainName: "BSC Mainnet",
                nativeCurrency: {
                  name: "BNB",
                  symbol: "BNB",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://bscscan.com/"],
                rpcUrls: ["https://bsc-dataseed2.ninicoin.io"],
              },
            ],
          });
          chainSwitchReload("56");
          setShowNetworkPopup(!showNetworkPopup);
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
      chainSwitchReload("5");
      setShowNetworkPopup(!showNetworkPopup);
      // window.location.reload(false);
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
          setShowNetworkPopup(!showNetworkPopup);
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  const find_nft = async (e) => {
    try {
      if (!e.target.value) return;
      setTimeout(async () => {
        const res = await search_nft(e.target.value);
        set_search_result(res);
      }, [500]);
    } catch (error) {
      console.log(error.message);
    }
  };

  // push functions
  const optInToChannel = async () => {
    await PushAPI.channels.subscribe({
      env: "staging",
      signer: signer,
      channelAddress: `eip155:${chainIdMain}:${RARX_CHANNEL_ADDRESS}`,
      userAddress: `eip155:${chainIdMain}:${signer_address}`,
      onSuccess: () => {
        setOptedIn(true);
      },
      onError: (err) => {
        console.error("opt-in error", err);
      },
    });
  };

  const getNotifications = () => {
    PushAPI.user
      .getFeeds({
        user: `eip155:${chainIdMain}:${signer_address}`,
        env: "staging",
        page: 1,
        limit: 10,
      })
      .then((feeds) => {
        setNotificationData(feeds);
        if (feeds[0]?.app != "404 Marketplace") {
          setNullNotification(false);
        }
      })
      .catch((err) => {
        console.error("failed to get user notifications: ", err);
      });
  };
  useEffect(() => {
    connectToWallet();
    // getNotifications();
    setShowNetworkPopup(false);
    SetShowNotifications(false);
    setProfileDrop(false);
  }, [router.pathname]);

  return (
    <div className="overflow-x-hidden font-body text-jacarta-500 dark:bg-jacarta-900">
      <div className="js-page-header fixed top-0 z-20 w-full backdrop-blur transition-colors">
        <div className="flex items-center px-6 py-2 xl:px-24">
          {/* icon  */}
          <Link href="/" className="shrink-0">
            <Image
              src={rarxlogo}
              height={150}
              width={150}
              alt="404 | NFT Marketplace"
            />
          </Link>

          {/* search form  */}

          <div className="flex">
            <form
              action="search"
              className="relative ml-12 mr-8 basis-8/12 xl:ml-[8%]"
              id="searchInp"
            >
              <input
                type="search"
                onFocus={() => set_search_result([])}
                onChange={find_nft}
                className="w-full rounded-2xl border border-jacarta-100 py-[0.6875rem] px-4 pl-10 text-jacarta-700 placeholder-jacarta-500 focus:ring-accent dark:border-transparent dark:bg-white/[.15] dark:text-white dark:placeholder-white"
                placeholder="Search"
              />
              <span className="absolute left-0 top-0 flex h-full w-12 items-center justify-center rounded-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="h-4 w-4 fill-jacarta-500 dark:fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z" />
                </svg>
              </span>
              {/* SEARCH FUNCTIONALITY */}
              <div
                className="w-full rounded-2xl bg-[#F6F1F8] absolute mt-2 border-r-4"
                onClick={() => set_search_result([])}
              >
                {search_result?.map((e, index) => (
                  <Link
                    key={index}
                    href={`/nft/${e.ipfsData.collection}/${e.tokenId}`}
                    className="rounded-2xl"
                  >
                    <div className="w-full rounded-2xl border-gray-200 border-b-2 p-4 hover:bg-[#f5f5f5]">
                      {e?.nft_name}
                    </div>
                  </Link>
                ))}
              </div>
            </form>
          </div>

          <div className="js-mobile-menu invisible lg:visible fixed inset-0 z-10 ml-auto items-center bg-white opacity-0 dark:bg-black lg:relative lg:inset-auto lg:flex lg:bg-transparent lg:opacity-100 dark:lg:bg-transparent">
            {/* menu links  */}
            <div className="navbar w-full">
              <ul className="flex flex-col lg:flex-row">
                <li className="js-nav-dropdown group relative">
                  <Link
                    href="#"
                    className="dropdown-toggle flex items-center justify-between py-3.5 font-vt323 text-base text-jacarta-700 hover:text-accent focus:text-accent dark:text-white dark:hover:text-accent dark:focus:text-accent lg:px-5"
                    id="navDropdown-4"
                    aria-expanded="false"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Explore
                  </Link>
                  <ul
                    className="dropdown-menu group-hover:visible lg:invisible left-0 top-[85%] z-10 hidden min-w-[200px] gap-x-4 whitespace-nowrap rounded-xl bg-white transition-all will-change-transform group-hover:opacity-100 dark:bg-black lg:absolute lg:grid lg:translate-y-4 lg:py-4 lg:px-2 lg:opacity-0 lg:shadow-2xl lg:group-hover:translate-y-2"
                    aria-labelledby="navDropdown-4"
                  >
                    <li>
                      <Link
                        href="/marketplace"
                        className="flex items-center rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
                      >
                        <span className="mr-3 rounded-xl bg-light-base p-[0.375rem]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="h-4 w-4 fill-jacarta-700"
                          >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M22 12.999V20a1 1 0 0 1-1 1h-8v-8.001h9zm-11 0V21H3a1 1 0 0 1-1-1v-7.001h9zM11 3v7.999H2V4a1 1 0 0 1 1-1h8zm10 0a1 1 0 0 1 1 1v6.999h-9V3h8z" />
                          </svg>
                        </span>
                        <span className="font-vt323 text-sm text-jacarta-700 dark:text-white">
                          All NFTs
                        </span>
                      </Link>
                    </li>

                    {/* <li>
                      <Link
                        href="/collection/TopCollections"
                        className="flex items-center rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
                      >
                        <span className="mr-3 rounded-xl bg-[#FDF7EE] p-[0.375rem]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="h-4 w-4 fill-[#FEB240]"
                          >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M17.5 2a4.5 4.5 0 0 1 2.951 7.897c.355.967.549 2.013.549 3.103A9 9 0 1 1 3.55 9.897a4.5 4.5 0 1 1 6.791-5.744 9.05 9.05 0 0 1 3.32 0A4.494 4.494 0 0 1 17.5 2zm0 2c-.823 0-1.575.4-2.038 1.052l-.095.144-.718 1.176-1.355-.253a7.05 7.05 0 0 0-2.267-.052l-.316.052-1.356.255-.72-1.176A2.5 2.5 0 1 0 4.73 8.265l.131.123 1.041.904-.475 1.295A7 7 0 1 0 19 13c0-.716-.107-1.416-.314-2.083l-.112-.33-.475-1.295 1.04-.904A2.5 2.5 0 0 0 17.5 4zM10 13a2 2 0 1 0 4 0h2a4 4 0 1 1-8 0h2z" />
                          </svg>
                        </span>
                        <span className="font-vt323 text-sm text-jacarta-700 dark:text-white">
                          All Collections
                        </span>
                      </Link>
                    </li> */}
                  </ul>
                </li>

                <li className="js-nav-dropdown group relative">
                  <a
                    href="#"
                    className="dropdown-toggle flex items-center justify-between py-3.5 font-vt323 text-base text-jacarta-700 hover:text-accent focus:text-accent dark:text-white dark:hover:text-accent dark:focus:text-accent lg:px-5"
                    id="navDropdown-4"
                    aria-expanded="false"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Create
                  </a>
                  <ul
                    className="dropdown-menu group-hover:visible lg:invisible left-0 top-[85%] z-10 hidden min-w-[200px] gap-x-4 whitespace-nowrap rounded-xl bg-white transition-all will-change-transform group-hover:opacity-100 dark:bg-black lg:absolute lg:grid lg:translate-y-4 lg:py-4 lg:px-2 lg:opacity-0 lg:shadow-2xl lg:group-hover:translate-y-2"
                    aria-labelledby="navDropdown-4"
                  >
                    <li>
                      <Link
                        href="/mint/CreateNFT"
                        className="flex items-center rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
                      >
                        <span className="font-vt323 text-sm text-jacarta-700 dark:text-white">
                          Mint NFT
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/mint/CreateNFT"
                        className="flex items-center rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
                      >
                        <span className="font-vt323 text-sm text-jacarta-700 dark:text-white">
                          Mint Banana
                        </span>
                      </Link>
                    </li>
                    {/* <li>
                      <Link
                        href="/mint/CreateAINFT"
                        className="flex items-center rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
                      >
                        <span className="font-vt323 text-sm text-jacarta-700 dark:text-white">
                          Create AI NFT
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/mint/CreateNFTCollection"
                        className="flex items-center rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
                      >
                        <span className="font-vt323 text-sm text-jacarta-700 dark:text-white">
                          Mint NFT Collection
                        </span>
                      </Link>
                    </li> */}
                  </ul>
                </li>

                {/* <li>
                  <a
                    href="/stake/stake"
                    className="dropdown-toggle flex items-center justify-between py-3.5 font-vt323 text-base text-jacarta-700 hover:text-accent focus:text-accent dark:text-white dark:hover:text-accent dark:focus:text-accent lg:px-5"
                    id="navDropdown-4"
                    aria-expanded="false"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Stake
                  </a>
                </li> */}

                {/* <li className="js-nav-dropdown group relative">
                  <a
                    href="#"
                    className="dropdown-toggle flex items-center justify-between py-3.5 font-vt323 text-base text-jacarta-700 hover:text-accent focus:text-accent dark:text-white dark:hover:text-accent dark:focus:text-accent lg:px-5"
                    id="navDropdown-4"
                    aria-expanded="false"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Bridge
                  </a>
                  <ul
                    className="dropdown-menu group-hover:visible lg:invisible left-0 top-[85%] z-10 hidden min-w-[200px] gap-x-4 whitespace-nowrap rounded-xl bg-white transition-all will-change-transform group-hover:opacity-100 dark:bg-black lg:absolute lg:grid lg:translate-y-4 lg:py-4 lg:px-2 lg:opacity-0 lg:shadow-2xl lg:group-hover:translate-y-2"
                    aria-labelledby="navDropdown-4"
                  >
                    <li>
                      <Link
                        href="/BridgeNFT"
                        className="flex items-center rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
                      >
                        <span className="font-vt323 text-sm text-jacarta-700 dark:text-white">
                          Bridge NFT
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/BridgeTokens"
                        className="flex items-center rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
                      >
                        <span className="font-vt323 text-sm text-jacarta-700 dark:text-white">
                          Bridge Tokens <sup>Coming Soon</sup>
                        </span>
                      </Link>
                    </li>
                  </ul>
                </li> */}

                <li className="js-nav-dropdown group relative">
                  <Link
                    href="/Game"
                    className="dropdown-toggle flex items-center justify-between py-3.5 font-vt323 text-base text-jacarta-700 hover:text-accent focus:text-accent dark:text-white dark:hover:text-accent dark:focus:text-accent lg:px-5"
                    id="navDropdown-1"
                    aria-expanded="false"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Game
                  </Link>
                </li>

                <li className="js-nav-dropdown group relative">
                  <Link
                    href="/About"
                    className="dropdown-toggle flex items-center justify-between py-3.5 font-vt323 text-base text-jacarta-700 hover:text-accent focus:text-accent dark:text-white dark:hover:text-accent dark:focus:text-accent lg:px-5"
                    id="navDropdown-1"
                    aria-expanded="false"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* pc connect wallet  */}
            <div className="ml-8 hidden lg:flex xl:ml-12">
              {!signer_address ? (
                <a
                  href="#"
                  onClick={connectToWallet}
                  className="js-wallet group flex h-10 w-10 items-center justify-center rounded-full border border-jacarta-100 bg-white transition-colors hover:border-transparent hover:bg-accent focus:border-transparent focus:bg-accent dark:border-transparent dark:bg-white/[.15] dark:hover:bg-accent"
                  data-bs-toggle="modal"
                  data-bs-target="#walletModal"
                  aria-label="wallet"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="h-4 w-4 fill-jacarta-700 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M22 6h-7a6 6 0 1 0 0 12h7v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2zm-7 2h8v8h-8a4 4 0 1 1 0-8zm0 3v2h3v-2h-3z" />
                  </svg>
                </a>
              ) : (
                <>
                  {/* network nav div  */}
                  <div className="relative mr-32 ml-16 z-[100]">
                    <button
                      onClick={() => (
                        setShowNetworkPopup(!showNetworkPopup),
                        SetShowNotifications(false),
                        setProfileDrop(false)
                      )}
                      className="relative hidden sm:block"
                    >
                      <div className="flex flex-row justify-center align-middle w-[200px] ">
                        {/* {chainIdMain == 10200 && (
                          <>
                            <Image
                              src={gnosisLogo}
                              height={25}
                              width={30}
                              alt="gnosis"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold ">
                              Chiado Testnet
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 " />
                          </>
                        )}
                        {chainIdMain == 80001 && (
                          <>
                            <Image
                              src={polygonLogo}
                              height={20}
                              width={30}
                              alt="maticPng"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold ">
                              Polygon Mumbai
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 " />
                          </>
                        )}
                        {chainIdMain == 1442 && (
                          <>
                            <Image
                              src={polygonLogo}
                              height={20}
                              width={30}
                              alt="maticPng"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold ">
                              Polygon ZKEVM
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 " />
                          </>
                        )}
                        {chainIdMain == 3141 && (
                          <>
                            <Image
                              src={filecoinLogo}
                              height={25}
                              width={35}
                              alt="filPng"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold ">
                              Filecoin Testnet
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 " />
                          </>
                        )}
                        {chainIdMain == 534353 && (
                          <>
                            <Image
                              src={scrollLogo}
                              height={25}
                              width={35}
                              alt="filPng"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold ">
                              Scroll Testnet
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 " />
                          </>
                        )}
                        {chainIdMain == 167004 && (
                          <>
                            <Image
                              src={TaikoLogo}
                              height={25}
                              width={35}
                              alt="filPng"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold ">
                              Taiko Testnet
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 " />
                          </>
                        )}
                        {chainIdMain == 5001 && (
                          <>
                            <Image
                              src={mantleLogo}
                              height={25}
                              width={35}
                              alt="mantlePng"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold ">
                              Mantle Testnet
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 " />
                          </>
                        )}
                        {chainIdMain == 5 && (
                          <>
                            <Image
                              src={goerliLogo}
                              height={25}
                              width={35}
                              alt="filPng"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold ">
                              Eth Goerli
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 " />
                          </>
                        )} */}

                        {/* unsupported chains  */}
                        {chainIdMain == 1 && (
                          <>
                            <Image
                              src={goerliLogo}
                              height={20}
                              width={30}
                              alt="goerliLogo"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold ">
                              Ethereum
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 " />
                          </>
                        )}
                        {chainIdMain == 56 && (
                          <>
                            <Image
                              src={bscLogo}
                              height={20}
                              width={30}
                              alt="bscLogo"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold ">BSC</p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 " />
                          </>
                        )}
                        {/* {chainIdMain == 137 && (
                          <>
                            <p className="pl-2 pr-2 mt-1 font-bold ">
                              Unsupported Chain
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 " />
                          </>
                        )}
                        {chainIdMain == 43114 && (
                          <>
                            <p className="pl-2 pr-2 mt-1 font-bold ">
                              Unsupported Chain
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 " />
                          </>
                        )} */}
                        {chainIdMain !== 56 && chainIdMain !== 1 && (
                          <>
                            <p className="pl-2 pr-2 mt-1 font-bold text-red">
                              Unsupported Chain
                            </p>
                            <BsChevronDown className="h-3 w-3 2xl:h-3 2xl:w-3 mt-[10px] hover:text-blue-400 " />
                          </>
                        )}
                      </div>
                    </button>

                    {/* network drop down  */}
                    {showNetworkPopup && (
                      <div className="flex flex-col justify-center w-[200px] absolute top-[24px] right-0 mt-7 shadow-xl bg-white z-10 text-sm shadow-4xl rounded-b-lg cursor-pointer">
                        {chainIdMain != 1 && (
                          <div
                            className="flex flex-row justify-center pt-4 pb-2 hover:bg-slate-100"
                            onClick={() => switchEthereumChain()}
                          >
                            <Image
                              src={goerliLogo}
                              height={25}
                              width={30}
                              alt="gnosis"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold ">
                              Ethereum
                            </p>
                          </div>
                        )}

                        {chainIdMain != 56 && (
                          <div
                            className="flex flex-row justify-center pt-4 pb-2 hover:bg-slate-100"
                            onClick={() => switchBSCChain()}
                          >
                            <Image
                              src={bscLogo}
                              height={25}
                              width={30}
                              alt="bscLogo"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold ">BSC</p>
                          </div>
                        )}
                        {/* {chainIdMain != 10200 && (
                          <div
                            className="flex flex-row justify-center pt-4 pb-2 hover:bg-slate-100"
                            onClick={() => switchChiadoChain()}
                          >
                            <Image
                              src={gnosisLogo}
                              height={25}
                              width={30}
                              alt="gnosis"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold ">
                              Chiado Testnet
                            </p>
                          </div>
                        )}
                        {chainIdMain != 80001 && (
                          <div
                            className="flex flex-row justify-center pt-2 pb-2 hover:bg-slate-100"
                            onClick={() => switchPolygonChain()}
                          >
                            <Image
                              src={polygonLogo}
                              height={20}
                              width={30}
                              alt="maticPng"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold ">
                              Polygon Mumbai
                            </p>
                          </div>
                        )}
                        {chainIdMain != 1442 && (
                          <div
                            className="flex flex-row justify-center pt-2 pb-2 hover:bg-slate-100"
                            onClick={() => switchPolygonZkChain()}
                          >
                            <Image
                              src={polygonLogo}
                              height={20}
                              width={30}
                              alt="maticPng"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold ">
                              Polygon ZKEVM
                            </p>
                          </div>
                        )}
                        {chainIdMain != 3141 && (
                          <div
                            className="flex flex-row justify-center pt-2 pb-2 hover:bg-slate-100"
                            onClick={() => switchFilChain()}
                          >
                            <Image
                              src={filecoinLogo}
                              height={25}
                              width={35}
                              alt="filPng"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold ">
                              Filecoin Testnet
                            </p>
                          </div>
                        )}
                        {chainIdMain != 5001 && (
                          <div
                            className="flex flex-row justify-center pt-2 pb-2 hover:bg-slate-100"
                            onClick={() => switchMantleChain()}
                          >
                            <Image
                              src={mantleLogo}
                              height={20}
                              width={30}
                              alt="maticPng"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold">
                              Mantle Testnet
                            </p>
                          </div>
                        )}
                        {chainIdMain != 534353 && (
                          <div
                            className="flex flex-row justify-center pt-2 pb-2 hover:bg-slate-100"
                            onClick={() => switchScrollChain()}
                          >
                            <Image
                              src={scrollLogo}
                              height={20}
                              width={30}
                              alt="maticPng"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold">
                              Scroll Testnet
                            </p>
                          </div>
                        )}
                        {chainIdMain != 167004 && (
                          <div
                            className="flex flex-row justify-center pt-2 pb-2 hover:bg-slate-100"
                            onClick={() => switchTaikoChain()}
                          >
                            <Image
                              src={TaikoLogo}
                              height={20}
                              width={30}
                              alt="goerliLogo"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold">
                              Taiko Testnet
                            </p>
                          </div>
                        )}
                        {chainIdMain != 5 && (
                          <div
                            className="flex flex-row justify-center pt-2 pb-4 hover:bg-slate-100"
                            onClick={() => switchGoerliChain()}
                          >
                            <Image
                              src={goerliLogo}
                              height={20}
                              width={30}
                              alt="goerliLogo"
                            />
                            <p className="pl-2 pr-2 mt-1 font-bold">
                              Eth Goerli
                            </p>
                          </div>
                        )} */}
                      </div>
                    )}
                  </div>

                  {/* notifications  */}
                  <div className="relative mr-2 z-[100]">
                    <button
                      onClick={() => (
                        // getNotifications(),
                        SetShowNotifications(!showNotifications),
                        setShowNetworkPopup(false),
                        setProfileDrop(false)
                      )}
                      className="hidden text-gray-400 mt-[5px] transition-colors duration-300 transform lg:block hover:text-gray-600  text-base text-jacarta-700"
                    >
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {showNotifications && (
                      <div className="absolute right-[-50px] z-20 w-64 mt-6 overflow-hidden origin-top-right bg-white rounded-md shadow-xl sm:w-80 dark:bg-gray-800">
                        {notificationData &&
                          notificationData?.map((e, i) => {
                            return (
                              i < 6 &&
                              e.app === "404 Marketplace" && (
                                <div key={e.sid}>
                                  <a
                                    href={e.cta}
                                    rel="noreferrer"
                                    target="_blank"
                                    className="flex items-center px-4 py-3 -mx-2 transition-colors duration-300 transform border-b border-gray-100 hover:bg-gray-100"
                                  >
                                    <Image
                                      className="flex-shrink-0 object-cover w-8 h-8 mx-1 rounded-full"
                                      src={e.icon}
                                      alt="avatar"
                                      height={100}
                                      width={100}
                                    />
                                    <p className="mx-2 text-sm text-black flex flex-col">
                                      <a
                                        className="font-bold text-[12px]"
                                        href={e.cta}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        {e.notification.title}
                                      </a>
                                      <span className="font-mono text-[10px]">
                                        {e.notification.body}
                                      </span>
                                    </p>
                                  </a>
                                </div>
                              )
                            );
                          })}
                        {notificationData &&
                          notificationData[0]?.app != "404 Marketplace" && (
                            <div className="h-[135px]">
                              <a
                                href="#"
                                rel="noreferrer"
                                className="flex items-center px-4 py-3 transition-colors duration-300 transform border-gray-100"
                              >
                                <p className="mx-2 text-sm text-black flex flex-col">
                                  <a
                                    className="font-bold text-[12px]"
                                    href="#"
                                    rel="noreferrer"
                                  >
                                    No Notifications yet! click below button to
                                    susbcribe the rarx marketplace notification
                                    channel, ignore if already subscribed
                                  </a>
                                  {optedIn ? (
                                    <button
                                      type="button"
                                      className="text-white font-medium rounded-lg text-sm px-5 py-2.5 mb-4 mt-4"
                                      style={{ backgroundColor: "#6D3EEE" }}
                                    >
                                      Subscribed 🎉
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => optInToChannel()}
                                      type="button"
                                      className="text-white font-medium rounded-lg text-sm px-5 py-2.5 mb-4 mt-4"
                                      style={{ backgroundColor: "#6D3EEE" }}
                                    >
                                      Subscribe
                                    </button>
                                  )}
                                </p>
                              </a>
                            </div>
                          )}
                        {notificationData &&
                          notificationData.length === 0 &&
                          nullNotification == true && (
                            <div className="h-[135px]">
                              <a
                                href="#"
                                rel="noreferrer"
                                className="flex items-center px-4 py-3 transition-colors duration-300 transform border-gray-100"
                              >
                                <p className="mx-2 text-sm text-black flex flex-col">
                                  <a
                                    className="font-bold text-[12px]"
                                    href="#"
                                    rel="noreferrer"
                                  >
                                    No Notifications yet! click below button to
                                    susbcribe the rarx marketplace notification
                                    channel, ignore if already subscribed
                                  </a>
                                  {optedIn ? (
                                    <button
                                      type="button"
                                      className="text-white font-medium rounded-lg text-sm px-5 py-2.5 mb-4 mt-4"
                                      style={{ backgroundColor: "#6D3EEE" }}
                                    >
                                      Subscribed 🎉
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => optInToChannel()}
                                      type="button"
                                      className="text-white font-medium rounded-lg text-sm px-5 py-2.5 mb-4 mt-4"
                                      style={{ backgroundColor: "#6D3EEE" }}
                                    >
                                      Subscribe
                                    </button>
                                  )}
                                </p>
                              </a>
                            </div>
                          )}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    {/* profile icon */}
                    <button
                      className="group ml-2 flex h-10 w-10 items-center justify-center rounded-full border border-jacarta-100 bg-white transition-colors hover:border-transparent hover:bg-accent focus:border-transparent focus:bg-accent dark:border-transparent dark:bg-white/[.15] dark:hover:bg-accent"
                      onClick={() => (
                        setProfileDrop(!profileDrop),
                        SetShowNotifications(false),
                        setShowNetworkPopup(false)
                      )}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="h-4 w-4 fill-jacarta-700 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
                      >
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path d="M11 14.062V20h2v-5.938c3.946.492 7 3.858 7 7.938H4a8.001 8.001 0 0 1 7-7.938zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z" />
                      </svg>
                    </button>

                    {/* profile dropdown  */}
                    {profileDrop && (
                      <div className="!-right-4 !top-[85%] !left-auto z-10 min-w-[14rem] whitespace-nowrap rounded-xl bg-white transition-all will-change-transform before:absolute before:-top-3 before:h-3 before:w-full group-dropdown-hover:opacity-100 dark:bg-black lg:absolute lg:grid lg:!translate-y-4 lg:py-4 lg:px-2 lg:shadow-2xl">
                        <button
                          className="js-copy-clipboard my-4 flex select-none items-center whitespace-nowrap px-5 font-vt323 leading-none text-jacarta-700 dark:text-white"
                          data-tippy-content="Copy"
                        >
                          <span className="max-w-[10rem] overflow-hidden text-ellipsis">
                            {signer_address}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="ml-1 mb-px h-4 w-4 fill-jacarta-500 dark:fill-jacarta-300"
                          >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M7 7V3a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-4v3.993c0 .556-.449 1.007-1.007 1.007H3.007A1.006 1.006 0 0 1 2 20.993l.003-12.986C2.003 7.451 2.452 7 3.01 7H7zm2 0h6.993C16.549 7 17 7.449 17 8.007V15h3V4H9v3zM4.003 9L4 20h11V9H4.003z" />
                          </svg>
                        </button>

                        <div className="mx-5 mb-6 rounded-lg border border-jacarta-100 p-4 dark:border-jacarta-600">
                          <span className="text-sm font-medium tracking-tight dark:text-jacarta-200">
                            Balance
                          </span>
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-green">
                              {signer_bal} {"  "} {symbol}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/profile/${signer_address}`}
                          className="flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="h-4 w-4 fill-jacarta-700 transition-colors dark:fill-white"
                          >
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path d="M11 14.062V20h2v-5.938c3.946.492 7 3.858 7 7.938H4a8.001 8.001 0 0 1 7-7.938zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z"></path>
                          </svg>
                          <span className="mt-1 font-vt323 text-sm text-jacarta-700 dark:text-white">
                            My Profile
                          </span>
                        </Link>
                        <Link
                          href="/profile/EditProfile"
                          className="flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="h-4 w-4 fill-jacarta-700 transition-colors dark:fill-white"
                          >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M9.954 2.21a9.99 9.99 0 0 1 4.091-.002A3.993 3.993 0 0 0 16 5.07a3.993 3.993 0 0 0 3.457.261A9.99 9.99 0 0 1 21.5 8.876 3.993 3.993 0 0 0 20 12c0 1.264.586 2.391 1.502 3.124a10.043 10.043 0 0 1-2.046 3.543 3.993 3.993 0 0 0-3.456.261 3.993 3.993 0 0 0-1.954 2.86 9.99 9.99 0 0 1-4.091.004A3.993 3.993 0 0 0 8 18.927a3.993 3.993 0 0 0-3.457-.26A9.99 9.99 0 0 1 2.5 15.121 3.993 3.993 0 0 0 4 11.999a3.993 3.993 0 0 0-1.502-3.124 10.043 10.043 0 0 1 2.046-3.543A3.993 3.993 0 0 0 8 5.071a3.993 3.993 0 0 0 1.954-2.86zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                          </svg>
                          <span className="mt-1 font-vt323 text-sm text-jacarta-700 dark:text-white">
                            Edit Profile
                          </span>
                        </Link>
                        <Link
                          href="/mint/CreateNFT"
                          className="flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="h-4 w-4 fill-jacarta-700 transition-colors dark:fill-white rotate-180"
                          >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM7 11V8l-5 4 5 4v-3h8v-2H7z" />
                          </svg>
                          <span className="mt-1 font-vt323 text-sm text-jacarta-700 dark:text-white">
                            Mint NFT
                          </span>
                        </Link>
                        {/* <Link
                          href="/Notifications"
                          className="flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
                        >
                          <svg
                            className="h-5 w-5 fill-jacarta-700"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9" />
                          </svg>
                          <span className="mt-1 font-vt323 text-sm text-jacarta-700 dark:text-white">
                            Notifications
                          </span>
                        </Link>
                        <Link
                          href="/Transactions"
                          className="flex items-center space-x-2 rounded-xl px-6 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 18c4.667 4.667 12 1.833 12-4.042h-3l5-6 5 6h-3c-1.125 7.98-11.594 11.104-16 4.042zm14-11.984c-4.667-4.667-12-1.834-12 4.041h3l-5 6-5-6h3c1.125-7.979 11.594-11.104 16-4.041z" />
                          </svg>
                          <span className="mt-1 font-vt323 text-sm text-jacarta-700 dark:text-white">
                            Transactions
                          </span>
                        </Link> */}
                        <a
                          onClick={() => signOut()}
                          className="cursor-pointer flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className="h-4 w-4 fill-jacarta-700 transition-colors dark:fill-white"
                          >
                            <path fill="none" d="M0 0h24v24H0z" />
                            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM7 11V8l-5 4 5 4v-3h8v-2H7z" />
                          </svg>
                          <span className="mt-1 font-vt323 text-sm text-jacarta-700 dark:text-white">
                            Sign out
                          </span>
                        </a>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* mobile connect wallet */}
          <div className="ml-auto flex lg:hidden">
            {!signer_address ? (
              <a
                href="#"
                // onClick={}
                className="ml-4 js-wallet group flex h-10 w-10 items-center justify-center rounded-full border border-jacarta-100 bg-white transition-colors hover:border-transparent hover:bg-accent focus:border-transparent focus:bg-accent dark:border-transparent dark:bg-white/[.15] dark:hover:bg-accent"
                data-bs-toggle="modal"
                data-bs-target="#walletModal"
                aria-label="wallet"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="h-4 w-4 fill-jacarta-700 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path d="M22 6h-7a6 6 0 1 0 0 12h7v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2zm-7 2h8v8h-8a4 4 0 1 1 0-8zm0 3v2h3v-2h-3z" />
                </svg>
              </a>
            ) : (
              <div className="relative">
                {/* profile icon */}
                <button
                  className="group ml-2 flex h-10 w-10 items-center justify-center rounded-full border border-jacarta-100 bg-white transition-colors hover:border-transparent hover:bg-accent focus:border-transparent focus:bg-accent dark:border-transparent dark:bg-white/[.15] dark:hover:bg-accent"
                  onClick={() => setMobieProfileDrop(!mobieProfileDrop)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="h-4 w-4 fill-jacarta-700 transition-colors group-hover:fill-white group-focus:fill-white dark:fill-white"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M11 14.062V20h2v-5.938c3.946.492 7 3.858 7 7.938H4a8.001 8.001 0 0 1 7-7.938zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        {/* profile dropdown  */}
        {mobieProfileDrop && (
          <div className="!-right-4 !top-[85%] !left-auto z-10 min-w-[14rem] whitespace-nowrap rounded-xl bg-white transition-all will-change-transform before:absolute before:-top-3 before:h-3 before:w-full group-dropdown-hover:opacity-100 dark:bg-black lg:absolute lg:grid lg:!translate-y-4 lg:py-4 lg:px-2 lg:shadow-2xl py-6">
            <button
              className="js-copy-clipboard my-4 flex select-none items-center whitespace-nowrap px-5 font-vt323 leading-none text-jacarta-700 dark:text-white"
              data-tippy-content="Copy"
            >
              <span className="max-w-[10rem] overflow-hidden text-ellipsis">
                {signer_address}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="ml-1 mb-px h-4 w-4 fill-jacarta-500 dark:fill-jacarta-300"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M7 7V3a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-4v3.993c0 .556-.449 1.007-1.007 1.007H3.007A1.006 1.006 0 0 1 2 20.993l.003-12.986C2.003 7.451 2.452 7 3.01 7H7zm2 0h6.993C16.549 7 17 7.449 17 8.007V15h3V4H9v3zM4.003 9L4 20h11V9H4.003z" />
              </svg>
            </button>

            <div className="mx-5 mb-6 rounded-lg border border-jacarta-100 p-4 dark:border-jacarta-600">
              <span className="text-sm font-medium tracking-tight dark:text-jacarta-200">
                Balance
              </span>
              <div className="flex items-center">
                <span className="text-lg font-bold text-green">
                  {signer_bal ? signer_bal : "0.00"} {"  "}{" "}
                  {symbol ? symbol : "ETH"}
                </span>
              </div>
            </div>
            <Link
              href={`/profile/${signer_address}`}
              className="flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="h-4 w-4 fill-jacarta-700 transition-colors dark:fill-white"
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M11 14.062V20h2v-5.938c3.946.492 7 3.858 7 7.938H4a8.001 8.001 0 0 1 7-7.938zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6z"></path>
              </svg>
              <span className="mt-1 font-vt323 text-sm text-jacarta-700 dark:text-white">
                My Profile
              </span>
            </Link>
            <Link
              href="/profile/EditProfile"
              className="flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="h-4 w-4 fill-jacarta-700 transition-colors dark:fill-white"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M9.954 2.21a9.99 9.99 0 0 1 4.091-.002A3.993 3.993 0 0 0 16 5.07a3.993 3.993 0 0 0 3.457.261A9.99 9.99 0 0 1 21.5 8.876 3.993 3.993 0 0 0 20 12c0 1.264.586 2.391 1.502 3.124a10.043 10.043 0 0 1-2.046 3.543 3.993 3.993 0 0 0-3.456.261 3.993 3.993 0 0 0-1.954 2.86 9.99 9.99 0 0 1-4.091.004A3.993 3.993 0 0 0 8 18.927a3.993 3.993 0 0 0-3.457-.26A9.99 9.99 0 0 1 2.5 15.121 3.993 3.993 0 0 0 4 11.999a3.993 3.993 0 0 0-1.502-3.124 10.043 10.043 0 0 1 2.046-3.543A3.993 3.993 0 0 0 8 5.071a3.993 3.993 0 0 0 1.954-2.86zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              </svg>
              <span className="mt-1 font-vt323 text-sm text-jacarta-700 dark:text-white">
                Edit Profile
              </span>
            </Link>
            {/* <Link
              href="/Notifications"
              className="flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
            >
              <svg
                className="h-5 w-5 fill-jacarta-700"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9" />
              </svg>
              <span className="mt-1 font-vt323 text-sm text-jacarta-700 dark:text-white">
                Notifications
              </span>
            </Link>
            <Link
              href="/Transactions"
              className="flex items-center space-x-2 rounded-xl px-6 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <path d="M5 18c4.667 4.667 12 1.833 12-4.042h-3l5-6 5 6h-3c-1.125 7.98-11.594 11.104-16 4.042zm14-11.984c-4.667-4.667-12-1.834-12 4.041h3l-5 6-5-6h3c1.125-7.979 11.594-11.104 16-4.041z" />
              </svg>
              <span className="mt-1 font-vt323 text-sm text-jacarta-700 dark:text-white">
                Transactions
              </span>
            </Link> */}
            <a
              href="#"
              className="flex items-center space-x-2 rounded-xl px-5 py-2 transition-colors hover:bg-jacarta-50 hover:text-accent focus:text-accent dark:hover:bg-jacarta-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="h-4 w-4 fill-jacarta-700 transition-colors dark:fill-white"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM7 11V8l-5 4 5 4v-3h8v-2H7z" />
              </svg>
              <span className="mt-1 font-vt323 text-sm text-jacarta-700 dark:text-white">
                Sign out
              </span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
