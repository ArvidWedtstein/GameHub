import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { graphql } from "gatsby";
import Layout from "../../components/layout";

import {
  Container,
  List,
  ListItem,
  Stat,
  StatLabel,
  StatNumber,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Board as BoardType, buildBoard } from "../../hooks/useBoard";
import Board from "../../components/tetris/Board";
import ChessCell from "../../components/chess/ChessCell";

const ChessPage: React.FC<PageProps> = () => {
  const [board, setBoard] = React.useState<BoardType>(
    buildBoard({ rows: 8, columns: 8 })
  );

  // https://codepen.io/jak_e/pen/JjRGQPY

  return (
    <Layout>
      <Container maxW="container.xl">
        <Grid templateAreas={`"main stats"`} gridTemplateColumns={"auto 1fr"}>
          <GridItem area={"main"}>
            <Board
              board={board}
              CellComponent={ChessCell}
              bg="gray.500"
              borderColor={"gray.500"}
            />
          </GridItem>
          <GridItem area={"stats"}>
            <List padding={"2rem"} listStyleType={"none"} spacing={3}>
              <ListItem>
                <Stat>
                  <StatLabel>Moves</StatLabel>
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

export default ChessPage;
