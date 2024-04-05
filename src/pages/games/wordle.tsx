import { graphql, HeadFC, useStaticQuery } from "gatsby";
import * as React from "react";
import Card from "../../components/cards/Card";
import Layout from "../../components/layout";
import GameStats from "../../components/tetris/GameStats";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  GridItem,
  List,
  ListItem,
  Stat,
  StatLabel,
  StatNumber,
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  PinInputField,
  PinInput,
  HStack,
  Input,
} from "@chakra-ui/react";
import { Board as BoardType, buildBoard } from "../../hooks/useBoard";
import Board from "../../components/tetris/Board";
import Cell from "../../components/wordle/Cell";

const WordlePage = () => {
  const [board, setBoard] = React.useState<BoardType>(
    buildBoard({ rows: 5, columns: 5 })
  );

  const [currentLine, setCurrentLine] = React.useState(0);
  const [guess, setGuess] = React.useState("");
  const [targetWord, setTargetWord] = React.useState("HELLO");

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      // Fix tomorrow
      board.rows[currentLine][0].value = guess.split("")[0];
      board.rows[currentLine][1].value = guess.split("")[1];
      board.rows[currentLine][2].value = guess.split("")[2];
      board.rows[currentLine][3].value = guess.split("")[3];
      board.rows[currentLine][4].value = guess.split("")[4];
      setCurrentLine((prev) => (prev === 4 ? 0 : prev + 1));
      setGuess("");
    } else if (e.key === "Backspace") {
      setGuess((prev) => prev.substring(0, prev.length - 1));
    } else if (e.keyCode >= 65 && e.keyCode <= 90) {
      setGuess((prev) => `${prev}${e.key}`.slice(0, 5));
    }
  };

  function findNextTabStop(el: HTMLElement) {
    var universe = document.querySelectorAll(
      "input, button, select, textarea, a[href]"
    );
    var list = Array.prototype.filter.call(universe, function (item) {
      return item.tabIndex >= "0";
    });
    var index = list.indexOf(el);
    return list[index + 1] || list[0];
  }

  const WordleCell = (cell: {
    x: number;
    y: number;
    cell: { className: string };
  }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      board.rows[cell.y][cell.x].className = "tetromino__s";
      const nextEl = findNextTabStop(e.target);
      nextEl.focus();

      board.rows[cell.y][cell.x].value = guess[cell.x];
    };

    return (
      <Cell cell={cell.cell}>
        <Input
          textTransform={"uppercase"}
          disabled={cell.y !== currentLine}
          height="100%"
          fontSize={"3rem"}
          maxLength={1}
          border={"none"}
          width="100%"
          onChange={handleChange}
          value={
            currentLine === cell.y
              ? guess[cell.x]
              : board.rows[cell.y][cell.x].value
          }
        />
      </Cell>
    );
  };

  return (
    <Layout>
      <Container maxW="container.xl">
        <Grid templateAreas={`"main stats"`} gridTemplateColumns={"auto 1fr"}>
          <GridItem area={"main"}>
            <Board
              board={board}
              CellComponent={WordleCell}
              bg="transparent"
              border="transparent"
            />
          </GridItem>
          <GridItem area={"stats"}>
            <List padding={"2rem"} listStyleType={"none"} spacing={3}>
              <ListItem>
                <Stat>
                  <StatLabel>{guess}</StatLabel>
                  <StatNumber>0</StatNumber>
                </Stat>
              </ListItem>
            </List>
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  );
};

export default WordlePage;

export const Head: HeadFC = () => <title>Wordle</title>;
