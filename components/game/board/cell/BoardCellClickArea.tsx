"use client";
import {BoardCellContent} from "@/components/game/board/cell/BoardCellContent";
import {Position} from "@/utils/class/Position";
import {CellDisplay} from "@/utils/objects/DisplayBoard/CellDisplay";

export interface useCellClickHandler {
    cellClickHandler: (cellPos: Position) => void
}

export interface useDisplayCellProps {
    cell: CellDisplay
}

export function BoardCellClickArea(props: useCellClickHandler & useDisplayCellProps) {

    const onClick = () => {
        console.log("Click on", props.cell.pos.getStringCoordinates())
        props.cellClickHandler(props.cell.pos)
    };

    return <button onClick={onClick} disabled={props.cell.isClickable}>
        <BoardCellContent cell={props.cell}/>
    </button>
}