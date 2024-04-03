import {
  Divider,
  List,
  ListItem,
  ListProps,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import React, { Fragment } from "react";
import { type GameStats } from "../../hooks/useGameStats";

// TODO: add some option for numberformatting
type GameStat = {
  name: string;
  amount: string | number;
  unit?: string;
};

interface GameStatsComponent {
  listProps?: ListProps;
  gameStats: GameStat[];
  children?: React.ReactNode;
}
const GameStats = ({
  children,
  listProps = {
    style: { position: "absolute", width: "22vw", right: 0, top: "6em" },
  },
  gameStats,
}: GameStatsComponent) => {
  return (
    <List listStyleType={"none"} spacing={3} {...listProps}>
      {children}
      {gameStats.map((gameStat, index) => {
        return (
          <Fragment>
            <ListItem>
              <Stat>
                <StatLabel>{gameStat.name}</StatLabel>
                <StatNumber>
                  {gameStat.amount}
                  {gameStat.unit}
                </StatNumber>
              </Stat>
            </ListItem>
            {index !== gameStats.length - 1 && (
              <Divider orientation="horizontal" />
            )}
          </Fragment>
        );
      })}
    </List>
  );
};

export default React.memo(GameStats);
