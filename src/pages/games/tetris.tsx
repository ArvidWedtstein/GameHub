import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import Layout from "../../components/layout";

import { Box, Button, Container } from "@chakra-ui/react";

import { type Board as BoardType, useBoard } from "../../hooks/useBoard";
import Board from "../../components/tetris/Board";
import { useGameStats } from "../../hooks/useGameStats";
import { usePlayer } from "../../hooks/usePlayer";
import GameStats from "../../components/general/GameStats";
import Previews from "../../components/tetris/Previews";
import GameController from "../../components/tetris/GameController";
import { useGameOver } from "../../hooks/useGameOver";

const TetrisPage: React.FC<PageProps> = () => {
  const [gameOver, setGameOver, resetGameOver] = useGameOver();

  const start = () => resetGameOver();
  const [gameStats, addLinesCleared] = useGameStats();
  const [player, setPlayer, resetPlayer] = usePlayer();
  const [board, setBoard] = useBoard({
    rows: 20,
    columns: 10,
    player,
    resetPlayer,
    addLinesCleared,
  });

  return (
    <Layout>
      <Container>
        <Box position={"relative"} width={"21vw"} height={"40vw"}>
          {gameOver ? (
            <Container
              position="absolute"
              centerContent
              inset={0}
              background={gameOver ? "rgba(0,0,0,0.5)" : "transparent"}
            >
              <Box style={{ margin: "auto 0", textAlign: "center" }}>
                <Button
                  onClick={start}
                  variant="solid"
                  size="lg"
                  colorScheme="teal"
                >
                  Start
                </Button>
              </Box>
            </Container>
          ) : null}
          <Board board={board} />
          <GameController
            board={board}
            gameStats={gameStats}
            player={player}
            setGameOver={setGameOver}
            setPlayer={setPlayer}
          />
        </Box>
        <GameStats
          gameStats={[
            { name: "Level", amount: gameStats.level },
            {
              name: "Lines to level",
              amount: gameStats.linesPerLevel - gameStats.linesCompleted,
            },
            { name: "Points", amount: gameStats.points },
          ]}
        />
        <Previews tetrominoes={player.tetrominoes} />
      </Container>
    </Layout>
  );
};

export default TetrisPage;

export const Head: HeadFC = () => <title>Tetris</title>;
