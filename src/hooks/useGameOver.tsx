import { useState, useCallback } from "react";

export const useGameOver = (): [
  Boolean,
  React.Dispatch<React.SetStateAction<Boolean>>,
  () => void
] => {
  const [gameOver, setGameOver] = useState<Boolean>(true);

  const resetGameOver = useCallback(() => {
    setGameOver(false);
  }, []);

  return [gameOver, setGameOver, resetGameOver];
};
