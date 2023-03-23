import {GameBoardManager} from "@/utils/class/game/GameManagers/GameBoardManager";
import {GridUtils} from "@/utils/class/GridUtils";
import {Orientation} from "@/utils/class/Orientation";
import {Position} from "@/utils/class/Position";
import {PlacedShip} from "@/utils/objects/ship/PlacedShip/PlacedShip";
import {ShipType} from "@/utils/objects/ship/shiptype/ShipType";
import {ShipPlacement} from "@/utils/class/game/ShipManagers/ShipPlacement";

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
        for (let i = 0; i < ship.length; i++) {
            // Calculate the position of the ship part
            const partPos = GridUtils.getOffsetPos(anchorPosition, Orientation.getShipTailDirection(facing), i);

            if (this.board.getCellAt(partPos).shipPart !== undefined) {
                return false;
            }
        }

        return true;
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

    public placeShip(ship: ShipType, anchorPosition: Position, facing: Direction) {
        if (!this.canPlaceShip(ship, anchorPosition, facing)) {
            throw new Error("Cannot place a ship");
        }

        const placed = new PlacedShip(ship, anchorPosition, facing);
        placed.createParts();
    }

    /** Return true is this type of ship is placed on the board */
    private isShipTypePlaced(availableShipType: ShipType) {
        for (const ship of this.ships) {
            if (ship.shipType.id === availableShipType.id) {return true;}
        }

        return false;
    }

    public exportState(): ShipPlacement[] {
        return this.ships.map(ship => ship.exportState());
    }
}