"use client"
import {BoardCell, BoardCellProps} from "@/components/game/BoardCell";
import {BoardCellContent} from "@/components/game/BoardCellContent";
import {BoardContext} from "@/components/game/Board";
import {useContext} from "react";

export function BoardCellClickable(props: BoardCellProps) {
    const boardContext = useContext(BoardContext);

    return <BoardCell {...props}>
        <button onClick={() => {
            console.log("Searching", props.gameBoardCell.position.stringCoordinates())
            props.gameBoardCell.markAsSearched()
            boardContext()
        }}>
            <BoardCellContent cell={props.gameBoardCell}/>
        </button>
    </BoardCell>
}