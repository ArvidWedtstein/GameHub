import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { graphql, Link } from "gatsby";

import {
  Grid,
  GridItem,
  Card,
  CardBody,
  Heading,
  Text,
  CardFooter,
  ButtonGroup,
  Button,
  Divider,
  Stack,
  Image,
  Badge,
} from "@chakra-ui/react";
import Layout from "../../components/layout";

const GamesPage = ({ data }: PageProps<any>) => {
  type Game = {
    id: number;
    name: string;
    description: string;
    stage: "beta" | "comming soon" | "released";
  };

  const games: Game[] = data.allMongodbGameHubDbGames.edges.map(
    (b: any) => b.node
  ) as Game[];

  // const games = [
  //   {
  //     id: 1,
  //     name: "Tetris",
  //     description: "",
  //     stage: "beta",
  //   },
  //   {
  //     id: 2,
  //     name: "2048",
  //     description: "",
  //     stage: "released",
  //   },
  //   {
  //     id: 3,
  //     name: "Snake",
  //     description: "",
  //     stage: "beta",
  //   },
  //   {
  //     id: 4,
  //     name: "Chess",
  //     description: "",
  //     stage: "beta",
  //   },
  //   {
  //     id: 5,
  //     name: "Pacman",
  //     description: "",
  //     stage: "comming soon",
  //   },
  //   {
  //     id: 6,
  //     name: "Match",
  //     description: "Match Card.",
  //     stage: "beta",
  //   },
  // ];
  return (
    <Layout>
      <Grid templateColumns="repeat(5, 1fr)" gap={6}>
        {games.map((game) => (
          <Card maxW="sm" key={game.id}>
            <CardBody>
              <Image
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                alt="Green double couch with wooden legs"
                borderRadius="lg"
              />
              <Stack mt="6" spacing="3">
                <Heading size="md" gap={3}>
                  {game.name}
                </Heading>
                {game.description && <Text>{game.description}</Text>}
                {/* <Text>
                  <Badge
                    colorScheme={game.stage === "released" ? "purple" : "gray"}
                  >
                    {game.stage === "released" ? "New" : game.stage}!
                  </Badge>
                </Text> */}
              </Stack>
            </CardBody>
            <Divider />
            {/* <CardFooter>
              <ButtonGroup spacing="2">
                <Button
                  isDisabled={game.stage === "comming soon"}
                  variant="outline"
                  colorScheme="blue"
                  disabled={game.stage === "comming soon"}
                  as={Link}
                  to={game.name.toLowerCase()}
                >
                  Play
                </Button>
              </ButtonGroup>
            </CardFooter> */}
          </Card>
        ))}
      </Grid>
    </Layout>
  );
};

export default GamesPage;
