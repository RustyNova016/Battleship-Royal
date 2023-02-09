"use client"

import {GameBoard} from "@/utils/objects/GameBoard";
import boardStyle from "./Board.module.scss"
import {createContext, useEffect, useState} from "react";
import {BoardCellWrapper} from "@/components/game/BoardCellWrapper";

export const BoardContext = createContext(() => {
})

export type BoardState = "setup" | "display" | "active";

interface BoardProps {
    board: GameBoard;
    state: BoardState;
}

export function Board({board}: BoardProps) {
    const [hasChange, setHasChange] = useState(false);

    function refreshBoard() {
        setHasChange(true)
    }

    useEffect(() => {
        setHasChange(false)
    }, [hasChange]);


    return <div className={boardStyle["board"]}>
        <BoardContext.Provider value={refreshBoard}>
            {board.cells.map((row) => {
                return row.map((cell, cellIndex) => {
                    return <BoardCellWrapper key={cellIndex} gameBoardCell={cell} state={"active"}/>
                })
            })}
        </BoardContext.Provider>
    </div>
}