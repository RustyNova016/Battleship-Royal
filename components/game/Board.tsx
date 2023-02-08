"use client"

import {GameBoard} from "@/utils/objects/GameBoard";
import boardStyle from "./Board.module.scss"
import {BoardCellClickable} from "@/components/game/BoardCellClickable";
import {createContext, useEffect, useState} from "react";

export const BoardContext = createContext(() => {
})

export function Board({board}: { board: GameBoard }) {
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
                    return <BoardCellClickable key={cellIndex} gameBoardCell={cell}/>
                })
            })}
        </BoardContext.Provider>
    </div>
}