"use client"
import {BoardCellContent} from "@/components/game/board/cell/BoardCellContent";
import {BoardContext} from "@/components/game/board/Board";
import {useContext} from "react";
import {Position} from "@/utils/class/Position";
import {CellDisplay} from "@/utils/objects/DisplayBoard/CellDisplay";

export interface useCellClickHandler {
    cellClickHandler: (cellPos: Position) => void
}

export interface useDisplayCellProps {
    cell: CellDisplay
}

export function BoardCellClickArea(props: useCellClickHandler & useDisplayCellProps) {
    const refreshBoard = useContext(BoardContext);

    const onClick = () => {
        console.log("Click on", props.cell.pos.stringCoordinates())
        props.cellClickHandler(props.cell.pos)
        refreshBoard()
    };

    return <button onClick={onClick} disabled={props.cell.isClickable}>
        <BoardCellContent cell={props.cell}/>
    </button>
}