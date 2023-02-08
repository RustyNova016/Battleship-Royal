import {GameBoard} from "@/utils/objects/GameBoard";
import boardStyle from "./Board.module.scss"

export function Board({board}: { board: GameBoard }) {
    return <table className={boardStyle["board"]}>
        {board.cells.map((row) => {
            return row.map((cell, cellIndex) => {
                return <div className={boardStyle["cell"]}
                            key={cellIndex}
                            style={{
                                gridColumn: cell.x + " / " + cell.x,
                                gridRow: cell.y + " / " + cell.y
                            }}>
                    Cell: {cell.x} ; {cell.y}
                </div>
            })
        })}
    </table>
}