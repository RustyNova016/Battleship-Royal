import boardCellStyle from "@/components/game/board/cell/BoardCell.module.scss";
import {useDisplayCellProps} from "@/components/game/board/cell/BoardCellClickArea";

export function BoardCellContent(props: useDisplayCellProps) {
    return <div className={boardCellStyle["cellContent"]}>
        {props.cell.pos.getStringCoordinates()}
    </div>
}