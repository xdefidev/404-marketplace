import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NftCard = ({
  ImageSrc,
  Name,
  Description,
  Address,
  tokenId,
  onClickOpen = true,
  listedBool = false,
  chain_symbol,
  chain_image,
  chainImgPre = "",
  listingPrice,
}) => {
  return (
    <div className="relative block rounded-2.5xl border border-jacarta-100 bg-white px-[1.1875rem] pb-[1.1875rem] transition-shadow hover:shadow-lg dark:border-jacarta-700 dark:bg-[#212529]">
      <div className="bg-[#E2E2E2] mb-[1.1875rem] relative top-0 flex px-4 mx-6 justify-center text-center overflow-hidden rounded-b-lg">
        <i>
          <small className="font-semibold font-vt323">Simple</small>
        </i>
      </div>

      <div className="relative overflow-hidden rounded-[0.625rem] pt-4 flex w-full">
        {onClickOpen == true ? (
          <Link href={`/nft/${Address}/${tokenId}`}>
            <Image
              src={ImageSrc}
              height={100}
              width={100}
              alt="item 5"
              className="block aspect-square hover:scale-110 ease-in duration-400  w-full rounded-[0.625rem]"
              loading="lazy"
            />
          </Link>
        ) : (
          <Link href="#">
            <Image
              src={ImageSrc}
              height={100}
              width={100}
              alt="item 5"
              className="h-[220px] w-full rounded-[0.625rem]"
              loading="lazy"
            />
          </Link>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div
          style={{
            width: "150px",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {onClickOpen == true ? (
            <Link href={`/nft/${Address}/${tokenId}`}>
              <span className="font-vt323 text-lg text-jacarta-700 hover:text-accent dark:text-white">
                {Name}#{tokenId}
              </span>
            </Link>
          ) : (
            <Link href="#">
              <span className="font-vt323 text-lg text-jacarta-700 hover:text-accent dark:text-white">
                {Name}#{tokenId}
              </span>
            </Link>
          )}
        </div>
        {/* {listedBool && (
          <span className="flex items-center whitespace-nowrap rounded-md border border-jacarta-100 py-1 px-2 dark:border-jacarta-600">
            <span className=" text-sm font-medium tracking-tight text-green">
              {listingPrice} {chain_symbol}
            </span>
          </span>
        )} */}
      </div>
      {/* <div
        className="mt-1 text-sm text-ellipsis overflow-hidden"
        style={{
          width: "220px",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
      >
        <span className="font-bold mr-1 text-jacarta-700 dark:text-jacarta-200 ">
          {Description}
          
        </span>
      </div> */}
      <div className="py-2 flex justify-between">
        {/* <Image
          src={`${chainImgPre}${
            chain_image == "" ? "chains/polygon.png" : chain_image
          }`}
          height={100}
          width={100}
          alt="item 5"
          className="absolute h-6 w-6 right-3 bottom-3"
          loading="lazy"
        /> */}

        {listedBool && (
          <span className="flex items-center whitespace-nowrap rounded-md py-1 px-2 dark:border-jacarta-600">
            <span className=" text-sm font-medium tracking-tight text-green">
              {listingPrice} {chain_symbol}
            </span>
          </span>
        )}

        {listedBool && (
          <button className="rounded bg-white text-black text-sm font-vt323  h-7 w-2/5 right-3 bottom-3">
            BUY
          </button>
        )}
      </div>
    </div>
  );
};

export default NftCard;
