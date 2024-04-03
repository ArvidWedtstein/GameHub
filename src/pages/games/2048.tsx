import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { graphql } from 'gatsby'
import { useState } from "react"


import {
  Grid,
  Container,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Card,
  CardBody,
  Text,
  CardHeader,
  Stack,
  Button,
} from '@chakra-ui/react'
import Layout from "../../components/layout"
import { keyframes } from "@emotion/react"
import styled from "@emotion/styled"
import Counter from "../../components/Counter"

const getCellColor = (value: number) => {
  switch (value) {
    case 2: return '#eee4da';
    case 4: return '#ede0c8';
    case 8: return '#f2b179';
    case 16: return '#f59563';
    case 32: return '#f67c5f';
    case 64: return '#f65e3b';
    case 128: return '#edcf72';
    case 256: return '#edcc61';
    case 512: return '#edc850';
    case 1024: return '#edc53f';
    case 2048: return '#edc22e';
    default: return '#ccc0b3';
  }
}

const animation = keyframes`
  from {
    transform: rotate3d(1, .5, .5, 180deg) scale(0.1);
    transition: all ease-in .4s;
  }
  to {
    opacity: 1;
    transform: none;
  }
`;

const moveTile = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`

const Tile = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  background-color: ${(props: { value: number }) => getCellColor(props.value)};
`;

// type Cell = {
//   value: number;
//   moving: boolean;
// }
type Cell = number

const getRandomAvailableCell = (board: Cell[][]) => {
  const availableCells = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) {
        availableCells.push({ x: i, y: j });
      }
    }
  }
  if (availableCells.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * availableCells.length);
  return availableCells[randomIndex];
};

const addRandomTile = (board: Cell[][]) => {
  const newBoard = [...board];
  const cell = getRandomAvailableCell(newBoard);
  if (cell) {
    newBoard[cell.x][cell.y] = Math.random() < 0.9 ? 2 : 4;
  }
  return newBoard;
};

const TwoThousandAndFourtyEightPage: React.FC<PageProps> = () => {
  const gridSize = 4;

  const [score, setScore] = useState<number>(0);
  const [lastScore, setLastScore] = useState({
    lastScore: 0,
    currentMoveScore: 0,
  });

  const [board, setBoard] = useState<Cell[][]>(() => {
    const initialBoard = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    return addRandomTile(addRandomTile(initialBoard));
  });

  const [gameState, setGameState] = useState<'idle' | 'won' | 'lost'>('idle');


  const checkWin = (board: Cell[][]) => {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (board[i][j] === (gridSize * 512)) {
          return true;
        }
      }
    }
    return false;
  };

  const isGameOver = (board: Cell[][]) => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) {
          return false; // There is an empty cell
        }
        if (
          (i < board.length - 1 && board[i][j] === board[i + 1][j]) ||
          (j < board[i].length - 1 && board[i][j] === board[i][j + 1])
        ) {
          return false; // There are adjacent cells with the same value
        }
      }
    }
    return true; // No valid moves available
  };

  type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

  const moveTiles = (direction: Direction) => {
    const newBoard = [...board];
    let moved = false;
    let moveScore = 0;

    switch (direction) {
      case "up":
        for (let j = 0; j < gridSize; j++) {
          for (let i = 1; i < gridSize; i++) {
            if (newBoard[i][j] !== 0) {
              let k = i;
              while (k > 0 && newBoard[k - 1][j] === 0) {
                newBoard[k - 1][j] = newBoard[k][j];
                newBoard[k][j] = 0;
                k--;
                moved = true;
              }
              if (k > 0 && newBoard[k - 1][j] === newBoard[k][j]) {
                newBoard[k - 1][j] *= 2;
                moveScore += newBoard[k - 1][j];
                newBoard[k][j] = 0;
                moved = true;
              }
            }
          }
        }
        break;
      case "down":
        for (let j = 0; j < gridSize; j++) {
          for (let i = gridSize - 2; i >= 0; i--) {
            if (newBoard[i][j] !== 0) {
              let k = i;
              while (k < gridSize - 1 && newBoard[k + 1][j] === 0) {
                newBoard[k + 1][j] = newBoard[k][j];
                newBoard[k][j] = 0;
                k++;
                moved = true;
              }
              if (k < gridSize - 1 && newBoard[k + 1][j] === newBoard[k][j]) {
                newBoard[k + 1][j] *= 2;
                moveScore += newBoard[k + 1][j];
                newBoard[k][j] = 0;
                moved = true;
              }
            }
          }
        }
        break;
      case "left":
        for (let i = 0; i < gridSize; i++) {
          for (let j = 1; j < gridSize; j++) {
            if (newBoard[i][j] !== 0) {
              let k = j;
              while (k > 0 && newBoard[i][k - 1] === 0) {
                newBoard[i][k - 1] = newBoard[i][k];
                newBoard[i][k] = 0;
                k--;
                moved = true;
              }
              if (k > 0 && newBoard[i][k - 1] === newBoard[i][k]) {
                newBoard[i][k - 1] *= 2;
                moveScore += newBoard[i][k - 1];
                newBoard[i][k] = 0;
                moved = true;
              }
            }
          }
        }
        break;
      case "right":
        for (let i = 0; i < gridSize; i++) {
          for (let j = gridSize - 2; j >= 0; j--) {
            if (newBoard[i][j] !== 0) {
              let k = j;
              while (k < gridSize - 1 && newBoard[i][k + 1] === 0) {
                newBoard[i][k + 1] = newBoard[i][k];
                newBoard[i][k] = 0;
                k++;
                moved = true;
              }
              if (k < gridSize - 1 && newBoard[i][k + 1] === newBoard[i][k]) {
                newBoard[i][k + 1] *= 2;
                moveScore += newBoard[i][k + 1];
                newBoard[i][k] = 0;
                moved = true;
              }
            }
          }
        }
        break;
      default:
        break;
    }

    if (moved) {
      setBoard(addRandomTile(newBoard));

      setLastScore((prev) => ({
        lastScore: prev.currentMoveScore,
        currentMoveScore: moveScore
      }));
      setScore((prevScore) => {
        return prevScore + moveScore;
      });

      if (checkWin(newBoard)) {
        setGameState('won');
      }

      if (isGameOver(newBoard)) {
        setGameState('lost');
        alert('Game Over!');
      }
    }
  };

  React.useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      let direction: Direction = 'none'
      if (gameState !== 'won' && gameState !== 'lost') {
        switch (event.key) {
          case 'w':
          case 'ArrowUp':
            direction = 'up';
            break;
          case 's':
          case 'ArrowDown':
            direction = 'down';
            break;
          case 'a':
          case 'ArrowLeft':
            direction = 'left';
            break;
          case 'd':
          case 'ArrowRight':
            direction = 'right';
            break;
        }
      }

      moveTiles(direction);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [])


  return (
    <Layout>
      <Container centerContent>
        <Card>
          <CardHeader>
            <Stack direction='row' spacing={4} align='center'>
              <Stat>
                <StatLabel>Score</StatLabel>
                <StatNumber>{score}</StatNumber>
                <StatHelpText style={{ display: 'inline-flex' }}>
                  <StatArrow type={lastScore.currentMoveScore > lastScore.lastScore ? 'increase' : 'decrease'} />
                  <Counter from={lastScore.lastScore} to={lastScore.currentMoveScore} />%
                </StatHelpText>
              </Stat>

              <Button colorScheme='teal' variant='outline'>
                Reset
              </Button>
            </Stack>
          </CardHeader>
          <CardBody>
            <Grid id="game-grid" templateColumns="repeat(4, 100px)" gap={2}>
              {board.map((row, rowIndex) => (
                row.map((cell, colIndex) => (
                  <Tile key={`${rowIndex}-${colIndex}`} value={cell} style={{ animation: cell !== 0 && cell ? `${animation} 1s ease forwards` : '' }}>
                    {cell !== 0 && cell}
                  </Tile>
                ))
              ))}
            </Grid>
          </CardBody>
        </Card>
      </Container>
    </Layout>
  )
}

export const query = graphql`
  query TwoThousandAndFourtyEightQuery {
    allFile {
      nodes {
        id
        relativePath
        ext
        prettySize
        birthTime
      }
    }
  }
`

export default TwoThousandAndFourtyEightPage