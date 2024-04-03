// .board .row .tile {
// 	background-color: currentcolor;
// 	border: none;
// 	box-shadow: inset 0 0 0 var(--border-width) var(--color-shadow-lighter);
// 	display: flex;
// 	flex-direction: column;
// 	height: var(--diameter-tile);
// 	justify-content: space-between;
// 	padding: 0;
// 	position: relative;
// 	transition: background-color 350ms var(--transition-ease);
// 	width: 680px;
// }

import React, { CSSProperties } from "react";
import "../../styles/index.css";
import { position } from "@chakra-ui/react";
import styled from "@emotion/styled";

interface CellProps {
  cell: {
    className: string;
    occupied: boolean;
  };
  x: number;
  y: number;
}

const ChessCell: React.FC<CellProps> = ({ cell, x, y }) => {
  const ChessCellElement = styled.div({
    width: "68px",
    height: "68px",
    position: "relative",
    background:
      (x % 2 == 0 && y % 2 === 1) || (y % 2 == 0 && x % 2 === 1)
        ? "#C59E77"
        : "#FEEBC8",
  });
  return <ChessCellElement className={`${cell.className}`}></ChessCellElement>;
};

export default ChessCell;
