"use client"
import {GameBoardCell} from "@/utils/objects/GameBoardCell";
import boardCellStyle from "@/components/game/board/cell/BoardCell.module.scss";

export function BoardCellContent(props: { cell: GameBoardCell }) {

    return <div className={boardCellStyle["cellContent"]}>
        {props.cell.position.stringCoordinates()}
    </div>
}