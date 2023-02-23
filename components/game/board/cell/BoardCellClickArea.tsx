"use client"
import {BoardCellContent} from "@/components/game/board/cell/BoardCellContent";
import {BoardContext, BoardState, UseGame} from "@/components/game/board/Board";
import {useContext} from "react";
import {GameBoardCell} from "@/utils/objects/GameBoardCell";

export interface BoardCellClickAreaProps {
    cell: GameBoardCell
    state: BoardState
}

export function BoardCellClickArea(props: BoardCellClickAreaProps & UseGame) {
    const refreshBoard = useContext(BoardContext);

    const onClick = () => {
        console.log("Click on", props.cell.position.stringCoordinates())
        props.gameHandler.handleClick(props.cell)
        refreshBoard()
    };

    return <button onClick={onClick} disabled={props.cell.isClickable()}>
        <BoardCellContent cell={props.cell}/>
    </button>
}