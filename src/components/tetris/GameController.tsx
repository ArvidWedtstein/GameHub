import { Board } from "../../hooks/useBoard";
import React, { useEffect, useRef, useState } from "react";
import { Action, actionForKey, actionIsDrop } from "./Input";
import { playerController } from "./PlayerController";
import { useDropTime } from "../../hooks/useDropTime";
import { useInterval } from "../../hooks/useInterval";
import { motion } from "framer-motion";
import { Box, Container, Kbd } from "@chakra-ui/react";
import { type Player } from "../../hooks/usePlayer";
import { type GameStats } from "../../hooks/useGameStats";

const GameController = ({
  board,
  gameStats,
  player,
  setGameOver,
  setPlayer,
}: {
  board: Board;
  gameStats: GameStats;
  player: Player;
  setGameOver: (gameover: boolean) => void;
  setPlayer: (player: Player) => void;
}) => {
  const [dropTime, pauseDropTime, resumeDropTime] = useDropTime({
    gameStats,
  });

  useInterval(() => {
    handleInput({ action: Action.SlowDrop });
  }, dropTime as number);

  const onKeyUp = ({ code }: { code: string }) => {
    const action = actionForKey(
      code as
        | "ArrowUp"
        | "ArrowDown"
        | "ArrowLeft"
        | "ArrowRight"
        | "KeyQ"
        | "KeyP"
        | "Space"
    );
    if (actionIsDrop(action)) resumeDropTime();
  };

  const onKeyDown = ({ code }: { code: string }) => {
    const action = actionForKey(
      code as
        | "ArrowUp"
        | "ArrowDown"
        | "ArrowLeft"
        | "ArrowRight"
        | "KeyQ"
        | "KeyP"
        | "Space"
    );

    if (action === Action.Pause) {
      console.info(action);
      if (dropTime) {
        pauseDropTime();
      } else {
        resumeDropTime();
      }
    } else if (action === Action.Quit) {
      setGameOver(true);
    } else {
      console.info(action);
      if (actionIsDrop(action)) pauseDropTime();
      if (!dropTime) {
        return;
      }
      handleInput({ action });
    }
  };

  const handleInput = ({ action }: { action: string }) => {
    playerController({
      action,
      board,
      player,
      setPlayer,
      setGameOver,
    });
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      console.log("remove");
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return (
    <Container
      position="absolute"
      centerContent
      inset={0}
      background={!dropTime ? "rgba(0,0,0,0.5)" : "transparent"}
    >
      {!dropTime && (
        <Box style={{ margin: "auto 0", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ ease: "easeOut", duration: 2, repeat: Infinity }}
          >
            PAUSE
          </motion.div>

          <span>
            Press <Kbd>P</Kbd> to continue
          </span>
        </Box>
      )}
    </Container>
  );
};

export default GameController;
