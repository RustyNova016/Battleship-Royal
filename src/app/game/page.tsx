"use client"
import {Board} from "@/components/game/board/Board";
import {ShipType} from "@/utils/objects/ship/shiptype/ShipType";
import {GameManager} from "@/utils/objects/GameManager";

export default function page() {
    // Test ShipTypes:
    const shipType = new ShipType("", "Test", 4)

    // We create a game manager
    const gameManager = new GameManager([shipType])

    //const board = GameBoard.new()
    //const ship = new PlacedShip(shipType)
    //ship.place(new Position(5, 5), "up", board)

    return <div style={{margin: "20px"}}>
        <Board board={board} state={"active"}/>
    </div>
}