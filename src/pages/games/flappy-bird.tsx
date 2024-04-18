import { graphql, HeadFC, useStaticQuery } from "gatsby";
import * as React from "react";
import Card from "../../components/cards/Card";
import Layout from "../../components/layout";
import GameStats from "../../components/general/GameStats";
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
import { useGameOver } from "../../hooks/useGameOver";
import PauseMenu from "../../components/general/PauseMenu";

// TODO: finish
const FlappyBirdPage = () => {
  const [gameOver, setGameOver, resetGameOver] = useGameOver();
  const [paused, setPaused] = React.useState(false);
  const [flaps, setFlaps] = React.useState<number>(0);
  const [frame, setFrame] = React.useState<number>(0);
  const canvas = React.useRef<HTMLCanvasElement>(null);
  const ctx = canvas.current?.getContext("2d");

  // Bird object
  const bird = {
    x: 50,
    y: (canvas.current?.height || 0) / 2,
    velocityY: 0,
    width: 20,
    height: 20,
    gravity: 0.6,
    jump: -10,

    flap() {
      this.velocityY = this.jump;
    },

    update() {
      this.velocityY += this.gravity;
      this.y += this.velocityY;
    },

    draw() {
      if (!ctx) return;
      ctx.fillStyle = "red";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    },
  };

  // Obstacles (pipes)
  const [settings, setSettings] = React.useState({
    gap: 100,
    pipeWidth: 30,
    pipeSpeed: 1,
    pipeInterval: 100,
    groundHeight: 50,
  });
  const obstacles: any = [];

  function generatePipes() {
    if (!canvas.current) return;

    const topPipeHeight =
      Math.random() * (canvas.current.height - settings.gap - 100) + 20;
    const bottomPipeHeight =
      canvas.current.height - topPipeHeight - settings.gap;
    obstacles.push({ x: canvas.current.width, y: 0, height: topPipeHeight });
    obstacles.push({
      x: canvas.current.width,
      y: canvas.current.height - bottomPipeHeight,
      height: bottomPipeHeight,
    });
  }

  // Handle user input
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      bird.flap();
      // setFlaps((prev) => prev++);
    }
  });

  // Collision detection
  function checkCollision() {
    if (!canvas.current || gameOver) return;
    // Ground collision
    if (bird.y + bird.height >= canvas.current.height - settings.groundHeight) {
      setGameOver(true);
    }

    // Pipe collision
    for (let pipe of obstacles) {
      if (
        bird.x < pipe.x + settings.pipeWidth &&
        bird.x + bird.width > pipe.x &&
        bird.y < pipe.y + pipe.height &&
        bird.y + bird.height > pipe.y
      ) {
        setGameOver(true);
      }
    }
  }

  // Game loop
  function gameLoop() {
    if (!ctx || !canvas.current) return;
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);

    // Draw ground
    ctx.fillStyle = "green";
    ctx.fillRect(
      0,
      canvas.current.height - settings.groundHeight,
      canvas.current.width,
      settings.groundHeight
    );

    // Update and draw pipes
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const pipe = obstacles[i];
      pipe.x -= settings.pipeSpeed;
      ctx.fillStyle = "blue";
      ctx.fillRect(pipe.x, pipe.y, settings.pipeWidth, pipe.height);

      // Remove pipes that are off-screen
      if (pipe.x + settings.pipeWidth <= 0) {
        obstacles.splice(i, 1);
      }
    }

    // Generate new pipes at regular intervals
    if (settings.pipeInterval === 0) {
      generatePipes();
      setSettings((prev) => ({ ...prev, pipeInterval: 100 }));
    } else {
      setSettings((prev) => ({ ...prev, pipeInterval: prev.pipeInterval-- }));
    }

    // Update and draw bird
    bird.update();
    bird.draw();

    // Check for collisions
    checkCollision();

    let w = requestAnimationFrame(gameLoop);
    setFrame(w);
  }

  function pauseGame() {
    cancelAnimationFrame(frame);
    setFrame(0);
  }

  return (
    <Layout>
      <Container maxW="container.xl">
        <Grid templateAreas={`"main stats"`} gridTemplateColumns={"auto 1fr"}>
          <GridItem area={"main"} position={"relative"}>
            <canvas ref={canvas} width="400" height="400"></canvas>
            <PauseMenu
              onPause={(paused) => {
                if (paused) {
                  pauseGame();
                } else {
                  gameLoop();
                }
                setPaused(paused);
              }}
            />
            {gameOver ? (
              <Container
                position="absolute"
                centerContent
                inset={0}
                background={gameOver ? "rgba(0,0,0,0.5)" : "transparent"}
              >
                <Box style={{ margin: "auto 0", textAlign: "center" }}>
                  <Button
                    onClick={() => {
                      setGameOver(false);
                      gameLoop();
                    }}
                    variant="solid"
                    size="lg"
                    colorScheme="teal"
                  >
                    Start
                  </Button>
                </Box>
              </Container>
            ) : null}
          </GridItem>
          <GridItem area={"stats"}>
            <GameStats gameStats={[{ name: "Flaps", amount: flaps }]}>
              <ListItem>
                <Button
                  variant="outline"
                  colorScheme="red"
                  onClick={resetGameOver}
                >
                  Reset
                </Button>
              </ListItem>
            </GameStats>
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  );
};

export default FlappyBirdPage;

export const Head: HeadFC = () => <title>Flappy Bird</title>;
