"use client"
import {GameBoard} from "@/utils/objects/GameBoard";
import {Board} from "@/components/game/board/Board";
import {ShipType} from "@/utils/objects/ship/ShipType";
import {PlacedShip} from "@/utils/objects/ship/PlacedShip";
import {Position} from "@/utils/objects/Position";

export default function page() {
    const board = GameBoard.new()
    const shipType = new ShipType("", "Test", 4)
    const ship = new PlacedShip(shipType)
    ship.place(new Position(5, 5), "up", board)

    return <div style={{margin: "20px"}}>
        <Board board={board} state={"active"}/>
    </div>
}