import {useEffect, useState} from "react";
import {GameStateClient} from "@/utils/states/GameStateClient";
import {clientSocket} from "../../../lib/SocketIO/ClientSocket";

export function useGameState() {
    const [gameState, setGameState] = useState<GameStateClient>(GameStateClient.idle);

    useEffect(() => {
        const onWin = () => {
            setGameState(GameStateClient.won);
        };
        const onLose = () => {
            setGameState(GameStateClient.lost);
        };

        const setGameStateEvent = (state: GameStateClient) => {
            setGameState(state);
        };

        clientSocket.on("isWinner", onWin);
        clientSocket.on("isLoser", onLose);
        clientSocket.on("setGameState", setGameStateEvent);

        return () => {
            clientSocket.off("isWinner", onWin);
            clientSocket.off("isLoser", onLose);
            clientSocket.off("setGameState", setGameStateEvent);
        };
    }, []);

    return gameState;
}