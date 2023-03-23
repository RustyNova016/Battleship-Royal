import {Position} from "@/utils/class/Position";
import {GameBoard} from "@/utils/objects/GameBoard";
import {Direction, Fleet} from "@/utils/objects/ship/Fleet";
import {PlacedShip} from "@/utils/objects/ship/PlacedShip/PlacedShip";
import {ShipType} from "@/utils/objects/ship/shiptype/ShipType";
import {GameBoardState} from "@/utils/class/game/GameManagers/GameBoardState";

/** This class manages everything related to one board */
export class GameBoardManager {
    /** Game board and all the cells */
    public board: GameBoard;

    /** The ships placed on the board */
    public fleet: Fleet;

    constructor() {
        this.board = new GameBoard(this);
        this.fleet = new Fleet(this);
    }

    public placeShip(shipType: ShipType, pos: Position, direction: Direction) {
        // Check if the placement is possible
        if (!this.fleet.canPlaceShip(shipType, pos, direction)) {return false;}

        // Place the ship
        const ship = new PlacedShip(shipType, pos, direction);
        this.fleet.insertShip(ship);

        return true;
    }

    /** Export the state of this board for the client rendering */
    public exportState(): GameBoardState {
        return {
            board: this.board.exportState(),
            ships: this.fleet.exportState()
        };
    }
}