"use client";
import {PropsWithChildren} from "react";
import {GameModeContext} from "@/components/context/GameModeContext";
import {GamemodesEnum} from "../../../../data/GameMode";

export function GamemodeProvider(props: { gamemode: GamemodesEnum } & PropsWithChildren) {
    return <GameModeContext.Provider value={props.gamemode}>
        {props.children}
    </GameModeContext.Provider>;
}