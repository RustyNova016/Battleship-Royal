import {GridUtils} from "@/utils/class/GridUtils";
import {Orientation} from "@/utils/class/Orientation";
import {Position} from "@/utils/class/Position";
import {Direction} from "@/utils/objects/ship/Fleet";
import {ShipPart} from "@/utils/objects/ship/ShipPart";
import {ShipType} from "@/utils/objects/ship/shiptype/ShipType";
import {ShipPlacementSerialized} from "@/utils/class/game/ShipManagers/ShipPlacementSerialized";
import {Err, Ok, Result} from "@rustynova/monads";
import {GameBoard} from "@/utils/objects/GameBoard";
import {getShiptype} from "@/utils/mocks/ShipTypes";

export class InvalidShipPartError extends Error {
    public static invalidPlacement(part: ShipPart) {
        return new this(
            `Invalid Ship Part Placement: Part of ship [${
                part.ship.shipType.name
            }] cannot be placed at ${part.cell.position.getStringCoordinates()} \n
            
            Cell has ship [${part.cell.shipPart.unwrap().ship.shipType.name}]`
        );
    }
}

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

    get isPlaced(): boolean {
        return this.parts.every(part => part.isPlaced);
    }

    /** Place a shiptype on the board */
    public static place(shipType: ShipType, anchorPosition: Position, facing: Direction, board: GameBoard): Result<PlacedShip, Error> {
        const placedShip = new PlacedShip(shipType, anchorPosition, facing);

        return placedShip
            .createParts(board)
            .andThen(parts => {
                // Check if the parts can be placed
                for (const part of parts) {
                    if(!part.canBePlaced()) { return Err(InvalidShipPartError.invalidPlacement(part));}
                }

                // Then place all the parts
                parts.forEach(part => part.place().unwrap()); // Unsafe unwrapping, but it already got checked above so it's fine
                return Ok(null);
            })
            .replaceOk(placedShip);
    }

    public createParts(board: GameBoard): Result<ShipPart[], Error> {
        const parts = [];

        for (let i = 0; i < this.shipType.length; i++) {
            // Calculate the position of the ship part
            const partPos = GridUtils.getOffsetPos(this.anchorPosition, Orientation.getShipTailDirection(this.facing), i);

            // Get the cell
            const cell = board.getCellAt_safe(partPos);
            if (cell.isErr()) {return cell;}

            // Create the part
            parts.push(ShipPart.create(this, cell.unwrap()));
        }

        return Ok(parts);
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

    public static unserializePlace(ship: ShipPlacementSerialized, board: GameBoard) {
        return this.place(
            getShiptype(ship.shipType).unwrap(), //TODO: Handle errors, remove mocking
            Position.from_safe(ship.pos).unwrap(), //TODO: Handle errors
            ship.direction,
            board
        );
    }

    public toJSON(): ShipPlacementSerialized {
        return {
            pos: this.anchorPosition.getStringCoordinates(),
            direction: this.facing,
            shipType: this.shipType.id
        };
    }
}

