"use client";
import {useEffect, useState} from "react";
import {None, Option, Some} from "@rustynova/monads";
import {CellState} from "@/utils/class/game/BoardManagers/CellState";
import {clientSocket} from "../../../../lib/SocketIO/ClientSocket";
import {GameBoard} from "@/components/game/game-board/game-board";
import {GameBoardCellData} from "@/components/game/game-board/game-board-cell/game-board-cell";
import {Position} from "@/utils/class/Position";
import {Collection} from "@/utils/class/Collection";

export function convertCellStatesToBoard(boardLength: number, cellStates: Collection<CellState>): GameBoardCellData[] {
    const out: GameBoardCellData[] = [];

    for (let i = 0; i < boardLength; i++) {
        for (let j = 0; j < boardLength; j++) {
            const position = new Position(i, j);
            const hasShip = cellStates.findAsOption(cell => cell.pos === position.getStringCoordinates()).map(cell => cell.hasShip).unwrapOr(false);
            out.push({
                pos: position,
                hasShip: hasShip,
                isSearched: cellStates.findAsOption(cell => cell.pos === position.getStringCoordinates()).map(cell => cell.isSearched).unwrapOr(false)
            });
        }
    }

    return out;
}

export function OpponentBoard() {
    const [opponentBoard, setOpponentBoard] = useState<Option<CellState[]>>(None);
    const [isPlayerTurn, setIsPlayerTurn] = useState(false);

    useEffect(() => {
        const onSetOpponentBoardEvent = (newBoard: CellState[]) => setOpponentBoard(Some(newBoard));
        const onIsPlayerTurn = (active: boolean) => setIsPlayerTurn(active);

        clientSocket.on("setOpponentBoard", onSetOpponentBoardEvent);
        clientSocket.on("isPlayerTurn", onIsPlayerTurn);

        return () => {
            clientSocket.off("setOpponentBoard", onSetOpponentBoardEvent);
            clientSocket.off("isPlayerTurn", onIsPlayerTurn);
        };
    }, [clientSocket]);

    const clickHandler = () => {}; //TODO

    if (opponentBoard.isNone()) {return <>Waiting for an Opponent</>;}
    return <>
        <GameBoard cells={convertCellStatesToBoard(10, new Collection<CellState>(...opponentBoard.get()))}
            disabled={isPlayerTurn}
            onCellClick={clickHandler}/>
    </>;
}