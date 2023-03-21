"use client"

import boardStyle from "./Board.module.scss"
import {createContext, useEffect, useState} from "react";
import {BoardCellWrapper} from "@/components/game/board/cell/BoardCellWrapper";
import {GameManager} from "@/utils/objects/GameManager";
import {BoardDisplay} from "@/utils/objects/DisplayBoard/BoardDisplay";
import {useCellClickHandler} from "@/components/game/board/cell/BoardCellClickArea";

export const BoardContext = createContext(() => {
})

export type BoardState = "setup" | "display" | "active";

interface BoardProps {
    board: BoardDisplay;
}

export interface UseGame {
    gameHandler: GameManager
}

export function Board(props: BoardProps & useCellClickHandler) {
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
                props.board.to2DArray().map((row) => {
                    return row.map((cell, cellIndex) => {
                        return <BoardCellWrapper cell={cell} cellClickHandler={props.cellClickHandler} key={cellIndex}/>
                    })
                })
            }
        </BoardContext.Provider>
    </div>
}