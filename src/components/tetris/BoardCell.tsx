import React, { CSSProperties } from "react";
import "../../styles/index.css";

interface BoardProps {
  cell: {
    className: string;
    occupied: boolean;
  };
  x: number;
  y: number;
}

const BoardCell: React.FC<BoardProps> = ({ cell }) => {
  return (
    <div className={`BoardCell ${cell.className}`}>
      <div className="Sparkle"></div>
    </div>
  );
};
// https://youtu.be/yCEIgEOZ36g?t=2750

export default BoardCell;
