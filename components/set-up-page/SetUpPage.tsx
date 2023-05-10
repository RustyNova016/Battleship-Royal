"use client";
import "./set-up-page.scss";
import React, {useContext, useState} from "react";
import {GameBoard} from "@/components/game/game-board/game-board";
import {Collection} from "@/utils/class/Collection";
import Classnames from "classnames";
import {PageTitle} from "../page-title/page-title";
import {convertCellStatesToBoard} from "@/app/game/[gametype]/ConvertCellStatesToBoard";
import {CellState} from "@/utils/class/game/BoardManagers/CellState";
import {GameBoardSetupManager} from "@/utils/class/game/GameManagers/GameBoardSetupManager";
import {Direction} from "@/utils/objects/ship/Fleet";
import {FleetContext} from "@/components/context/fleetContext";
import {useRouter} from "next/navigation";
import {Position} from "@/utils/class/Position";
import {Orientation} from "@/utils/class/Orientation";
import {GamemodesEnum} from "../../data/GameMode";
import {ShipTypes} from "../../data/Ships";

export interface SetUpPageProps {
    className?: string;
    gamemode: GamemodesEnum;
}

export const SetUpPage: React.FC<SetUpPageProps> = ({className = "", gamemode}) => {
    const [cellState, setCellState] = useState(new Collection<CellState>());
    const [gameBoardSetUpManager] = useState(new GameBoardSetupManager(ShipTypes));
    const [placementDirection, setPlacementDirection] = useState<Direction>("up");

    const playerFleet = useContext(FleetContext);
    const router = useRouter();

    /** Handles the rotation of the ship */
    function rotatePlacement() {
        setPlacementDirection(Orientation.rotateClockwise(placementDirection));
    }

    /** Handles the placement of a ship */
    function onCellClick(pos: Position) {
        gameBoardSetUpManager.handlePlacement(pos, placementDirection).unwrap();
        setCellState(new Collection(...gameBoardSetUpManager.board.exportState()));
    }

    function onSubmit() {
        console.log(playerFleet.value);
        playerFleet.set(gameBoardSetUpManager.fleet.exportState());
        console.log(playerFleet.value);

        //TODO: Category
        console.log("[Client] Fleet Data");
        console.log("[Client] > Finished setting up the board, sending to the game arena");
        router.push(`/game/${gamemode}`);
    }

    return (
        <div className={Classnames(className, "page")}>
            <div className="TitleArea">
                <PageTitle>
                    <h1>Place your ships</h1>
                </PageTitle></div>
            <div className="SetupHeader">
                <button className="ShellButton" onClick={rotatePlacement}>↻</button>
                <div className="ShipBlockRow">
                    Placing ship:
                    <div className="ShipBlock"/>
                </div>
                <button className="ShellButton" onClick={onSubmit}>Send</button>
            </div>
            <div className="BoardArea">
                <GameBoard cells={convertCellStatesToBoard(10, cellState)}
                    disabled={gameBoardSetUpManager.shipsToPlace.length === 0}
                    onCellClick={onCellClick}/>
            </div>
        </div>
    );
};