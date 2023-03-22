import boardCellStyle from "@/components/game/board/cell/BoardCell.module.scss";
import {
    BoardCellClickArea,
    useCellClickHandler,
    useDisplayCellProps
} from "@/components/game/board/cell/BoardCellClickArea";

export function BoardCellWrapper(props: useDisplayCellProps & useCellClickHandler) {
    const cellPos = props.cell.pos;

    const wrapperStyle = {
        gridColumn: cellPos.xBoard + " / " + cellPos.xBoard,
        gridRow: cellPos.yBoard + " / " + cellPos.yBoard,
        backgroundColor: props.cell.getColor()
    };

    return <div className={boardCellStyle["cellWrapper"]} style={wrapperStyle}>
        <BoardCellClickArea cell={props.cell} cellClickHandler={props.cellClickHandler}/>
    </div>
}

