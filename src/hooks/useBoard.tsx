import { useEffect, useState } from "react";
import { movePlayer } from "../components/tetris/PlayerController";
import {
  type Tetromino,
  transferToBoard,
} from "../components/tetris/Tetrominoes";
import { type Player } from "./usePlayer";

export type Board = {
  size: {
    rows: number;
    columns: number;
  };
  rows: {
    value?: string;
    occupied: boolean;
    className: string;
  }[][];
};
export const defaultCell = {
  occupied: false,
  className: "",
};

export const buildBoard = ({
  rows,
  columns,
}: {
  rows: number;
  columns: number;
}) => {
  const builtRows = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => ({ ...defaultCell }))
  );

  return {
    rows: builtRows,
    size: { rows, columns },
  };
};

const findDropPosition = ({
  board,
  position,
  shape,
}: {
  board: Board;
  position: Player["position"];
  shape: Tetromino["shape"];
}) => {
  let max = board.size.rows - position.row + 1;
  let row = 0;

  for (let i = 0; i < max; i++) {
    const delta = { row: i, column: 0 };
    const result = movePlayer({ delta, position, shape, board });
    const { collided } = result;

    if (collided) {
      break;
    }

    row = position.row + i;
  }

  return { ...position, row };
};

export const nextBoard = ({
  board,
  player,
  resetPlayer,
  addLinesCleared,
}: {
  board: Board;
  player: Player;
  resetPlayer: () => void;
  addLinesCleared: (value: number) => void;
}) => {
  const { tetromino, position } = player;

  // Copy and clear spaces used by pieces that
  // hadn't collided and occupied spaces permanently
  let rows: any = board.rows.map((row) =>
    row.map((cell) => (cell.occupied ? cell : { ...defaultCell }))
  );

  // Drop position
  const dropPosition = findDropPosition({
    board,
    position,
    shape: tetromino.shape,
  });

  // Place ghost
  const className = `${tetromino.className} ${
    player.isFastDropping ? "" : "ghost"
  }`;
  rows = transferToBoard({
    className,
    isOccupied: player.isFastDropping,
    position: dropPosition,
    rows,
    shape: tetromino.shape,
  });

  // Place the piece.
  // If it collided, mark the board cells as collided
  if (!player.isFastDropping) {
    rows = transferToBoard({
      className: tetromino.className,
      isOccupied: player.collided,
      position,
      rows,
      shape: tetromino.shape,
    });
  }

  // TODO: fix type
  // Check for cleared lines
  const blankRow = rows[0].map(() => ({ ...defaultCell }));
  let linesCleared = 0;
  rows = rows.reduce((acc: any, row: any[]) => {
    if (row.every((column) => column.occupied)) {
      linesCleared++;
      acc.unshift([...blankRow]);
    } else {
      acc.push(row);
    }

    return acc;
  }, []);

  if (linesCleared > 0) {
    addLinesCleared(linesCleared);
  }

  // If we collided, reset the player!
  if (player.collided || player.isFastDropping) {
    resetPlayer();
  }

  // Return the next board
  return {
    rows,
    size: { ...board.size },
  };
};

export const hasCollision = ({
  board,
  position,
  shape,
}: {
  board: Board;
  position: Player["position"];
  shape: Tetromino["shape"];
}) => {
  for (let y = 0; y < shape.length; y++) {
    const row = y + position.row;

    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const column = x + position.column;

        if (
          board.rows[row] &&
          board.rows[row][column] &&
          board.rows[row][column].occupied
        ) {
          return true;
        }
      }
    }
  }

  return false;
};

export const isWithinBoard = ({
  board,
  position,
  shape,
}: {
  board: Board;
  position: Player["position"];
  shape: Tetromino["shape"];
}) => {
  for (let y = 0; y < shape.length; y++) {
    const row = y + position.row;

    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const column = x + position.column;
        const isValidPosition = board.rows[row] && board.rows[row][column];

        if (!isValidPosition) return false;
      }
    }
  }

  return true;
};

export const useBoard = ({
  rows,
  columns,
  player,
  resetPlayer,
  addLinesCleared,
}: {
  rows: number;
  columns: number;
  player: Player;
  resetPlayer: () => void;
  addLinesCleared: (value: number) => void;
}): [Board, React.Dispatch<React.SetStateAction<Board>>] => {
  const [board, setBoard] = useState<Board>(buildBoard({ rows, columns }));

  useEffect(() => {
    setBoard((previousBoard) =>
      nextBoard({
        board: previousBoard,
        player,
        resetPlayer,
        addLinesCleared,
      })
    );
  }, [player, resetPlayer, addLinesCleared]);

  return [board, setBoard];
};
