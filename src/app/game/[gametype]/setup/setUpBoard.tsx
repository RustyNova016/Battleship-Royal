"use client";
import {testShipTypes} from "@/app/game/[gametype]/setup/page";
import {Board} from "@/components/game/board/Board";
import {GameBoardSetupManager} from "@/utils/class/game/GameManagers/GameBoardSetupManager";
import {Orientation} from "@/utils/class/Orientation";
import {Position} from "@/utils/class/Position";
import {Direction} from "@/utils/objects/ship/Fleet";
import {useState} from "react";
import {BoardDisplay} from "@/utils/objects/DisplayBoard/BoardDisplay";

export function SetUpBoard() {
    const [gameBoardSetUpManager, setGameBoardSetUpManager] = useState(new GameBoardSetupManager(testShipTypes));
    const [displayBoard, setDisplayBoard] = useState<BoardDisplay>(new BoardDisplay());
    const [placementDirection, setPlacementDirection] = useState<Direction>("up");

    // Update the display class with the info of the logic class
    // This is only needed for the setup, as we don't need to ask the server if a ship placement is valid
    displayBoard.updateFromState(gameBoardSetUpManager.exportState())

    /** Handles the rotation of the ship */
    function rotatePlacement() {
        setPlacementDirection(Orientation.rotateClockwise(placementDirection))
    }

    /** Handles the placement of a ship */
    function onCellClick(pos: Position) {
        gameBoardSetUpManager.handlePlacement(pos, placementDirection)
    }

    return <>
        <button onClick={() => {rotatePlacement()}}>↻</button>
        facing: {placementDirection}
        <Board board={displayBoard} cellClickHandler={onCellClick}/>
    </>
}