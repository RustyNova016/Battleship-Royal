import {GameBoardCell} from "@/utils/objects/GameBoardCell";
import boardCellStyle from "@/components/game/board/cell/BoardCell.module.scss";
import {BoardState, UseGame} from "@/components/game/board/Board";
import {BoardCellClickArea} from "@/components/game/board/cell/BoardCellClickArea";

export interface BoardCellProps {
    gameBoardCell: GameBoardCell
    state: BoardState;
}

export function BoardCellWrapper(props: BoardCellProps & UseGame) {
    const cellPos = props.gameBoardCell.position;

    const wrapperStyle = {
        gridColumn: cellPos.x + " / " + cellPos.x,
        gridRow: cellPos.y + " / " + cellPos.y,
        backgroundColor: props.gameBoardCell.getColor()
    };

    return <div className={boardCellStyle["cellWrapper"]} style={wrapperStyle}>
        <BoardCellClickArea gameHandler={props.gameHandler} state={props.state} cell={props.gameBoardCell}/>
    </div>
}

