"use client"
import {BoardCellContent} from "@/components/game/BoardCellContent";
import {BoardContext, BoardState} from "@/components/game/Board";
import {useContext} from "react";
import {GameBoardCell} from "@/utils/objects/GameBoardCell";

export interface BoardCellClickAreaProps {
    cell: GameBoardCell
    state: BoardState
}

export function BoardCellClickArea(props: BoardCellClickAreaProps) {
    const refreshBoard = useContext(BoardContext);

    const onClick = () => {
        console.log("Searching", props.cell.position.stringCoordinates())
        props.cell.markAsSearched()
        refreshBoard()
    };

    return <button onClick={onClick} disabled={props.cell.isClickable(props.state)}>
        <BoardCellContent cell={props.cell}/>
    </button>
}