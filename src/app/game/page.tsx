"use client"
import {GameBoard} from "@/utils/objects/GameBoard";
import {Board} from "@/components/game/Board";
import {ShipType} from "@/utils/objects/ShipType";
import {Ship} from "@/utils/objects/Ship";
import {Position} from "@/utils/objects/Position";

export default function page() {
    const board = GameBoard.new()
    const shipType = new ShipType("", "Test", 4)
    const ship = new Ship(shipType)
    ship.place(new Position(5, 5), "up", board)

    return <div style={{margin: "20px"}}>
        <Board board={board}/>
    </div>
}