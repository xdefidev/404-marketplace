require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    mumbai: {
      chainId: 80001,
      accounts: [process.env.NEXT_PUBLIC_ACCOUNT_PRIVATE_KEY],
      url: "https://matic-mumbai.chainstacklabs.com",
    },
    zkEVM: {
      chainId: 1442,
      accounts: [process.env.NEXT_PUBLIC_ACCOUNT_PRIVATE_KEY],
      url: "https://rpc.public.zkevm-test.net",
    },
    filecoin: {
      chainId: 3141,
      url: "https://api.hyperspace.node.glif.io/rpc/v1",
      accounts: [process.env.NEXT_PUBLIC_ACCOUNT_PRIVATE_KEY],
    },
    mantle: {
      url: "https://rpc.testnet.mantle.xyz",
      chainId: 5001,
      accounts: [process.env.NEXT_PUBLIC_ACCOUNT_PRIVATE_KEY],
    },
    scroll: {
      url: "https://alpha-rpc.scroll.io/l2",
      chainId: 534353,
      accounts: [process.env.NEXT_PUBLIC_ACCOUNT_PRIVATE_KEY],
    },
    taiko: {
      url: "https://rpc.a2.taiko.xyz",
      chainId: 167004,
      accounts: [process.env.NEXT_PUBLIC_ACCOUNT_PRIVATE_KEY],
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      chainId: 10200,
      accounts: [process.env.NEXT_PUBLIC_ACCOUNT_PRIVATE_KEY],
    },
    goerli: {
      url:
        "https://fragrant-side-liquid.ethereum-goerli.discover.quiknode.pro/85d60c255fb0a4d86910952d1838a5a227c9a690/",
      chainId: 5,
      accounts: [process.env.NEXT_PUBLIC_ACCOUNT_PRIVATE_KEY],
    },
  },
};
