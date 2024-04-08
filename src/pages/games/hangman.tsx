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

const words = ["hangman", "javascript", "react", "gatsby", "coding"];
const HangmanPage = () => {
  const [word, setWord] = React.useState("");
  const [guessedLetters, setGuessedLetters] = React.useState<string[]>([]);
  const [remainingAttempts, setRemainingAttempts] = React.useState(6);

  const chooseWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };

  const handleGuess = (letter: string) => {
    if (!guessedLetters.includes(letter)) {
      setGuessedLetters([...guessedLetters, letter]);
      if (!word.includes(letter)) {
        setRemainingAttempts(remainingAttempts - 1);
      }
    }
  };

  React.useEffect(() => {
    setWord(chooseWord());
  }, []);

  const maskedWord = word
    .split("")
    .map((letter: string) => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");

  const isGameOver = remainingAttempts === 0 || !maskedWord.includes("_");
  const statusMessage = isGameOver
    ? maskedWord.includes("_")
      ? "Game Over. You Lost!"
      : "Congratulations! You Won!"
    : `Remaining Attempts: ${remainingAttempts}`;

  return (
    <Layout>
      <Container maxW="container.xl">
        <Grid templateAreas={`"main stats"`} gridTemplateColumns={"auto 1fr"}>
          <GridItem area={"main"}>
            {Array.from(Array(26), (_, i) => String.fromCharCode(97 + i)).map(
              (letter) => (
                <button
                  key={letter}
                  onClick={() => handleGuess(letter)}
                  disabled={isGameOver || guessedLetters.includes(letter)}
                >
                  {letter}
                </button>
              )
            )}
          </GridItem>
          <GridItem area={"stats"}></GridItem>
        </Grid>
      </Container>
    </Layout>
  );
};

export default HangmanPage;

export const Head: HeadFC = () => <title>Hangman</title>;
