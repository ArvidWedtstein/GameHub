import { hasCollision, isWithinBoard } from "../../hooks/useBoard";
import { rotate, type Tetromino } from "./Tetrominoes";
import { Action } from "./Input";
import { Board } from "../../hooks/useBoard";
import { type Player } from "../../hooks/usePlayer";

const attemptRotation = ({
  board,
  player,
  setPlayer,
}: {
  board: Board;
  player: Player;
  setPlayer: (player: Player) => void;
}) => {
  const shape = rotate({
    piece: player.tetromino.shape,
    direction: 1,
  });

  const position = player.position;
  const isValidRotation =
    isWithinBoard({ board, position, shape }) &&
    !hasCollision({ board, position, shape });

  if (isValidRotation) {
    setPlayer({
      ...player,
      tetromino: {
        ...player.tetromino,
        shape,
      },
    });
  } else {
    return false;
  }
};

export const movePlayer = ({
  delta,
  position,
  shape,
  board,
}: {
  delta: Player["position"];
  position: Player["position"];
  shape: Tetromino["shape"];
  board: Board;
}) => {
  const desiredNextPosition = {
    row: position.row + delta.row,
    column: position.column + delta.column,
  };

  const collided = hasCollision({
    board,
    position: desiredNextPosition,
    shape,
  });

  const isOnBoard = isWithinBoard({
    board,
    position: desiredNextPosition,
    shape,
  });

  const preventMove = !isOnBoard || (isOnBoard && collided);
  const nextPosition = preventMove ? position : desiredNextPosition;

  const isMovingDown = delta.row > 0;
  const isHit = isMovingDown && (collided || !isOnBoard);

  return { collided: isHit, nextPosition };
};

// TODO: fix type
const attemptMovement = ({
  board,
  action,
  player,
  setPlayer,
  setGameOver,
}: {
  action: any;
  board: Board;
  player: Player;
  setPlayer: (player: Player) => void;
  setGameOver: (gameover: boolean) => void;
}) => {
  const delta = { row: 0, column: 0 };
  let isFastDropping = false;

  if (action === Action.FastDrop) {
    isFastDropping = true;
  } else if (action === Action.SlowDrop) {
    delta.row += 1;
  } else if (action === Action.Left) {
    delta.column -= 1;
  } else if (action === Action.Right) {
    delta.column += 1;
  }

  const { collided, nextPosition } = movePlayer({
    delta,
    position: player.position,
    shape: player.tetromino.shape,
    board,
  });

  // Did we collide immediately? If so, game over, man!
  const isGameOver = collided && player.position.row === 0;
  if (isGameOver) {
    setGameOver(isGameOver);
  }

  setPlayer({
    ...player,
    collided,
    isFastDropping,
    position: nextPosition,
  });
};

// TODO: fix type
export const playerController = ({
  action,
  board,
  player,
  setPlayer,
  setGameOver,
}: {
  action: any;
  board: Board;
  player: Player;
  setPlayer: (player: Player) => void;
  setGameOver: (gameover: boolean) => void;
}) => {
  if (!action) return;

  if (action === Action.Rotate) {
    attemptRotation({ board, player, setPlayer });
  } else {
    attemptMovement({ board, player, setPlayer, action, setGameOver });
  }
};
