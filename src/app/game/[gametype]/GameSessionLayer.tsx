import {useContext, useState} from "react";
import {unserializeResult} from "@rustynova/monads";
import {clientSocket} from "../../../../lib/SocketIO/ClientSocket";
import {FleetContext} from "@/components/context/fleetContext";
import {ResultSerialized} from "@rustynova/monads/lib/result/result";
import {GamePage} from "@/components/game-page/game-page";
import {GameModeContext} from "@/components/context/GameModeContext";
import {useGameSession} from "@/hooks/game/useGameSession";

function handleSocketResult(res: ResultSerialized<any, string>) {
    unserializeResult(res)
        .mapErr(errStr => new Error(errStr))
        .unwrap();
}

export function GameSessionLayer() {
    const [isRequesting, setIsRequesting] = useState(false);
    const playerFleet = useContext(FleetContext).value;
    const gamemode = useContext(GameModeContext);

    const session = useGameSession();

    if (session.isNone() && !isRequesting) {
        setIsRequesting(true);
        clientSocket.emit("joinSession", playerFleet, gamemode, (res) => {handleSocketResult(res);});
    }

    return <>
        <GamePage/>
    </>;
}
