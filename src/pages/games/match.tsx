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
  List,
  ListItem,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

const MatchCardsPage = () => {
  const data = [
    {
      id: 1,
      name: "Tetris",
      description: "",
      stage: "beta",
    },
    {
      id: 2,
      name: "2048",
      description: "",
      stage: "released",
    },
    {
      id: 3,
      name: "Snake",
      description: "",
      stage: "beta",
    },
    {
      id: 4,
      name: "Chess",
      description: "",
      stage: "beta",
    },
    {
      id: 5,
      name: "Pacman",
      description: "",
      stage: "comming soon",
    },
    {
      id: 6,
      name: "Match",
      description: "Match Card.",
      stage: "beta",
    },
  ];

  type CardWithoutEvent = { id: number; value: string; isFlipped: boolean };
  const [cards, setCards] = React.useState<CardWithoutEvent[]>([]);
  const [flippedCards, setFlippedCards] = React.useState<CardWithoutEvent[]>(
    []
  );
  const [cardImages, setCardImages] = React.useState<
    { name: string; publicURL: string }[]
  >([]);
  const [solvedCards, setSolvedCards] = React.useState<number[]>([]);

  const [moves, setMoves] = React.useState(0);
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [gameCompleted, setGameCompleted] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [elapsedTime, setElapsedTime] = React.useState(0);

  React.useEffect(() => {
    const newCards = generateCards();
    setCards(newCards);
  }, []);

  React.useEffect(() => {
    if (!gameCompleted && startTime) {
      const intervalId = setInterval(() => {
        if (!gameCompleted) {
          const currentTime = Date.now();
          const elapsed = Math.floor((currentTime - startTime) / 1000); // Calculate elapsed time in seconds
          setElapsedTime(elapsed);
        }
      }, 1000);

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }
  }, [startTime, gameCompleted]);

  const generateCards = () => {
    const values = [
      "Hearts-2",
      "Hearts-3",
      "Hearts-4",
      "Hearts-5",
      "Hearts-6",
      "Hearts-7",
      "Hearts-8",
      "Hearts-9",
      "Hearts-10",
      "Hearts-J",
      "Hearts-Q",
      "Hearts-K",
      "Hearts-A",
      "Diamonds-2",
      "Diamonds-3",
      "Diamonds-4",
      "Diamonds-5",
      "Diamonds-6",
      "Diamonds-7",
      "Diamonds-8",
      "Diamonds-9",
      "Diamonds-10",
      "Diamonds-J",
      "Diamonds-Q",
      "Diamonds-K",
      "Diamonds-A",
      "Clubs-2",
      "Clubs-3",
      "Clubs-4",
      "Clubs-5",
      "Clubs-6",
      "Clubs-7",
      "Clubs-8",
      "Clubs-9",
      "Clubs-10",
      "Clubs-J",
      "Clubs-Q",
      "Clubs-K",
      "Clubs-A",
      "Spades-2",
      "Spades-3",
      "Spades-4",
      "Spades-5",
      "Spades-6",
      "Spades-7",
      "Spades-8",
      "Spades-9",
      "Spades-10",
      "Spades-J",
      "Spades-Q",
      "Spades-K",
      "Spades-A",
    ];
    const cardsArray = [];

    for (let i = 0; i < 8; i++) {
      const card1 = { id: i * 2, value: values[i], isFlipped: false };
      const card2 = { id: i * 2 + 1, value: values[i], isFlipped: false };
      cardsArray.push(card1, card2);
    }

    // Shuffle cards
    for (let i = cardsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp: CardWithoutEvent = cardsArray[i];
      cardsArray[i] = cardsArray[j];
      cardsArray[j] = temp;
    }

    // setCardImages(
    //   data.allFile.edges.map((d: { node: Record<string, any> }) => d.node)
    // );

    return cardsArray;
  };

  const handleCardClick = (id: CardWithoutEvent["id"]) => {
    const flippedCard = cards.find((card) => card.id === id);

    // Ignore clicks on already solved or flipped cards
    if (!flippedCard || flippedCard.isFlipped || solvedCards.includes(id)) {
      return;
    }

    if (!startTime) {
      setStartTime(Date.now());
    }

    // Increase moves count
    setMoves(moves + 1);

    const newCards = cards.map((card) =>
      card.id === id ? { ...card, isFlipped: true } : card
    );

    const flipped = [...flippedCards, flippedCard];

    setCards(newCards);

    if (flipped.every((p) => p !== null && p !== undefined)) {
      setFlippedCards(flipped);
    }

    // If two cards are flipped, check for a match
    if (flipped.length === 2) {
      const [firstCard, secondCard] = flipped;
      if (firstCard.value === secondCard.value) {
        setSolvedCards([...solvedCards, firstCard.id, secondCard.id]);
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
        }, 1000); // Reset unmatched cards after a delay
      }
      setFlippedCards([]);
    }
    calculateScore();

    if (solvedCards.length === cards.length - 2) {
      setGameCompleted(true);
    }
  };

  const calculateScore = () => {
    if (!startTime) return;
    const endTime = Date.now();
    const totalTimeInSeconds = (endTime - startTime) / 1000;
    const movesMultiplier = 100;

    // Calculate the score
    const timeScore = Math.max(1000 - totalTimeInSeconds, 0);
    const movesScore = Math.max(200 - moves * movesMultiplier, 0);
    const totalScore = Math.round((timeScore + movesScore) / 2);

    setScore(totalScore);
  };

  const resetGame = () => {
    setStartTime(null);
    setFlippedCards([]);
    setSolvedCards([]);
    setGameCompleted(false);
    setScore(0);
    setElapsedTime(0);
    setMoves(0);

    const newCards = generateCards();
    setCards(newCards);
  };

  return (
    <Layout>
      <Container>
        <Box position={"relative"}>
          <div className="game-container">
            <div className="cards-container">
              {cards.map((card) => (
                <Card
                  key={card.id}
                  id={card.id}
                  value={card.value}
                  isFlipped={card.isFlipped || solvedCards.includes(card.id)}
                  image={
                    cardImages.find(
                      (img) =>
                        img.name.toLowerCase() === card.value.toLowerCase()
                    )?.publicURL
                  }
                  handleClick={handleCardClick}
                />
              ))}
            </div>
          </div>
        </Box>

        <GameStats
          gameStats={[
            { name: "Moves", amount: moves },
            { name: "Time used", amount: elapsedTime, unit: "s" },
            { name: "Score", amount: score },
          ]}
        >
          <ListItem>
            <Button variant="outline" colorScheme="blue" onClick={resetGame}>
              Reset
            </Button>
          </ListItem>
        </GameStats>
      </Container>
    </Layout>
  );
};

export default MatchCardsPage;

export const Head: HeadFC = () => <title>Match Cards</title>;
