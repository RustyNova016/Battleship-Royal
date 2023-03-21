import {GridUtils} from "@/utils/class/GridUtils";
import {Orientation} from "@/utils/class/Orientation";
import {Position} from "@/utils/class/Position";
import {Direction, Fleet} from "@/utils/objects/ship/Fleet";
import {ShipPart} from "@/utils/objects/ship/ShipPart";
import {ShipType} from "@/utils/objects/ship/shiptype/ShipType";
import {DataTableItemType} from "@/utils/class/ORM/ORM/DataTable";


export class PlacedShip implements DataTableItemType {
    public anchorPosition: Position;
    public facing: Direction;
    fleet: Fleet;
    parts: ShipPart[];
    shipType: ShipType;

    constructor(shipType: ShipType, anchorPosition: Position, facing: Direction, fleet: Fleet) {
        this.facing = facing;
        this.anchorPosition = anchorPosition;
        this.shipType = shipType;
        this.parts = [];
        this.fleet = fleet;
        this.fleet.ships.push(this);
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

    public createParts() {
        for (let i = 0; i < this.shipType.length; i++) {
            // Calculate the position of the ship part
            const partPos = GridUtils.getOffsetPos(this.anchorPosition, Orientation.getShipTailDirection(this.facing), i);

            new ShipPart(this, this.fleet.board.getCellAt(partPos), []);
        }
    }
}

