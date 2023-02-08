import {GameBoardCell} from "@/utils/objects/GameBoardCell";
import boardCellStyle from "@/components/game/BoardCell.module.scss";
import {PropsWithChildren} from "react";

export interface BoardCellProps extends PropsWithChildren {
    gameBoardCell: GameBoardCell
}

export function BoardCell(props: BoardCellProps) {
    const cellPos = props.gameBoardCell.position;
    return <div className={boardCellStyle["cellWrapper"]}
                style={{
                    gridColumn: cellPos.x + " / " + cellPos.x,
                    gridRow: cellPos.y + " / " + cellPos.y
                }}>
        {props.children}
    </div>
}

