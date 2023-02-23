"use client"

import {GameBoard} from "@/utils/objects/GameBoard";
import boardStyle from "./Board.module.scss"
import {createContext, useEffect, useState} from "react";
import {BoardCellWrapper} from "@/components/game/board/cell/BoardCellWrapper";
import {GameManager} from "@/utils/objects/GameManager";

export const BoardContext = createContext(() => {
})

export type BoardState = "setup" | "display" | "active";

interface BoardProps {
    board: GameBoard;
    state: BoardState;
}

export interface UseGame {
    gameHandler: GameManager
}

export function Board(props: BoardProps & UseGame) {
    const [hasChange, setHasChange] = useState(false);

    function refreshBoard() {
        setHasChange(true)
    }

    useEffect(() => {
        setHasChange(false)
    }, [hasChange]);


    return <div className={boardStyle["board"]}>
        <BoardContext.Provider value={refreshBoard}>
            {
                props.gameHandler.userBoard.cells.map((row) => {
                    return row.map((cell, cellIndex) => {
                        return <BoardCellWrapper gameHandler={props.gameHandler} key={cellIndex} gameBoardCell={cell} state={props.state}/>
                    })
                })
            }
        </BoardContext.Provider>
    </div>
}