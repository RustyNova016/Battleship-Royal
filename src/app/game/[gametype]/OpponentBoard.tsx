"use client";
import {useEffect, useState} from "react";
import {None, Option, Some} from "@rustynova/monads";
import {CellState} from "@/utils/class/game/BoardManagers/CellState";
import {clientSocket} from "../../../../lib/SocketIO/ClientSocket";
import {GameBoard} from "@/components/game/game-board/game-board";
import {Position} from "@/utils/class/Position";
import {Collection} from "@/utils/class/Collection";
import {convertCellStatesToBoard} from "@/app/game/[gametype]/ConvertCellStatesToBoard";
import "./Boards.scss";

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

    const clickHandler = (pos: Position) => {
        console.log(`[Client] Sending move: ${pos.getStringCoordinates()}`);
        clientSocket.emit("sendMove", pos.xArray, pos.yArray);
    }; //TODO

    if (opponentBoard.isNone()) {return <>Waiting for an Opponent</>;}

    return <>
        <GameBoard header={<div className={"Title"}>Opponent</div>}
            cells={convertCellStatesToBoard(10, new Collection<CellState>(...opponentBoard.get()))}
            disabled={!isPlayerTurn}
            onCellClick={clickHandler}/>
    </>;
}

