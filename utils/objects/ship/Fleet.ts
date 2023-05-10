import {GameBoardManager} from "@/utils/class/game/GameManagers/GameBoardManager";
import {GridUtils} from "@/utils/class/GridUtils";
import {Orientation} from "@/utils/class/Orientation";
import {Position} from "@/utils/class/Position";
import {PlacedShip} from "@/utils/objects/ship/PlacedShip/PlacedShip";
import {ShipType} from "@/utils/objects/ship/shiptype/ShipType";
import {SerializedFleet, ShipPlacementSerialized} from "@/utils/class/game/ShipManagers/ShipPlacementSerialized";
import {Result} from "@rustynova/monads";
import {GameBoard} from "@/utils/objects/GameBoard";

export type Direction = "up" | "right" | "down" | "left"

export class Fleet {
    boardManager: GameBoardManager;
    ships: PlacedShip[] = [];

    constructor(boardManager: GameBoardManager) {
        this.boardManager = boardManager;
    }

    public get board() {return this.boardManager.board;}

    /** Check if we can place a ship there */
    public canPlaceShip(ship: ShipType, anchorPosition: Position, facing: Direction) {
        // Check all the cells where the ship is located
        for (let i = 0; i < ship.length; i++) {
            // Calculate the position of the ship part
            const partPos = GridUtils.getOffsetPos(anchorPosition, Orientation.getShipTailDirection(facing), i);

            if (this.board.getCellAt(partPos).shipPart !== undefined) {
                return false;
            }
        }

        return true;
    }

    public exportState(): SerializedFleet {
        return this.ships.map(ship => ship.serialize());
    }

    public getAllOccupiedCells() {
        const occupiedCell: Position[] = [];
        this.ships.map(ship => ship.getPartsPositions()).forEach(posArray => occupiedCell.push(...posArray));
        return occupiedCell;
    }

    /** Return true if there's a ship located at a position*/
    public hasShipLocatedAt(pos: Position) {
        return this.ships.some(ship => ship.getPartsPositions().some(shipPos => pos.getStringCoordinates() === shipPos.getStringCoordinates()));
    }

    public insertShip(ship: PlacedShip) {
        this.ships.push(ship);
    }

    isPlacedShipValid(ship: PlacedShip) {

    }

    /** Add a ship to the fleet, and update the board's cells */
    public placeShip(ship: ShipType, anchorPosition: Position, facing: Direction, board: GameBoard): Result<PlacedShip, Error> {
        return PlacedShip
            .place(
                ship,
                anchorPosition,
                facing,
                board
            ).inspect(ship => this.ships.push(ship));
    }

    public toJSON(): ShipPlacementSerialized[] {
        return this.ships.map(ship => ship.toJSON());
    }

    /** Return true is this type of ship is placed on the board */
    private isShipTypePlaced(availableShipType: ShipType) {
        for (const ship of this.ships) {
            if (ship.shipType.id === availableShipType.id) {return true;}
        }

        return false;
    }

    /** Return true if all the ships are defeated */
    public isDefeated(): boolean {
        return this.ships.every(ship => ship.isDestroyed);
    }
}
