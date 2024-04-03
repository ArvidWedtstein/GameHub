import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { graphql } from "gatsby";
import Layout from "../../components/layout";

import { Box, Button, Container } from "@chakra-ui/react";
import { useBoard } from "../../hooks/useBoard";
import { usePlayer } from "../../hooks/usePlayer";
import { useGameStats } from "../../hooks/useGameStats";
import Board from "../../components/tetris/Board";

const SnakePage: React.FC<PageProps> = () => {
  const ROWS = 20;
  const COLS = 20;
  const CELL_SIZE = 20;

  const [gameStats, addLinesCleared] = useGameStats();
  const [player, setPlayer, resetPlayer] = usePlayer();
  const [board, setBoard] = useBoard({
    rows: ROWS,
    columns: COLS,
    player,
    resetPlayer,
    addLinesCleared,
  });

  const Direction = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
  };

  const getRandomFoodPosition = () => {
    return {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  };

  const [snake, setSnake] = React.useState([{ x: 10, y: 10 }]);
  const [food, setFood] = React.useState(getRandomFoodPosition());
  const [direction, setDirection] = React.useState(Direction.RIGHT);
  const [gameOver, setGameOver] = React.useState({
    gameover: true,
    reason: "",
  });

  const restartGame = () => {
    setGameOver({ gameover: false, reason: "" });
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomFoodPosition());
    setDirection(Direction.RIGHT);
  };

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          if (direction !== Direction.UP) setDirection(Direction.UP);
          break;
        case "ArrowDown":
          if (direction !== Direction.DOWN) setDirection(Direction.DOWN);
          break;
        case "ArrowLeft":
          if (direction !== Direction.LEFT) setDirection(Direction.LEFT);
          break;
        case "ArrowRight":
          if (direction !== Direction.RIGHT) setDirection(Direction.RIGHT);
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [direction]);

  React.useEffect(() => {
    if (!gameOver.gameover) {
      const gameInterval = setInterval(moveSnake, 200);
      return () => clearInterval(gameInterval);
    }
  }, [gameOver, direction, snake]);

  const moveSnake = async () => {
    if (gameOver.gameover) return;
    const newSnake = await [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case Direction.UP:
        head.y -= 1;
        break;
      case Direction.DOWN:
        head.y += 1;
        break;
      case Direction.LEFT:
        head.x -= 1;
        break;
      case Direction.RIGHT:
        head.x += 1;
        break;
      default:
        break;
    }

    if (isSnakeOutOfBounds(head) || isSnakeCollidingWithItself(head)) {
      setGameOver({
        gameover: true,
        reason: isSnakeOutOfBounds(head)
          ? "Out of bounds"
          : isSnakeCollidingWithItself(head)
          ? "Self collision"
          : "",
      });
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(getRandomFoodPosition());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const isSnakeOutOfBounds = (head: { x: number; y: number }) => {
    return head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS;
  };

  const isSnakeCollidingWithItself = (head: { x: number; y: number }) => {
    return snake
      .slice(1)
      .some((segment) => segment.x === head.x && segment.y === head.y);
  };

  const cell = {
    width: "20px",
    height: "20px",
    border: "1px solid #ccc",
  };

  const snakeClass = {
    backgroundColor: "green",
  };

  const foodClass = {
    backgroundColor: "red",
  };

  const renderCell = (x: number, y: number) => {
    const isSnakeCell = snake.some(
      (segment) => segment.x === x && segment.y === y
    );
    const isFoodCell = food.x === x && food.y === y;

    return (
      <div
        key={`${x}-${y}`}
        style={{
          ...cell,
          ...(isSnakeCell ? snakeClass : null),
          ...(isFoodCell ? foodClass : null),
        }}
      ></div>
    );
  };

  const gameboard = {
    display: "inline-block",
    border: "2px solid #333",
    backgroundColor: "#f0f0f0",
  };

  const row = {
    display: "flex",
  };

  return (
    <Layout>
      <Container>
        <Box position={"relative"} style={gameboard}>
          {gameOver.gameover ? (
            <Container
              position="absolute"
              centerContent
              inset={0}
              background={"rgba(0,0,0,0.5)"}
            >
              <Box style={{ margin: "auto 0", textAlign: "center" }}>
                <Button
                  onClick={restartGame}
                  variant="solid"
                  size="lg"
                  colorScheme="teal"
                >
                  Start
                </Button>
                {gameOver.reason}
              </Box>
            </Container>
          ) : null}

          {/* <Board board={board} /> */}
          {board.rows.map((rows, y) => (
            <div key={y} style={row}>
              {rows.map((_, x) => renderCell(x, y))}
            </div>
          ))}

          {/* <GameController
            board={board as BoardType}
            gameStats={gameStats}
            player={player}
            setGameOver={setGameOver}
            setPlayer={setPlayer}
          /> */}
        </Box>
      </Container>
    </Layout>
  );
};

export default SnakePage;

export const Head: HeadFC = () => <title>Snake</title>;
