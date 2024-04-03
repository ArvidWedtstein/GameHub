
import React from "react";

import { buildBoard } from "../../hooks/useBoard";
import { type Tetromino, transferToBoard } from "./Tetrominoes";

import BoardCell from "./BoardCell";
import styled from "@emotion/styled";


const PreviewElement = styled.div({
    position: 'absolute',
    top: 0,
    left: '72.2vw',
    background: 'rgba(0, 0, 0, 0.1)',
    border: '10px solid rgba(0, 0, 0, 0)',
    borderRadius: '10px'
})

const PreviewBoard = styled.div({
    display: 'grid',
    rowGap: '2px',
    columnGap: '2px',
    gridTemplateRows: 'repeat(4, 1r)',
    gridTemplateColumns: 'repeat(4, 1r)',
    width: '11vw',
    height: '11vw',
})

const Preview = ({ tetromino, index }: { tetromino: Tetromino, index: number }) => {
    const { shape, className } = tetromino;

    const board = buildBoard({ rows: 4, columns: 4 });

    const style = { top: `${index * 15}vw` };

    board.rows = transferToBoard({
        className,
        isOccupied: false,
        position: { row: 0, column: 0 },
        rows: board.rows,
        shape
    });

    return (
        <PreviewElement style={style}>
            <PreviewBoard>
                {board.rows.map((row, y) =>
                    row.map((cell, x) => (
                        <BoardCell key={x * board.size.columns + x} cell={cell} />
                    ))
                )}
            </PreviewBoard>
        </PreviewElement>
    );
};

export default React.memo(Preview);
