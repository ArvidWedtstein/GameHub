import { animate } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import BoardCell from "../tetris/BoardCell";
import { type Board as BoardType } from "../../hooks/useBoard";
import { Box, BoxProps, ChakraComponent } from "@chakra-ui/react";

interface BoardProps extends BoxProps {
  board: BoardType;
  CellComponent?: React.FC<any>;
}

const Board: React.FC<BoardProps> = ({
  board,
  CellComponent = BoardCell,
  bg = "purple.900",
  borderColor = "purple.900",
  ...BoardProps
}) => {
  const boardStyles = {
    // margin: "2em auto",
    display: "grid",
    gridGap: "2px",
    height: "100%",
    border: "10px solid",
    borderRadius: "10px",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    gridTemplateRows: `repeat(${board.size.rows}, 1fr)`,
    gridTemplateColumns: `repeat(${board.size.columns}, 1fr)`,
  };

  return (
    <Box
      className="Board"
      style={boardStyles}
      {...BoardProps}
      bg={bg}
      borderColor={borderColor}
    >
      {board.rows.map((row, y) =>
        row.map((cell, x) => (
          <CellComponent
            key={x * board.size.columns + x}
            cell={cell}
            x={x}
            y={y}
          />
        ))
      )}
    </Box>
  );
};

export default Board;
