import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import testNFT from "../../../public/test.jpg";
import Image from "next/image";
import axios from "axios";
import NftCard from "@/components/cards/NftCard";
import CollectionCard from "@/components/cards/CollectionCard";
import Loader from "@/components/Loader";
import { Chat } from "@pushprotocol/uiweb";
import { Framework } from "@superfluid-finance/sdk-core";
import { Wallet, providers, ethers } from "ethers";
import * as PushAPI from "@pushprotocol/restapi";
import Head from "next/head";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { checkAddressChecksum, toChecksumAddress } from "web3-utils";

const Profile = ({
  get_my_collections,
  signer,
  signer_address,
  fetch_nfts_from_user_wallet,
  RARX_CHANNEL_ADDRESS,
  setChainIdMain,
  chainIdMain,
  getUserData,
  blockURL,
  fetch_collections_polybase,
  connectToWallet,
  polybase,
  symbol,
}) => {
  // superfluid config start
  const tokens = [
    {
      name: "fDAIx",
      symbol: "fDAIx",
      address: "0xf2d68898557ccb2cf4c10c3ef2b034b2a69dad00",
      icon:
        "https://raw.githubusercontent.com/superfluid-finance/assets/master/public//tokens/dai/icon.svg",
    },
  ];
  const [FDAIXBALANCE, setFDAIXBALANCE] = useState("0.00");

  const [user_data, set_user_data] = useState({});
  const [social_data, set_social] = useState([]);

  const [walletNFTs, setWalletNft] = useState([]);

  const [provider, setProvider] = useState(null);
  const [userStreamData, SetUserStreamData] = useState([]);

  const [streamInput, setStreamInput] = useState({
    token: tokens[0].address,
    flowRate: 1,
  });

  const connectSF = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    setProvider(provider);
  };

  const calculateFlowRate = (amount) => {
    if (amount) {
      return (ethers.utils.formatEther(amount) * 60 * 60 * 24 * 30).toFixed(2);
    }
    return 0;
  };

  const calculateFlowRateInWeiPerSecond = (amount) => {
    const flowRateInWeiPerSecond = ethers.utils
      .parseEther(amount.toString())
      .div(2592000)
      .toString();
    return flowRateInWeiPerSecond;
  };

  const switchGoerliChain = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }],
      });
      setChainIdMain("5");
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
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  const handleCreateStream = async ({
    token,
    sender = signer_address,
    receiver = slug,
    flowRate,
  }) => {
    if (chainIdMain != 5) {
      alert("Please switch to goerli chain to join memberships");
      await switchGoerliChain();
    }
    try {
      set_loading(true);
      const { chainId } = await provider.getNetwork();
      const sf = await Framework.create({
        chainId,
        provider,
      });
      const superToken = await sf.loadSuperToken(token);
      const flowRateInWeiPerSecond = calculateFlowRateInWeiPerSecond(flowRate);

      let flowOp = superToken.createFlow({
        sender,
        receiver,
        flowRate: flowRateInWeiPerSecond,
      });
      await flowOp.exec(provider.getSigner());
      sendMemberCreatedNoti({
        to: sender,
        title: `You are now a member of ${receiver} artist`,
        body: `Congratulations for becoming a member of ${receiver}, now you can access all the membership perks of the artist`,
      });
      sendMemberCreatedNoti({
        to: receiver,
        title: `You have recieved a subscription from ${sender}`,
        body: `Congratulations for getting your first subscription from ${sender}, make sure you deliver your perks..`,
      });
      setTimeout(() => {
        alert("Membership Subscription Successful");
        set_loading(false);
      }, 15000);
    } catch (err) {
      set_loading(false);
      alert(
        "Failed to join membership! User rejected transaction or low ETH balance"
      );
    }
  };

  const handleDeleteStream = async () => {
    try {
      set_loading(true);
      const { chainId } = await provider.getNetwork();
      const sf = await Framework.create({
        chainId,
        provider,
      });
      const superToken = await sf.loadSuperToken("fDAIx");
      let flowOp = superToken.deleteFlow({
        sender: signer_address,
        receiver: slug,
      });
      await flowOp.exec(provider.getSigner());
      sendMemberCancelNoti({ to: receiver });
      setTimeout(() => {
        alert("Membership cancelled succesfully");
        set_loading(false);
      }, 15000);
    } catch (err) {
      set_loading(false);
      console.log({ DeleteStreamError: err });
      alert(
        "Failed to cancel membership! User rejected transaction or low ETH balance"
      );
    }
  };

  const fetchStreams = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    setProvider(provider);
    const { chainId } = await provider.getNetwork();
    if (chainId == 5) {
      const sf = await Framework.create({
        chainId,
        provider,
      });
      const daix = await sf.loadSuperToken("fDAIx");

      const res = await daix.getFlow({
        sender: signer_address,
        receiver: slug,
        providerOrSigner: provider,
      });
      SetUserStreamData(res);
    }
  };
  // superfluid config end

  // sending membership stream created push notification
  const sendMemberCreatedNoti = async ({ to, title, body }) => {
    try {
      console.log(NftName, NftPrice);
      toast.success("You are now an artist", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (e) {
      console.log(e);
    }
    // const signer = new ethers.Wallet(
    //   `${process.env.NEXT_PUBLIC_OWNER_PRIVATE_KEY}`
    // );
    // try {
    //   const apiResponse = await PushAPI.payloads.sendNotification({
    //     signer,
    //     type: 3,
    //     identityType: 2,
    //     notification: {
    //       title: `${title}`,
    //       body: `${body}`,
    //     },
    //     payload: {
    //       title: `${title}`,
    //       body: `${body}`,
    //     },
    //     recipients: `eip155:80001:${to}`,
    //     channel: `eip155:80001:${RARX_CHANNEL_ADDRESS}`,
    //     env: "staging",
    //   });
    // } catch (err) {
    //   console.error("Error: ", err);
    // }
  };

  // sending membership cancelation push notification
  const sendMemberCancelNoti = async ({ to }) => {
    try {
      console.log(NftName, NftPrice);
      toast.success("You have cancelled your artist membership", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (e) {
      console.log(e);
    }
    // const signer = new ethers.Wallet(
    //   `${process.env.NEXT_PUBLIC_OWNER_PRIVATE_KEY}`
    // );
    // try {
    //   const apiResponse = await PushAPI.payloads.sendNotification({
    //     signer,
    //     type: 3,
    //     identityType: 2,
    //     notification: {
    //       title: `You have cancelled your membership of artist ${to}`,
    //       body: `As you have cancelled the membership, you are no longer eligible for the membership perks`,
    //     },
    //     payload: {
    //       title: `You have cancelled your membership of artist ${to}`,
    //       body: `As you have cancelled the membership, you are no longer eligible for the membership perks`,
    //       cta: ``,
    //     },
    //     recipients: `eip155:80001:${signer_address}`,
    //     channel: `eip155:80001:${RARX_CHANNEL_ADDRESS}`,
    //     env: "staging",
    //   });
    // } catch (err) {
    //   console.error("Error: ", err);
    // }
  };

  // using moralis for balances
  const initiateMoralis = async () => {
    try {
      await Moralis.start({
        apiKey: process.env.NEXT_PUBLIC_MORALIS_API,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getBalanceMoralis = async () => {
    try {
      const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        chain: chainIdMain,
        tokenAddresses: ["0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00"],
        address: signer_address,
      });
      setFDAIXBALANCE(ethers.utils.formatEther(response.raw[0].balance));
    } catch (error) {
      console.log(error);
    }
  };

  const runApp = async () => {
    try {
      set_loading(true);
      // const chainID = EvmChain.ETHEREUM;
      const response = await Moralis.EvmApi.nft.getWalletNFTs({
        chain: chainIdMain,
        address: signer_address,
      });
      setWalletNft(
        response?.jsonResponse?.result && response.jsonResponse.result
      );
      set_loading(false);
      // console.log(response?.jsonResponse?.result, "response.nft");
    } catch (error) {
      console.log(error);
    }
  };

  const [loading, set_loading] = useState(false);
  const [membershipVisible, setMembershipVisible] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const [myNFTsActive, setMyNFTSActive] = useState(true);
  const [statusArray, setStatusArray] = useState(
    (typeof window !== "undefined" && localStorage.getItem("statusArr")) || []
  );
  const [myWalletActive, setMyWalletActive] = useState(false);
  const [my_collections, set_my_collections] = useState([]);
  const [nfts, set_nfts] = useState([]);

  const theme = {
    btnColorPrimary: "#7348F2",
    bgColorSecondary: "#7348F2",
    moduleColor: "#f0f0f0",
  };

  const myCollections = async () => {
    if (!signer) return;
    const my_collections = await get_my_collections(signer);
  };

  const get_nfts = async () => {
    set_loading(true);
    const nfts = await fetch_nfts_from_user_wallet(signer_address);
    // console.log("editpage", nfts);
    set_nfts(nfts);
    set_loading(false);
    // console.log(signer_address, "signer_address");
    // console.log(nfts, "user_nfts");
  };

  const get_user_info = async () => {
    const data = await getUserData(slug);
    set_user_data(data);

    set_social(data?.socials && JSON.parse(data?.socials));
    // console.log({ userDataa: data });
  };

  const fetch_collections = async () => {
    const res = await fetch_collections_polybase(signer_address);
    // console.log(res, "collection_p");
    set_my_collections(res);
  };

  async function checkWalletNft(collectionId, nftId) {
    try {
      // console.log(typeof collectionId);
      // set_loading(true);
      const db = await polybase();

      let nftStatus,
        collectionStatus = false;

      const checkCollection = await db
        .collection("Collection")
        .where("id", "==", collectionId)
        .get();

      const checkNft = await db
        .collection("NFT")
        .where("id", "==", nftId)
        .get();

      if (checkNft.data.length === 0) {
        nftStatus = true;
      }

      if (checkCollection.data.length === 0) {
        collectionStatus = true;
      }

      return { nftStatus, collectionStatus };
    } catch (error) {
      console.log(error);
    }
  }

  async function getStatus() {
    set_loading(true);
    // const newResults = [];
    for (const e of walletNFTs) {
      const p = JSON.parse(e?.metadata);
      const address = toChecksumAddress(e.token_address);

      const nftStatus = await checkWalletNft(
        address,
        address + "/" + e.token_id
      );

      if (nftStatus.collectionStatus) {
        await listCollection(
          toChecksumAddress(e?.token_address),
          p?.name,
          p?.image,
          p?.image,
          e?.symbol,
          p?.description,
          toChecksumAddress(e?.owner_of)
        );
      }

      if (nftStatus.nftStatus) {
        await listNft(
          e?.token_id,
          e?.token_uri,
          toChecksumAddress(e?.token_address),
          p?.properties || p?.attributes,
          p?.name,
          p?.image,
          p?.description
        );
      }

      // newResults.push(nftStatus);
    }
    // setStatusArray(newResults);
    set_loading(false);
  }

  async function listCollection(
    collection_address,
    name,
    logo,
    image,
    symbol,
    description,
    owner
  ) {
    let chain_Image;
    let chain_symbol;
    let chain_block;

    if (symbol == "ETH") {
      chain_Image = "chains/goerli.png";
      chain_symbol = "ETH";
      chain_block = "https://etherscan.io/";
    }
    if (symbol == "BNB") {
      chain_Image = "chains/bsc.png";
      chain_symbol = "BNB";
      chain_block = "https://bscscan.com/";
    } else {
      chain_Image = "chains/polygon.png";
      chain_symbol = "MATIC";
      chain_block = "https://mumbai.polygonscan.com/";
    }

    const db = await polybase();

    const checkUser = await db
      .collection("User")
      .where("id", "==", owner)
      .get();
    if (checkUser.data.length === 0) {
      const res = await db
        .collection("User")
        .create([owner, "", "", "", "", "", owner, false, ""]);
    }

    const res = await db
      .collection("Collection")
      .create([
        collection_address,
        await db.collection("User").record(owner)?.collection.id,
        symbol,
        logo,
        image,
        symbol,
        description,
        db.collection("User").record(owner),
        owner,
        chain_Image,
        false,
      ]);

    // router.reload();
  }

  async function listNft(
    id,
    token_uri,
    collection_address,
    properties,
    name,
    image,
    description
  ) {
    let chain_Image;
    let chain_symbol;
    let chain_block;

    if (symbol == "ETH") {
      chain_Image = "chains/goerli.png";
      chain_symbol = "ETH";
      chain_block = "https://etherscan.io/";
    }
    if (symbol == "BNB") {
      chain_Image = "chains/bsc.png";
      chain_symbol = "BNB";
      chain_block = "https://bscscan.com/";
    } else {
      chain_Image = "chains/polygon.png";
      chain_symbol = "MATIC";
      chain_block = "https://mumbai.polygonscan.com/";
    }

    const db = await polybase();
    const res = await db
      .collection("NFT")
      .create([
        `${collection_address}/${id}`,
        collection_address,
        id,
        chainIdMain?.toString(),
        token_uri,
        db.collection("User").record(signer_address),
        db.collection("Collection").record(collection_address),
        JSON.stringify(properties),
        name,
        image,
        description,
        false,
        signer_address,
        chain_block,
        chain_Image,
        chain_symbol,
        token_uri,
        "0",
      ]);
    // router.reload();
  }

  useEffect(() => {
    const fetchData = async () => {
      await connectToWallet();

      myCollections();
      get_nfts();
      await initiateMoralis();
      runApp();
    };
    fetchData();
    get_user_info();

    if (!signer_address) return;
    fetch_collections();
    connectSF();
    fetchStreams();
  }, [slug, signer_address, chainIdMain]);

  useEffect(() => {
    if (walletNFTs) {
      getStatus();
    }
  }, [walletNFTs]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Head>
        <title>Profile - 404 Marketplace</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      {/* <!-- Banner IMG--> */}
      <div className="relative mt-24">
        <Image
          src={
            user_data?.coverImage?.replace(
              /^(ipfs:\/\/|https:\/\/ipfs\.moralis\.io:2053\/ipfs\/)/,
              "https://gateway.ipfscdn.io/ipfs/"
            ) || testNFT
          }
          alt="banner"
          height={100}
          width={100}
          className="h-[18.75rem] w-[100%] object-cover"
        />
      </div>

      {/* <!-- Profile Section --> */}
      <section className="relative bg-light-base pb-6 pt-28 dark:bg-jacarta-800">
        <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <figure className="relative">
            <Image
              src={
                user_data?.profileImage?.replace(
                  /^(ipfs:\/\/|https:\/\/ipfs\.moralis\.io:2053\/ipfs\/)/,
                  "https://gateway.ipfscdn.io/ipfs/"
                ) || testNFT
              }
              alt="collection avatar"
              height={100}
              width={100}
              className="rounded-xl border-[5px] border-white dark:border-jacarta-600 h-[130px] w-[auto]"
            />
          </figure>
        </div>

        <div className="container">
          {/* follow  */}
          {/* <div className="mt-[-27px] mb-6 flex items-center justify-center space-x-2.5">
            <div className="rounded-xl border border-jacarta-100 bg-white hover:bg-jacarta-100 dark:border-jacarta-600 dark:bg-jacarta-700 dark:hover:bg-jacarta-600">
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
            </div>
          </div> */}

          <div className="text-center">
            <div className="mt-[-30px] mb-8 inline-flex items-center justify-center rounded-full border border-jacarta-100 bg-white py-1.5 px-4 dark:border-jacarta-600 dark:bg-jacarta-700">
              <a
                href={`${blockURL}` + `address/` + `${slug}`}
                target="_blank"
                className="js-copy-clipboard max-w-[10rem] select-none overflow-hidden text-ellipsis whitespace-nowrap dark:text-jacarta-200"
              >
                <span>{slug}</span>
              </a>
            </div>
            <h2 className=" mb-2 font-display text-4xl font-medium text-jacarta-700 dark:text-white">
              {user_data?.username}
            </h2>

            {signer_address && (
              <div className="flex justify-center align-middle mb-6 mt-4">
                <a
                  href={social_data?.length ? social_data[0] : "#"}
                  target="_blank"
                  className="group mr-4"
                >
                  <svg
                    className="h-5 w-5 fill-jacarta-300 group-hover:fill-accent dark:group-hover:fill-white"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
                  </svg>
                </a>
                <a
                  href={social_data?.length ? social_data[1] : "#"}
                  target="_blank"
                  className="group"
                >
                  <svg
                    className="h-5 w-5 fill-jacarta-300 group-hover:fill-accent dark:group-hover:fill-white"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
                  </svg>
                </a>
              </div>
            )}

            <p className="mx-auto max-w-xl text-lg dark:text-jacarta-300 mb-10">
              {user_data?.bio}
            </p>

            {slug == signer_address && (
              <div className="flex justify-center align-middle mb-10">
                <Link
                  href="EditProfile"
                  className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                >
                  Edit Profile
                </Link>
              </div>
            )}

            {user_data?.isArtist && (
              <div>
                {!membershipVisible && (
                  <div className="flex justify-center align-middle mb-10">
                    {signer_address != slug && (
                      <>
                        {calculateFlowRate(userStreamData?.flowRate) > 0 && (
                          <button
                            type="button"
                            onClick={() => (
                              getBalanceMoralis(), setMembershipVisible(true)
                            )}
                            className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                          >
                            View Membership
                          </button>
                        )}
                        {calculateFlowRate(userStreamData?.flowRate) <= 0 && (
                          <button
                            type="button"
                            onClick={() => (
                              getBalanceMoralis(), setMembershipVisible(true)
                            )}
                            className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                          >
                            Become Member
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
                {membershipVisible && (
                  <div>
                    <div className="modal-dialog max-w-2xl">
                      <div className="modal-content">
                        <div className="modal-header">
                          {calculateFlowRate(userStreamData?.flowRate) > 0 && (
                            <h5 className="modal-title" id="placeBidLabel">
                              Your Membership Info
                            </h5>
                          )}
                          {calculateFlowRate(userStreamData?.flowRate) <= 0 && (
                            <h5 className="modal-title" id="placeBidLabel">
                              Become A Member
                            </h5>
                          )}
                          <button
                            type="button"
                            onClick={() => setMembershipVisible(false)}
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
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
                        {calculateFlowRate(userStreamData?.flowRate) > 0 && (
                          <div className="modal-body p-6">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="font-display text-sm font-semibold text-jacarta-700 dark:text-white">
                                On Going Membership Streams{" "}
                              </span>
                              <div className="flex items-center justify-center space-x-2 mr-6">
                                <div className="w-3 h-3 rounded-full animate-pulse dark:bg-violet-400"></div>
                                <div className="w-3 h-3 rounded-full animate-pulse dark:bg-violet-400"></div>
                                <div className="w-3 h-3 rounded-full animate-pulse dark:bg-violet-400"></div>
                              </div>
                            </div>

                            <div className="relative mb-2 flex items-center overflow-hidden rounded-lg border border-jacarta-100 dark:border-jacarta-600">
                              <div className="flex flex-1 items-center self-stretch border-r border-jacarta-100 bg-jacarta-50 px-2">
                                <span className="font-display text-sm text-jacarta-700">
                                  fDAIx{" "}
                                </span>
                              </div>

                              <input
                                type="text"
                                className="h-12 w-full flex-[3] border-0 bg-jacarta-50"
                                placeholder="Amount"
                                value={calculateFlowRate(
                                  userStreamData.flowRate
                                )}
                                readOnly
                              />

                              <div className="flex flex-1 justify-center self-stretch border-l border-jacarta-100 bg-jacarta-50">
                                <span className="self-center px-2 text-sm">
                                  / Month
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center space-x-2 flex-col">
                              <label
                                htmlFor="terms"
                                className="text-sm dark:text-jacarta-200"
                              >
                                You are eligible to avail all the perks from the
                                artist
                              </label>
                              <div className="mt-4 ">
                                <label
                                  htmlFor="terms"
                                  className="text-sm dark:text-jacarta-200"
                                >
                                  If you cancel your membership you will no
                                  longer be eligible for the membership perks{" "}
                                </label>
                              </div>
                            </div>
                          </div>
                        )}

                        {calculateFlowRate(userStreamData?.flowRate) <= 0 && (
                          <div className="modal-body p-6">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="font-display text-sm font-semibold text-jacarta-700 dark:text-white">
                                Price
                              </span>
                            </div>

                            <div className="relative mb-2 flex items-center overflow-hidden rounded-lg border border-jacarta-100 dark:border-jacarta-600">
                              <div className="flex flex-1 items-center self-stretch border-r border-jacarta-100 bg-jacarta-50 px-2">
                                <span className="font-display text-sm text-jacarta-700">
                                  fDAIx
                                </span>
                              </div>

                              <input
                                type="text"
                                className="h-12 w-full flex-[3] border-0 bg-jacarta-50"
                                placeholder="Amount"
                                value={
                                  user_data?.membershipFees
                                    ? user_data?.membershipFees
                                    : "0.00"
                                }
                                readOnly
                              />

                              <div className="flex flex-1 justify-center self-stretch border-l border-jacarta-100 bg-jacarta-50">
                                <span className="self-center px-2 text-sm">
                                  / Month
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-sm dark:text-jacarta-400">
                                Balance: {parseFloat(FDAIXBALANCE).toFixed(2)}{" "}
                                fDAIx
                              </span>
                            </div>

                            <div className="mt-4 flex items-center space-x-2 flex-col">
                              <label className="text-display font-semibold dark:text-jacarta-200 mt-2 mb-2">
                                PERKS OFFERED BY ARTIST
                              </label>
                              <label className="text-sm dark:text-jacarta-200">
                                {user_data?.perks
                                  ? user_data?.perks
                                  : "No Perks"}
                              </label>

                              <label className="text-display font-semibold dark:text-jacarta-200 mt-4 mb-2">
                                IMPORTANT INFO
                              </label>
                              <label className="text-sm dark:text-jacarta-200">
                                After joining membership,{" "}
                                {user_data?.membershipFees
                                  ? user_data?.membershipFees
                                  : "0.00"}{" "}
                                fDAIx tokens will be streamed from your account
                                to the respective artists account and you will
                                be eligible to avail all the membership perks
                                from the artist
                              </label>
                              <div className="mt-4 ">
                                <input
                                  type="checkbox"
                                  id="terms"
                                  defaultChecked
                                  className="h-5 w-5 self-start rounded border-jacarta-200 text-accent checked:bg-accent focus:ring-accent/20 focus:ring-offset-0 dark:border-jacarta-500 dark:bg-jacarta-600"
                                />
                                {"  "}
                                <label
                                  htmlFor="terms"
                                  className="text-sm dark:text-jacarta-200"
                                >
                                  I Accept And Understand The Terms{" "}
                                </label>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* action area of membership  */}
                        <div className="modal-footer">
                          {calculateFlowRate(userStreamData?.flowRate) > 0 && (
                            <div className="flex items-center justify-center space-x-4">
                              <button
                                type="button"
                                onClick={() => handleDeleteStream()}
                                className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                              >
                                Cancel Memebership
                              </button>
                            </div>
                          )}
                          {calculateFlowRate(userStreamData?.flowRate) <= 0 && (
                            <div className="flex items-center justify-center space-x-4">
                              <button
                                type="button"
                                onClick={() => handleCreateStream(streamInput)}
                                className="rounded-full bg-accent py-3 px-8 text-center font-semibold text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                              >
                                Join Membership
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* switch buttons  */}
      <div className="container mt-6">
        <ul
          className="nav nav-tabs scrollbar-custom mb-12 flex items-center justify-start overflow-x-auto overflow-y-hidden border-jacarta-100 pb-px dark:border-jacarta-600 md:justify-center"
          role="tablist"
        >
          {/* my nfts button  */}
          <li
            className="nav-item"
            role="presentation"
            onClick={() => {
              setMyWalletActive(true);
              setMyNFTSActive(false);
            }}
          >
            <button
              className={`nav-link ${myWalletActive &&
                "active relative"} flex items-center whitespace-nowrap py-3 px-6 text-jacarta-400 hover:text-jacarta-700 dark:hover:text-white`}
              id="wallet-tab"
              data-bs-toggle="tab"
              data-bs-target="#wallet"
              type="button"
              role="tab"
              aria-controls="wallet"
              aria-selected="false"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="mr-1 h-5 w-5 fill-current"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M5 5v3h14V5H5zM4 3h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 9h6a1 1 0 0 1 1 1v3h1v6h-4v-6h1v-2H5a1 1 0 0 1-1-1v-2h2v1zm11.732 1.732l1.768-1.768 1.768 1.768a2.5 2.5 0 1 1-3.536 0z" />
              </svg>
              <span className="font-display text-base font-medium">
                In Wallet ({walletNFTs?.length ? walletNFTs?.length : "0"})
              </span>
            </button>
          </li>

          <li
            className="nav-item"
            role="presentation"
            onClick={() => {
              setMyNFTSActive(true);
              setMyWalletActive(false);
            }}
          >
            <button
              className={`nav-link ${myNFTsActive &&
                "active relative"} flex items-center whitespace-nowrap py-3 px-6 text-jacarta-400 hover:text-jacarta-700 dark:hover:text-white`}
              id="created-tab"
              data-bs-toggle="tab"
              data-bs-target="#created"
              type="button"
              role="tab"
              aria-controls="created"
              aria-selected="false"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="mr-1 h-5 w-5 fill-current"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M5 5v3h14V5H5zM4 3h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 9h6a1 1 0 0 1 1 1v3h1v6h-4v-6h1v-2H5a1 1 0 0 1-1-1v-2h2v1zm11.732 1.732l1.768-1.768 1.768 1.768a2.5 2.5 0 1 1-3.536 0z" />
              </svg>
              <span className="font-display text-base font-medium">
                My NFTs ({nfts?.length ? nfts?.length : "0"})
              </span>
            </button>
          </li>

          {/* my collections button  */}
          <li
            className="nav-item"
            role="presentation"
            onClick={() => {
              setMyNFTSActive(false);
              setMyWalletActive(false);
            }}
          >
            <button
              className={`nav-link ${!myNFTsActive &&
                !myWalletActive &&
                "active relative"} flex items-center whitespace-nowrap py-3 px-6 text-jacarta-400 hover:text-jacarta-700 dark:hover:text-white`}
              id="collections-tab"
              data-bs-toggle="tab"
              data-bs-target="#collections"
              type="button"
              role="tab"
              aria-controls="collections"
              aria-selected="false"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="mr-1 h-5 w-5 fill-current"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M10.9 2.1l9.899 1.415 1.414 9.9-9.192 9.192a1 1 0 0 1-1.414 0l-9.9-9.9a1 1 0 0 1 0-1.414L10.9 2.1zm.707 2.122L3.828 12l8.486 8.485 7.778-7.778-1.06-7.425-7.425-1.06zm2.12 6.364a2 2 0 1 1 2.83-2.829 2 2 0 0 1-2.83 2.829z" />
              </svg>
              <span className="font-display text-base font-medium">
                My Collections (
                {my_collections?.length ? my_collections?.length : "0"})
              </span>
            </button>
          </li>
        </ul>
      </div>

      {myWalletActive == true && (
        <section className="relative py-24 pt-20">
          <div className="container">
            <div className="tab-content">
              <div
                className="tab-pane fade show active"
                id="on-sale"
                role="tabpanel"
                aria-labelledby="on-sale-tab"
              >
                <div className="grid grid-cols-1 gap-[2rem] md:grid-cols-3 lg:grid-cols-4">
                  {walletNFTs?.map((e, index) => {
                    const p = JSON.parse(e?.metadata);

                    // console.log(statusArray);

                    return (
                      <div className="block">
                        <NftCard
                          key={index}
                          ImageSrc={
                            p?.image
                              ? p?.image?.replace(
                                  /^(ipfs:\/\/|https:\/\/ipfs\.moralis\.io:2053\/ipfs\/)/,
                                  "https://gateway.ipfscdn.io/ipfs/"
                                )
                              : "/test.jpg"
                          }
                          Name={p?.name}
                          Description={p?.description}
                          Address={toChecksumAddress(e.token_address)}
                          tokenId={e.token_id}
                          chainImgPre={"../"}
                          listedBool={false}
                          chain_image={
                            chainIdMain == 1
                              ? "chains/goerli.png"
                              : chainIdMain == "56"
                              ? "chains/bsc.png"
                              : "chains/polygon.png"
                          }
                          chain_symbol={e.symbol}
                        />
                        {/* <div className="flex justify-between pt-1 px-2">
                          {statusArray[index]?.collectionStatus && (
                            <button
                              onClick={() =>
                                listCollection(
                                  toChecksumAddress(e?.token_address),
                                  p?.name,
                                  p?.image,
                                  p?.image,
                                  e?.symbol,
                                  p?.description,
                                  toChecksumAddress(e?.owner_of)
                                )
                              }
                              className="inline-block rounded-full bg-accent py-3 px-4 text-center text-xs text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                            >
                              Load Collection
                            </button>
                          )}

                          {statusArray[index]?.nftStatus && (
                            <button
                              onClick={() =>
                                listNft(
                                  e?.token_id,
                                  e?.token_uri,
                                  toChecksumAddress(e?.token_address),
                                  p?.properties || p?.attributes,
                                  p?.name,
                                  p?.image,
                                  p?.description
                                )
                              }
                              className="inline-block rounded-full bg-accent py-3 px-4 text-center text-xs text-white shadow-accent-volume transition-all hover:bg-accent-dark"
                            >
                              Load NFT
                            </button>
                          )}
                        </div> */}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center">
                  {nfts?.length <= 0 && (
                    <h2 className="text-xl font-display font-thin">
                      No NFTs to show!
                    </h2>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {myNFTsActive == true && (
        <section className="relative py-24 pt-20">
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
                        chainImgPre={"../"}
                        listedBool={e.isListed}
                        chain_image={e.chain_image}
                        chain_symbol={e.chain_symbol}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-center">
                  {nfts?.length <= 0 && (
                    <h2 className="text-xl font-display font-thin">
                      No NFTs to show!
                    </h2>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      {!myNFTsActive && !myWalletActive && (
        //fetch collections here
        <section className="relative py-24 pt-20">
          <div className="container">
            <div className="tab-content">
              <div
                className="tab-pane fade show active"
                id="on-sale"
                role="tabpanel"
                aria-labelledby="on-sale-tab"
              >
                <div className="grid grid-cols-1 gap-[1.875rem] md:grid-cols-3 lg:grid-cols-4">
                  {my_collections?.map((e, index) => (
                    <CollectionCard
                      key={index}
                      Cover={e.coverImage}
                      Logo={e.logo}
                      Name={e.name}
                      Description={e.description}
                      OwnerAddress={e.owner}
                      CollectionAddress={e.collection_address}
                      chain_image={e.chain_image}
                      isCollectionVerified={e.isCollectionVerified}
                      chainImgPre={"../"}
                    />
                  ))}
                </div>
                <div className="flex justify-center">
                  {my_collections?.length <= 0 && (
                    <h2 className="text-xl font-display font-thin">
                      No Collections to show!
                    </h2>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* chat area  */}
      {/* {signer_address !== slug && (
        <div>
          {signer_address && (
            <Chat
              account={signer_address}
              supportAddress={slug}
              apiKey={process.env.NEXT_PUBLIC_PUSH_API_KEY}
              env="staging"
              greetingMsg={`Hey, I am available to chat`}
              // modalTitle={`chat with ${slug}`}
              theme={theme}
            />
          )}
        </div>
      )} */}
      <ToastContainer />
    </>
  );
};

export default Profile;
