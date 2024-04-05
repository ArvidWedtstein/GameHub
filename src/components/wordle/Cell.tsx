import React, { CSSProperties } from "react";
import "../../styles/index.css";
import { position } from "@chakra-ui/react";
import styled from "@emotion/styled";

interface CellProps {
  cell?: {
    className: string;
    value?: string;
  };
  children?: React.ReactNode;
}

const Cell: React.FC<CellProps> = ({ cell, children }) => {
  const CellElement = styled.div({
    width: "70px",
    height: "70px",
    position: "relative",
    border: "1px solid #333",
    borderRadius: "6px",
  });
  return <CellElement className={`${cell?.className}`}>{children}</CellElement>;
};

export default Cell;
