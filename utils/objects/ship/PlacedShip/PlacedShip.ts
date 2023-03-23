import {GridUtils} from "@/utils/class/GridUtils";
import {Orientation} from "@/utils/class/Orientation";
import {Position} from "@/utils/class/Position";
import {Direction} from "@/utils/objects/ship/Fleet";
import {ShipPart} from "@/utils/objects/ship/ShipPart";
import {ShipType} from "@/utils/objects/ship/shiptype/ShipType";

import {ShipPlacement} from "@/utils/class/game/ShipManagers/ShipPlacement";


export class PlacedShip {
    public anchorPosition: Position;
    public facing: Direction;
    public parts: ShipPart[];
    public shipType: ShipType;

    constructor(shipType: ShipType, anchorPosition: Position, facing: Direction) {
        this.facing = facing;
        this.anchorPosition = anchorPosition;
        this.shipType = shipType;
        this.parts = [];
    }

    get isDestroyed(): boolean {
        for (const part of this.parts) {
            if (!part.destroyed) {
                return false;
            }
        }

        return true;
    }

    get isPlaced(): boolean {
        return this.parts.length !== 0;
    }

    public getPartsPositions() {
        const positions = [];

        for (let i = 0; i < this.shipType.length; i++) {
            positions.push(GridUtils.getOffsetPos(this.anchorPosition, Orientation.getShipTailDirection(this.facing), i));
        }

        return positions;
    }

    public createParts() {
        for (let i = 0; i < this.shipType.length; i++) {
            // Calculate the position of the ship part
            const partPos = GridUtils.getOffsetPos(this.anchorPosition, Orientation.getShipTailDirection(this.facing), i);

            new ShipPart(this, this.fleet.board.getCellAt(partPos), []);
        }
    }

    public exportState(): ShipPlacement {
        return {
            pos: this.anchorPosition.getStringCoordinates(),
            direction: this.facing,
            shipType: this.shipType.id
        };
    }
}

