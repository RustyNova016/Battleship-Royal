"use client";

import {useContext, useEffect, useState} from "react";
import {None, Option, Some, unserializeResult} from "@rustynova/monads";
import {GameSocket,} from "@/lib/SocketIO/events/clientToServerEvents";
import {setupWebSocket} from "@/components/game/Connection/setupWebSocket";
import {BoolDebug} from "@/components/bool-debug/bool-debug";
import {GameContext} from "@/components/context/gameContext";
import {GameSessionData} from "@/utils/ORM Entities/Sessions/GameSession";
import {DebugSessionData} from "@/components/debug/debug-session-data/debug-session-data";
import {GameBoard} from "@/components/game/game-board/game-board";
import {GameClient} from "@/lib/client/GameClient";

export function WebSocketLayer() {
    // Websocket setup
    const [socket, setSocket] =
    useState<Option<GameSocket>>(None);

    useEffect(() => {
        setupWebSocket(socket, setSocket);
    }, []);

    // Websocket




    const [gameClient] = useState(new GameClient());
    const [sessionData, setSessionData] = useState<Option<GameSessionData>>(None);
    const [opponentBoard, setOpponentBoard] = useState<Option<any[]>>(None);



    const playerBoard = useContext(GameContext);

    // Websocket Connection


    // Sending data to the server
    useEffect(() => {
        if(socket.isNone()) {return;}
        const unwrapSocket = socket.get();

        console.log("[Client] > Sending Ships to Server");
        unwrapSocket.emit("joinSession", playerBoard.fleet.exportState(), (data) => {
            console.log(data);
            setSessionData(Some(unserializeResult(data).unwrap()));
        });
        
        //GameClient.sendShipsToServer(unwrapSocket, playerBoard.fleet).unwrap();

        return () => {};
    }, [socket]);

    return (
        <>
            <BoolDebug text={"Websocket active"} value={socket.isSome()} />
            <DebugSessionData sessionData={sessionData}/>
            {opponentBoard.isSome()? <GameBoard cells={opponentBoard.get()} onCellClick={() => {}}/> : <></>}
        </>
    );
}
