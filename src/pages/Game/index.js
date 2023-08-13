import React from "react";
import DinoGame from "react-chrome-dino-ts";
import "react-chrome-dino-ts/index.css";

const Game = ({ signer_address }) => {
  return (
    <>
      {" "}
      {signer_address ? (
        <div className="container py-12 mt-24 bg-white">
          <DinoGame />
        </div>
      ) : (
        <div className="flex justify-center text-center text-white py-24 mt-24">
          Please Connect your wallet to play the game!
        </div>
      )}
    </>
  );
};

export default Game;
