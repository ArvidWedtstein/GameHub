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

// TODO: finish
const PongPage = () => {
  return (
    <Layout>
      <Container maxW="container.xl">
        <Grid templateAreas={`"main stats"`} gridTemplateColumns={"auto 1fr"}>
          <GridItem area={"main"}></GridItem>
          <GridItem area={"stats"}></GridItem>
        </Grid>
      </Container>
    </Layout>
  );
};

export default PongPage;

export const Head: HeadFC = () => <title>Pong</title>;
