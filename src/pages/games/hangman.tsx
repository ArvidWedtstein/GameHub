import { graphql, HeadFC, useStaticQuery } from "gatsby";
import * as React from "react";
import Card from "../../components/cards/Card";
import Layout from "../../components/layout";
import GameStats from "../../components/tetris/GameStats";
import { motion, animate } from "framer-motion";
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
  PinInput,
  HStack,
  Input,
  Kbd,
  InputGroup,
  InputRightElement,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

const words = ["hangman", "javascript", "react", "gatsby", "coding"];
const HangmanPage = () => {
  const [word, setWord] = React.useState("");
  const [guessedLetters, setGuessedLetters] = React.useState<string[]>([]);
  const [remainingAttempts, setRemainingAttempts] = React.useState(9);
  const handleGuess = (letter: string) => {
    if (!guessedLetters.includes(letter)) {
      setGuessedLetters((prev) => [...prev, letter]);
      if (!word.includes(letter)) {
        setRemainingAttempts(remainingAttempts - 1);
      }
    }
  };

  const maskedWord = word
    .split(" ")
    .flatMap((letters: string) =>
      letters
        .split("")
        .map((letter: string) =>
          guessedLetters.includes(letter) ? letter : "_"
        )
        .join(" ")
    )
    .join(" - ");

  const isGameOver = remainingAttempts === 0 || !maskedWord.includes("_");
  const statusMessage = isGameOver
    ? maskedWord.includes("_")
      ? "Game Over. You Lost!"
      : "Congratulations! You Won!"
    : `Remaining Attempts: ${remainingAttempts}`;

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <Layout>
      <Container maxW="container.xl">
        <Grid templateAreas={`"main stats"`} gridTemplateColumns={"auto 1fr"}>
          <GridItem area={"main"}>
            <FormControl>
              <FormLabel>Enter word</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder="Enter word"
                  onBlur={(event) => setWord(event?.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                  <Button
                    colorScheme="green"
                    h="1.75rem"
                    margin={"1rem"}
                    size="sm"
                    onClick={handleClick}
                  >
                    {"Submit"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            {maskedWord}
            <Box>
              {Array.from(Array(26), (_, i) => String.fromCharCode(97 + i)).map(
                (letter) => (
                  <Button
                    colorScheme="gray"
                    variant="solid"
                    key={letter}
                    onClick={() => handleGuess(letter)}
                    isActive={isGameOver || guessedLetters.includes(letter)}
                    disabled={guessedLetters.includes(letter)}
                  >
                    {letter}
                  </Button>
                )
              )}
            </Box>
          </GridItem>
          <GridItem area={"stats"}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
              {/* <!-- Right leg --> */}
              {remainingAttempts < 1 && (
                <motion.line
                  x1="100"
                  y1="120"
                  x2="120"
                  y2="150"
                  stroke="black"
                  stroke-width="2"
                />
              )}
              {/* <!-- Left leg --> */}
              {remainingAttempts < 2 && (
                <motion.line
                  x1="100"
                  y1="120"
                  x2="80"
                  y2="150"
                  stroke="black"
                  stroke-width="2"
                />
              )}
              {/* <!-- Right arm --> */}
              {remainingAttempts < 3 && (
                <motion.line
                  x1="100"
                  y1="80"
                  x2="130"
                  y2="100"
                  stroke="black"
                  stroke-width="2"
                />
              )}
              {/* <!-- Left arm --> */}
              {remainingAttempts < 4 && (
                <motion.line
                  x1="100"
                  y1="80"
                  x2="70"
                  y2="100"
                  stroke="black"
                  stroke-width="2"
                />
              )}
              {/* <!-- Body --> */}
              {remainingAttempts < 5 && (
                <motion.line
                  x1="100"
                  y1="70"
                  x2="100"
                  y2="120"
                  stroke="black"
                  stroke-width="2"
                />
              )}
              {/* <!-- Head --> */}
              {remainingAttempts < 6 && (
                <motion.circle
                  cx="100"
                  cy="50"
                  r="20"
                  stroke="black"
                  stroke-width="2"
                  fill="none"
                />
              )}
              {/* <!-- Vertical beam --> */}
              {remainingAttempts < 7 && (
                <motion.line
                  x1="100"
                  y1="10"
                  x2="100"
                  y2="30"
                  stroke="black"
                  stroke-width="2"
                />
              )}
              {/* <!-- Horizontal beam --> */}
              {remainingAttempts < 8 && (
                <motion.line
                  x1="50"
                  y1="10"
                  x2="100"
                  y2="10"
                  stroke="black"
                  stroke-width="2"
                />
              )}
              {/* <!-- Beam Pole --> */}
              {remainingAttempts < 9 && (
                <motion.line
                  x1="50"
                  y1="10"
                  x2="50"
                  y2="150"
                  stroke="black"
                  stroke-width="2"
                />
              )}
            </svg>
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  );
};

export default HangmanPage;

export const Head: HeadFC = () => <title>Hangman</title>;
