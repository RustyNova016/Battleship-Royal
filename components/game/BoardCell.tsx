import {GameBoardCell} from "@/utils/objects/GameBoardCell";
import boardStyle from "@/components/game/Board.module.scss";
import {PropsWithChildren} from "react";
export interface BoardCellProps extends PropsWithChildren {
    gameBoardCell: GameBoardCell
}

export function BoardCell(props: BoardCellProps) {
    return <div className={boardStyle["cell"]}
         style={{
             gridColumn: props.gameBoardCell.x + " / " + props.gameBoardCell.x,
             gridRow: props.gameBoardCell.y + " / " + props.gameBoardCell.y
         }}>
        {props.children}
    </div>
}

export function BoardCellClickable(props: BoardCellProps) {
    return <BoardCell {...props}><button><BoardCellContent cell={props.gameBoardCell}/></button></BoardCell>
}

export function BoardCellContent(props: { cell: GameBoardCell }) {
    return <>
        {props.cell.stringCoordinates()}
    </>
}