import {useContext, useEffect, useState} from "react";
import {None, Option, Some, unserializeResult} from "@rustynova/monads";
import {GameSessionData} from "@/utils/ORM Entities/Sessions/GameSession";
import {clientSocket} from "../../../../lib/SocketIO/ClientSocket";
import {FleetContext} from "@/components/context/fleetContext";
import {ResultSerialized} from "@rustynova/monads/lib/result/result";
import {GamePage} from "@/components/game-page/game-page";
import {GameModeContext} from "@/components/context/GameModeContext";

function handleSocketResult(res: ResultSerialized<any, string>) {
    unserializeResult(res)
        .mapErr(errStr => new Error(errStr))
        .unwrap();
}

export function GameSessionLayer() {
    const [isRequesting, setIsRequesting] = useState(false);
    const [session, setSession] = useState<Option<GameSessionData>>(None);
    const playerFleet = useContext(FleetContext).value;
    const gamemode = useContext(GameModeContext);

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

    if (session.isNone() && !isRequesting) {
        setIsRequesting(true);
        clientSocket.emit("joinSession", playerFleet, gamemode, (res) => {handleSocketResult(res);});
    }

    return <>
        <GamePage/>
    </>;
}
