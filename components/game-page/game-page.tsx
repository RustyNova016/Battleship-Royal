import "./game-page.scss";
import React, {useContext, useEffect, useState} from "react";
import {OpponentBoard} from "@/app/game/[gametype]/OpponentBoard";
import Classnames from "classnames";
import {PlayerBoard} from "@/app/game/[gametype]/PlayerBoard";
import {DynamicBackgroundProps} from "@/components/dynamic-background/dynamic-background";
import {dynamicContext} from "@/hooks/style/dynamicBackground";
import {clientSocket} from "../../lib/SocketIO/ClientSocket";
import {EndGameOverlay} from "@/components/win-overlay/end-game-overlay";

export interface GamePageProps {
    className?: string;
}

const dynamicBackgroundDefault: DynamicBackgroundProps = {
    posX: "50%",
    posY: "100%",
    colorA: "#19305e",
    vignette: {
        opacity: 0
    }
};

export enum GameState {
    playing,
    won,
    lost,
}

export const GamePage: React.FC<GamePageProps> = ({className = ""}) => {
    const [playerHealth, setPlayerHealth] = useState(12);
    const [gameState, setGameState] = useState(GameState.playing);
    const backgroundSetter = useContext(dynamicContext);

    // Win / Lose hooking
    useEffect(() => {
        const onWin = () => {setGameState(GameState.won);};
        const onLose = () => {setGameState(GameState.lost);};

        clientSocket.on("isWinner", onWin);
        clientSocket.on("isLoser", onLose);

        return () => {
            clientSocket.off("isWinner", onWin);
            clientSocket.off("isLoser", onLose);
        };
    }, []);


    // Dynamic Background
    useEffect(() => {
        console.log(`Setting vignette as: ${playerHealth > 0 ? 1 - (playerHealth / 12) : 1}`);
        const back: DynamicBackgroundProps = {
            ...dynamicBackgroundDefault,
            vignette: {
                ...dynamicBackgroundDefault.vignette,
                opacity: (playerHealth > 0 ? 1 - (playerHealth / 12) : 1),
            },
        };
        console.log("Objh!", back);
        backgroundSetter(back);
    }, [backgroundSetter, playerHealth]);

    return (
        <>
            <div className={Classnames(className, "PageContent")}>
                <EndGameOverlay state={gameState}/>
                <PlayerBoard playerHealth={setPlayerHealth}/>
                <OpponentBoard/>
            </div>
        </>
    );
};