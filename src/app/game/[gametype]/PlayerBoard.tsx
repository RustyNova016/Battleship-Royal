import {GameBoard} from "@/components/game/game-board/game-board";
import {convertCellStatesToBoard} from "@/app/game/[gametype]/ConvertCellStatesToBoard";
import {Collection} from "@/utils/class/Collection";
import {CellState} from "@/utils/class/game/BoardManagers/CellState";
import {useEffect, useState} from "react";
import {clientSocket} from "../../../../lib/SocketIO/ClientSocket";
import "./Boards.scss";

export function PlayerBoard({playerHealth}: {playerHealth: (val:number) => void}) {
    const [playerBoard, setPlayerBoard] = useState(new Collection<CellState>());

    useEffect(() => {
        const onSetPlayerBoardEvent = (newBoard: CellState[]) => {
            setPlayerBoard(new Collection<CellState>(...newBoard));
            console.log("[Client] Received Player Board Update");
        };

        clientSocket.on("setPlayerBoard", onSetPlayerBoardEvent);

        return () => {
            clientSocket.off("setPlayerBoard", onSetPlayerBoardEvent);
        };
    }, []);

    useEffect(() => {
        console.log(playerBoard);
        let count = 0;

        // If the game haven't started, set the health to full
        if(playerBoard.length === 0) {
            playerHealth(12);
            return;
        }

        playerBoard.forEach(cell => {
            if(cell.hasShip && !cell.isSearched) {
                console.log(`Adding: ${count}`);
                count += 1;
            }
        });

        playerHealth(count);
    }, [playerBoard, playerHealth]);


    return <>
        <GameBoard header={<div className={"Title"}>Player</div>}
            cells={convertCellStatesToBoard(10, playerBoard)}
            disabled={true}
            onCellClick={() => {}}/>
    </>;
}