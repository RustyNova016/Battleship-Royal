import {ShipType} from "@/utils/objects/ShipType";
import {ShipPart} from "@/utils/objects/ShipPart";
import {Position} from "@/utils/objects/Position";
import {GameBoard} from "@/utils/objects/GameBoard";
import {GridUtils} from "@/utils/GridUtils";

export type direction = "up" | "right" | "down" | "left"

export class Ship {
    shipType: ShipType;
    parts: ShipPart[]

    constructor(shipType: ShipType) {
        this.shipType = shipType;
        this.parts = [];
    }

    public isAbleToBePlaced(pos: Position, facing: direction, gameBoard: GameBoard) {
        for (let i = 0; i < this.shipType.length; i++) {
            // Calculate the position of the ship part
            const partPos = GridUtils.getOffsetPos(pos, facing, i)

            if(gameBoard.getCellAt(partPos).shipPart !== null) {return false}
        }
        return true
    }

    public place(pos: Position, facing: direction, gameBoard: GameBoard) {
        if(!this.isAbleToBePlaced(pos, facing, gameBoard)) { throw new Error("Cannot place a ship at " + pos.stringCoordinates())}

        for (let i = 0; i < this.shipType.length; i++) {
            // Calculate the position of the ship part
            const partPos = GridUtils.getOffsetPos(pos, facing, i)

            const shipPart = new ShipPart(partPos, []);
            gameBoard.getCellAt(partPos).shipPart = shipPart
            this.parts.push(shipPart)
        }
    }
}

