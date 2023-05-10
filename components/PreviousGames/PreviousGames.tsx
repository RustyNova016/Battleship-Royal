import "./PreviousGames.scss";
import React from "react";
import Classnames from "classnames";
import {PreviousGameElement} from "@/components/PreviousGameElement/PreviousGameElement";

export interface PreviousGamesProps {
    className?: string;
    previousGames: PreviousGameElement[],
}

export const PreviousGames: React.FC<PreviousGamesProps> = ({ className = "", previousGames }) => (
    <div className={Classnames(className, "PreviousGamesTable")}>
        {previousGames.map((prevGame) => <PreviousGameElement key={prevGame.date.toUTCString()} {...prevGame}/>)}
    </div>
);