import { Polybase } from "@polybase/client";

const db = new Polybase({
  defaultNamespace: "rarx",
});

const Schema = await db.applySchema(`
@public
collection NFT {
    id: string;
    collectionId: string;
    tokenId: string;
    chainId: string;
    tokenURI: string;
    name: string;
    image: string;
    description: string;
    isListed: boolean;
    listingPrice: string;
    isStaked: boolean;
    chain_block: string;
    chain_image: string;
    chain_symbol: string;
    ipfsURL: string;
    nftCollection: Collection;
    properties: string;
    ownerWallet: string;
    owner: User;
    seller: User;
    marketAddress: User;

    constructor(
        id: string,
        collectionId: string,
        tokenId: string,
        chainId: string,
        tokenURI: string,
        user: User,
        nftCollection: Collection,
        properties: string,
        name: string,
        image: string,
        description: string,
        isListed: boolean,
        ownerWallet: string,
        chain_block: string,
        chain_image: string,
        chain_symbol: string,
        ipfsURL: string,
        listingPrice: string
    ) {
        this.id = id;
        this.collectionId = collectionId;
        this.tokenId = tokenId;
        this.chainId = chainId;
        this.tokenURI = tokenURI;
        this.name = name;
        this.image = image;
        this.description = description;
        this.nftCollection = nftCollection;
        this.properties = properties;
        this.ownerWallet = ownerWallet;
        this.owner = user;
        this.isListed = isListed;
        this.chain_block = chain_block;
        this.chain_image = chain_image;
        this.chain_symbol = chain_symbol;
        this.ipfsURL = ipfsURL;
        this.listingPrice = listingPrice;
        this.marketAddress = {collectionId: "", id: ""};
        this.seller = {collectionId: "", id: ""};
        this.isStaked = false;
    }

  cancel_listing(){
    
    this.isListed = false;
    this.listingPrice = "0";
}

  listNFT(price: string, chainId: string) {

    this.isListed = true;
    this.listingPrice = price;
    // this.marketAddress = marketAddress;
    this.seller = this.owner;
  }

  executeSale(address: User) {
    this.seller = address;
    this.owner = address;
    this.isListed = false;
    this.listingPrice = "0";
    this.ownerWallet = address.id;
  }
  
  updateStake(stake: boolean) {

    this.isStaked = stake;
    
  }
  
}

@public
collection Collection {
    id: string;
    collectionId: string;
    name: string;
    logo: string;
    coverImage: string;
    symbol: string;
    description: string;
    owner: User;
    ownerWallet: string;
    chain_image: string;
    isCollectionVerified: boolean;

    constructor(
        id: string,
        collectionId: string,
        name: string,
        logo: string,
        coverImage: string,
        symbol: string,
        description: string,
        owner: User,
        ownerWallet: string,
        chain_image: string,
        isCollectionVerified: boolean
    ) {
        this.id = id;
        this.collectionId = collectionId;
        this.name = name;
        this.logo = logo;
        this.coverImage = coverImage;
        this.symbol = symbol;
        this.description = description;
        this.owner = owner;
        this.ownerWallet = ownerWallet;
        this.chain_image = chain_image;
        this.isCollectionVerified = isCollectionVerified;
    }
}

@public
collection User {
    id: string;
    username: string;
    profileImage: string;
    coverImage: string;
    bio: string;
    email: string;
    wallet: string;
    socials: string;
    isArtist: boolean;
    transactions: string;

    constructor(
        id: string,
        username: string,
        profileImage: string,
        coverImage: string,
        bio: string,
        email: string,
        wallet: string,
        isArtist: boolean,
        transactions: string
    ) {
        this.id = id;
        this.username = username;
        this.profileImage = profileImage;
        this.coverImage = coverImage;
        this.bio = bio;
        this.email = email;
        this.wallet = wallet;
        this.socials = "";
        this.isArtist = isArtist;
        this.transactions = "";
    }

    setSocials(socials: string) {
       
        this.socials = socials;
    }

    updateData(username: string, email: string, bio: string, profileImage: string, coverImage: string, socials: string, isArtist: boolean) {
        this.username = username;
        this.email = email;
        this.bio = bio;
        this.profileImage = profileImage;
        this.coverImage = coverImage;
        this.socials = socials;
        this.isArtist = isArtist;
    }
}`);
