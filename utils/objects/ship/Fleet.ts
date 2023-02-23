import {GridUtils} from "@/utils/class/GridUtils";
import {Orientation} from "@/utils/class/Orientation";
import {Position} from "@/utils/class/Position";
import {PlacedShip} from "@/utils/objects/ship/PlacedShip";
import {ShipType} from "@/utils/objects/ship/ShipType";
import {GameBoard} from "@/utils/objects/GameBoard";
import {direction} from "@/utils/validation/placedShipJSONZod";

export type Direction = "up" | "right" | "down" | "left"

export class Fleet {
    board: GameBoard;
    availableShipTypes: ShipType[];
    ships: PlacedShip[] = [];

    constructor(board: GameBoard, availableShipTypes: ShipType[] = []) {
        this.board = board
        this.availableShipTypes = availableShipTypes;
    }

    public areAllPlaced(): boolean {
        return this.findNextShipToPlace() === undefined;
    }


    public placeNextType(at: Position, facing: direction){
        const nextShip = this.findNextShipToPlace();
        if(nextShip === undefined) {return}
        return this.placeShip(nextShip, at, facing)
    }

    private findNextShipToPlace() {
        for (const availableShipType of this.availableShipTypes) {
            if(!this.isShipTypePlaced(availableShipType)) {return availableShipType}
        }
        return ;
    }

    private isShipTypePlaced(availableShipType: ShipType) {
        for (const ship of this.ships) {
            if (ship.shipType.id === availableShipType.id) {return  true}
        }

        return false
    }

    public canPlaceShip(ship: ShipType, anchorPosition: Position, facing: Direction) {
        for (let i = 0; i < ship.length; i++) {
            // Calculate the position of the ship part
            const partPos = GridUtils.getOffsetPos(anchorPosition, Orientation.getShipTailDirection(facing), i)

            if (this.board.getCellAt(partPos).shipPart !== undefined) {
                return false
            }
        }

        return true
    }

    public placeShip(ship: ShipType, anchorPosition: Position, facing: Direction) {
        if (!this.canPlaceShip(ship, anchorPosition, facing)) {
            throw new Error("Cannot place a ship")
        }

        const placed = new PlacedShip(ship, anchorPosition, facing, this)
        placed.createParts()
    }
}