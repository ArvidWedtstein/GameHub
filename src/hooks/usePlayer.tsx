import { useState, useCallback } from "react";

import { randomTetromino } from "../components/tetris/Tetrominoes";

export type Player = {
  collided: boolean;
  isFastDropping: boolean;
  position: {
    row: number;
    column: number;
  };
  tetrominoes: {
    shape: number[][],
    className: string
  }[];
  tetromino: {
    shape: number[][],
    className: string
  };
}
const buildPlayer = (previous: Player | null = null) => {
  let tetrominoes: {
    shape: number[][],
    className: string
  }[];

  if (previous) {
    tetrominoes = [...previous.tetrominoes];
    tetrominoes.unshift(randomTetromino());
  } else {
    tetrominoes = Array(5)
      .fill(0)
      .map((_) => randomTetromino());
  }

  return {
    collided: false,
    isFastDropping: false,
    position: { row: 0, column: 4 },
    tetrominoes,
    tetromino: tetrominoes.pop() as {
      shape: number[][],
      className: string
    }
  };
};

export const usePlayer = (): [Player, React.Dispatch<React.SetStateAction<Player>>, () => void] => {
  const [player, setPlayer] = useState<Player>(buildPlayer());

  const resetPlayer = useCallback(() => {
    setPlayer((prev) => buildPlayer(prev));
  }, []);

  return [player, setPlayer, resetPlayer];
};
