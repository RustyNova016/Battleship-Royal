"use client";
import {testShipTypes} from "@/app/game/[gametype]/setup/page";
import {Board} from "@/components/game/board/Board";
import {GameBoardSetupManager} from "@/utils/class/game/GameManagers/GameBoardSetupManager";
import {Orientation} from "@/utils/class/Orientation";
import {Position} from "@/utils/class/Position";
import {Direction} from "@/utils/objects/ship/Fleet";
import {useContext, useEffect, useState} from "react";
import {GameBoardDisplay} from "@/utils/objects/DisplayBoard/GameBoardDisplay";
import {GameContext} from "@/components/context/gameContext";
import {useRouter} from "next/navigation";
import {Some} from "@rustynova/monads";

export function SetUpBoard() {
    const [gameBoardSetUpManager] = useState(new GameBoardSetupManager(testShipTypes));
    const [displayBoard, setDisplayBoard] = useState<GameBoardDisplay>(new GameBoardDisplay([]));
    const [placementDirection, setPlacementDirection] = useState<Direction>("up");
    const playerFleet = useContext(GameContext);
    const router = useRouter();


    /** Handles the refresh of the displayed data */
    function updateDisplay() {
        // Update the display class with the info of the logic class
        // This is only needed for the setup, as we don't need to ask the server if a ship placement is valid
        console.log("New state!", gameBoardSetUpManager.exportState());

        const newDisplayBoard = new GameBoardDisplay(gameBoardSetUpManager.toBoardData(false))
            .setClickable(true);
        setDisplayBoard(newDisplayBoard);
    }

    useEffect(() => {
        updateDisplay();
    }, []);


    /** Handles the rotation of the ship */
    function rotatePlacement() {
        setPlacementDirection(Orientation.rotateClockwise(placementDirection));
    }

    /** Handles the placement of a ship */
    function onCellClick(pos: Position) {
        gameBoardSetUpManager.handlePlacement(pos, placementDirection).unwrap();
        updateDisplay();
    }

    function onSubmit() {
        console.log(playerFleet);
        playerFleet.push(...gameBoardSetUpManager.fleet.exportState());
        console.log(playerFleet);
        
        //TODO: Category
        console.log("[Client] Fleet Data");
        console.log("[Client] > Finished setting up the board, sending to the game arena");
        router.push("/game/1v1");
    }

    console.log(playerFleet);

    //FIXME: When exporting the state to the display board, the cell cannot determine if it contain a ship or not, so nothing display

    return <>
        <Board board={displayBoard} onClick={Some(onCellClick)}/>
        <button onClick={() => {rotatePlacement();}}>↻</button>
        facing: {placementDirection}
        <button onClick={onSubmit}>Send</button>
    </>;
}
