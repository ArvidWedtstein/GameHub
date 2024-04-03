import React from "react";

import Preview from "./Preview";
import { type Tetromino } from "./Tetrominoes";

const Previews = ({ tetrominoes }: {
  tetrominoes: Tetromino[]
}) => {
  // We want everything except the last one
  const previewTetrominoes = tetrominoes
    .slice(1 - tetrominoes.length)
    .reverse();

  return (
    <>
      {previewTetrominoes.map((tetromino, index) => (
        <Preview tetromino={tetromino} index={index} key={index} />
      ))}
    </>
  );
};

export default React.memo(Previews);
