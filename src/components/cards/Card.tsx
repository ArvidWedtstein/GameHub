import { graphql, useStaticQuery } from "gatsby";
import React from "react";

export type Card = {
  id: number;
  value: string;
  isFlipped: boolean;
  image?: string;
  handleClick: (id: number) => void;
};

const Card = ({ id, value, isFlipped, image, handleClick }: Card) => {
  return (
    <div
      className={`match-card ${isFlipped ? "flipped" : ""}`}
      onClick={() => handleClick(id)}
    >
      <div className={`match-card-inner`}>
        <div className="match-card-front"></div>
        <div
          className="match-card-back"
          data-letter={value.split("-")[1]}
          style={{ backgroundImage: `url(${image})` }}
        >
          {/* {isFlipped ? value : ""} */}
        </div>
      </div>
    </div>
  );
};

export default Card;
