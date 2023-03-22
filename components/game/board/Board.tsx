"use client";

import {useCellClickHandler} from "@/components/game/board/cell/BoardCellClickArea";
import {BoardCellWrapper} from "@/components/game/board/cell/BoardCellWrapper";
import {GameManager} from "@/utils/objects/GameManager";
import {createContext} from "react";
import boardStyle from "./Board.module.scss";
import {BoardDisplay} from "@/utils/objects/DisplayBoard/BoardDisplay";

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
    const cells = props.board.toValueArray()
    return <div className={boardStyle["board"]}>
            {
                cells.map((cell, cellIndex) => {
                    return <BoardCellWrapper cell={cell} cellClickHandler={props.cellClickHandler} key={cellIndex}/>
                })
            }
    </div>
}