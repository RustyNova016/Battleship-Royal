import {useEffect, useState} from "react";
import {None, Option, Some} from "@rustynova/monads";
import {GameSessionData} from "@/utils/ORM Entities/Sessions/GameSession";
import {clientSocket} from "../../../lib/SocketIO/ClientSocket";

export function useGameSession() {
    const [session, setSession] = useState<Option<GameSessionData>>(None);

    // Receive events
    useEffect(() => {
        console.log("Setting up listeners");
        const onSetSession = (session: GameSessionData) => {
            console.log("[Client] > Receiving Session Data");
            setSession(Some(session));
        };

        const onClearSessionData = () => {
            console.log("[Client] > Clearing Session Data");
            setSession(None);
        };

        clientSocket.on("updateClientSession", onSetSession);
        clientSocket.on("clearClientSession", onClearSessionData);

        return () => {
            console.log("Unmounting listeners");
            clientSocket.off("updateClientSession", onSetSession);
            clientSocket.off("clearClientSession", onClearSessionData);
        };
    }, []);

    return session;
}