import {GameBoard} from "@/utils/objects/GameBoard";
import boardStyle from "./Board.module.scss"
import {BoardCellClickable} from "@/components/game/BoardCell";

export function Board({board}: { board: GameBoard }) {
    return <table className={boardStyle["board"]}>
        {board.cells.map((row) => {
            return row.map((cell, cellIndex) => {
                return <BoardCellClickable key={cellIndex} gameBoardCell={cell}/>
            })
        })}
    </table>
}