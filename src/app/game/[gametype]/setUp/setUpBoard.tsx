"use client"
import {Orientation} from "@/utils/class/Orientation";
import {GameManager} from "@/utils/objects/GameManager";
import {Board} from "@/components/game/board/Board";
import {testShipTypes} from "@/app/game/[gametype]/setUp/page";

export function SetUpBoard() {
    const game = new GameManager(testShipTypes)

    return <>
        <button onClick={event => {game.shipPlacementDirection = Orientation.rotateClockwise(game.shipPlacementDirection)}}>↻</button>
        facing: {game.shipPlacementDirection}
        <Board gameHandler={game} board={game.userBoard} state={"setup"}/>
    </>
}