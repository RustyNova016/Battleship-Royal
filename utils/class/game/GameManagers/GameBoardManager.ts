import {Position} from "@/utils/class/Position";
import {GameBoard} from "@/utils/objects/GameBoard";
import {Direction, Fleet} from "@/utils/objects/ship/Fleet";
import {PlacedShip} from "@/utils/objects/ship/PlacedShip/PlacedShip";
import {ShipType} from "@/utils/objects/ship/shiptype/ShipType";
import {GameBoardState} from "@/utils/class/game/GameManagers/GameBoardState";
import {ShipTypeTable} from "@/utils/ORM Entities/ShipTypes/ShipTypeTable";

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

    /** Export the state of this board for the client rendering */
    public exportState(): GameBoardState {
        return {
            board: this.board.exportState(),
            ships: this.fleet.exportState()
        };
    }

    /** Insert the state */
    public fromState(state: GameBoardState, shipTypeTable: ShipTypeTable) {
        const newManager = new GameBoardManager();

        //Place each ship
        state.ships.forEach(shipToPlace => {
            newManager.placeShip(shipTypeTable.getOrThrow(shipToPlace.shipType), shipToPlace.pos, shipToPlace.direction);
        });

    }

    public placeShip(shipType: ShipType, pos: Position, direction: Direction) {
        // Check if the placement is possible
        if (!this.fleet.canPlaceShip(shipType, pos, direction)) {return false;}

        // Place the ship
        const ship = new PlacedShip(shipType, pos, direction);
        this.fleet.insertShip(ship);

        return true;
    }
}