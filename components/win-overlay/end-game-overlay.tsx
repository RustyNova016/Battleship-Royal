import React from "react";
import Classnames from "classnames";
import EndGameOverlay_module from "./end-game-overlay.module.scss";
import {GameState} from "@/components/game-page/game-page";
import Link from "next/link";

export interface WinOverlayProps {
    className?: string;
    state: GameState
}

export const EndGameOverlay: React.FC<WinOverlayProps> = ({ className = "", state }) => {
    if (state === GameState.playing) { return <></>; }

    return (
        <div className={Classnames(className, EndGameOverlay_module.Background)}>
            <div className={EndGameOverlay_module.Modal} style={{
                boxShadow: `1.5px 1.5px 100px 2px ${state === GameState.won ? "#0CB6E8" : "#9b1e1e"};`,
                MozBoxShadow: `1.5px 1.5px 100px 2px ${state === GameState.won ? "#0CB6E8" : "#9b1e1e"};`,
                WebkitBoxShadow: `1.5px 1.5px 100px 2px ${state === GameState.won ? "#0CB6E8" : "#9b1e1e"};`
            }}>
                <>
                    <h1>
                        {state === GameState.won ?
                            <>You won!</> :
                            <>You lost...</>
                        }</h1>
                    <Link href={"/"}>New game</Link> {/*TODO: Put correct Link*/}
                    <Link href={"/"}>Home</Link>
                </>
            </div>
        </div>
    );
};