import {GridUtils} from "@/utils/class/GridUtils";
import {Orientation} from "@/utils/class/Orientation";
import {Position} from "@/utils/class/Position";
import {Direction} from "@/utils/objects/ship/Fleet";
import {ShipPart} from "@/utils/objects/ship/ShipPart";
import {ShipType} from "@/utils/objects/ship/shiptype/ShipType";
import {ShipPlacementSerialized} from "@/utils/class/game/ShipManagers/ShipPlacementSerialized";
import {Result} from "@rustynova/monads";
import {GameBoard} from "@/utils/objects/GameBoard";
import {getShiptype} from "@/utils/mocks/ShipTypes";
import {PipoRiskyLoop} from "../../../../lib/Pipo/PipoRiskyLoop";

export class PlacedShip {
    public anchorPosition: Position;
    public facing: Direction;
    public parts: ShipPart[];
    public shipType: ShipType;

    private constructor(shipType: ShipType, anchorPosition: Position, facing: Direction) {
        this.facing = facing;
        this.anchorPosition = anchorPosition;
        this.shipType = shipType;
        this.parts = [];
    }

    /** Return true if all the parts of the ships are defeated */
    get isDestroyed(): boolean {
        return this.parts.every(part => part.isDestroyed);
    }

    /** Place a shiptype on the board */
    public static place(shipType: ShipType, anchorPosition: Position, facing: Direction, board: GameBoard): Result<PlacedShip, Error> {
        const placedShip = new PlacedShip(shipType, anchorPosition, facing);

        return placedShip.createParts(board)
            .replaceOk(placedShip);
    }

    public static unserializePlace(ship: ShipPlacementSerialized, board: GameBoard) {
        return this.place(
            getShiptype(ship.shipType).unwrap(), //TODO: Handle errors, remove mocking
            Position.from_safe(ship.pos).unwrap(), //TODO: Handle errors
            ship.direction,
            board
        );
    }

    public createParts(board: GameBoard){
        const positions = [];

        for (let i = 0; i < this.shipType.length; i++) {
            // Calculate the position of the ship part
            positions.push(GridUtils.getOffsetPos(this.anchorPosition, Orientation.getShipTailDirection(this.facing), i));
        }

        return PipoRiskyLoop.enter<Position>(positions)
            .forEach(partPos => board
                // Get the cell
                .getCellAt_safe(partPos)
                .andThen(cell => {
                    // Create the part
                    return ShipPart.create(this, cell)
                        .inspect(part => this.parts.push(part));
                }));
    }

    /** Check for equality */
    public eq(other: PlacedShip) {
        return this.anchorPosition.Eq(other.anchorPosition)
            && this.shipType.eq(other.shipType)
            && this.facing === other.facing;
    }

    public getPartsPositions() {
        const positions = [];

        for (let i = 0; i < this.shipType.length; i++) {
            positions.push(GridUtils.getOffsetPos(this.anchorPosition, Orientation.getShipTailDirection(this.facing), i));
        }

        return positions;
    }

    public serialize(): ShipPlacementSerialized {
        return {
            pos: this.anchorPosition.getStringCoordinates(),
            direction: this.facing,
            shipType: this.shipType.id
        };
    }

    public toJSON(): ShipPlacementSerialized {
        return {
            pos: this.anchorPosition.getStringCoordinates(),
            direction: this.facing,
            shipType: this.shipType.id
        };
    }
}

