import {GameBoardCell} from "@/utils/objects/GameBoardCell";
import boardCellStyle from "@/components/game/BoardCell.module.scss";
import {BoardState} from "@/components/game/Board";
import {BoardCellClickArea} from "@/components/game/BoardCellClickArea";

export interface BoardCellProps {
    gameBoardCell: GameBoardCell
    state: BoardState;
}

export function BoardCellWrapper(props: BoardCellProps) {
    const cellPos = props.gameBoardCell.position;

    const wrapperStyle = {
        gridColumn: cellPos.x + " / " + cellPos.x,
        gridRow: cellPos.y + " / " + cellPos.y,
        backgroundColor: props.gameBoardCell.getColor()
    };

    return <div className={boardCellStyle["cellWrapper"]} style={wrapperStyle}>
        <BoardCellClickArea state={props.state} cell={props.gameBoardCell}/>
    </div>
}

