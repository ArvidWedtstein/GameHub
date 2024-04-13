import { useState, useCallback } from "react";

export const useGameOver = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
  () => void
] => {
  const [gameOver, setGameOver] = useState<boolean>(true);

  const resetGameOver = useCallback(() => {
    setGameOver(false);
  }, []);

  return [gameOver, setGameOver, resetGameOver];
};
