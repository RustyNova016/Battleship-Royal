import "./game-page.scss";
import React, {useContext, useEffect, useState} from "react";
import {OpponentBoard} from "@/app/game/[gametype]/OpponentBoard";
import Classnames from "classnames";
import {PlayerBoard} from "@/app/game/[gametype]/PlayerBoard";
import {DynamicBackgroundProps} from "@/components/dynamic-background/dynamic-background";
import {dynamicContext} from "@/hooks/style/dynamicBackground";
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
    matchMaking,
    waitingForOpponent,
    playing,
    won,
    lost,
}

export const GamePage: React.FC<GamePageProps> = ({className = ""}) => {
    const [playerHealth, setPlayerHealth] = useState(12);
    const backgroundSetter = useContext(dynamicContext);

    // Dynamic Background
    useEffect(() => {
        const back: DynamicBackgroundProps = {
            ...dynamicBackgroundDefault,
            vignette: {
                ...dynamicBackgroundDefault.vignette,
                opacity: (playerHealth > 0 ? 1 - (playerHealth / 12) : 1),
            },
        };
        backgroundSetter(back);
    }, [backgroundSetter, playerHealth]);

    return (
        <>
            <div className={Classnames(className, "PageContent")}>
                <EndGameOverlay/>
                <PlayerBoard playerHealth={setPlayerHealth}/>
                <OpponentBoard/>
            </div>
        </>
    );
};