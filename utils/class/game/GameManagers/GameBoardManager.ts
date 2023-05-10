import {Position} from "@/utils/class/Position";
import {GameBoard} from "@/utils/objects/GameBoard";
import {Direction, Fleet} from "@/utils/objects/ship/Fleet";
import {ShipType} from "@/utils/objects/ship/shiptype/ShipType";
import {GameBoardState} from "@/utils/class/game/GameManagers/GameBoardState";
import {ShipTypeTable} from "@/utils/ORM Entities/ShipTypes/ShipTypeTable";
import {ShipPlacementSerialized, ShipTypeWithPlacement} from "@/utils/class/game/ShipManagers/ShipPlacementSerialized";
import {CellState} from "@/utils/class/game/BoardManagers/CellState";
import {Result} from "@rustynova/monads";
import {PlacedShip} from "@/utils/objects/ship/PlacedShip/PlacedShip";
import {getShiptype} from "@/utils/mocks/ShipTypes";

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

    /** Insert the state */
    public static fromState(state: GameBoardState, shipTypeTable: ShipTypeTable) {
        const newManager = new GameBoardManager();

        //Place each ship
        state.ships.forEach(shipToPlace => {
            newManager.placeShip(shipTypeTable.getOrThrow(shipToPlace.shipType), Position.from(shipToPlace.pos), shipToPlace.direction);
        });

        //TODO: Place already hit cells
    }

    public toBoardData(enemy: boolean): CellState[] {
        return this.board.cells.flat().map(cell => {
            return {
                pos: cell.position.getStringCoordinates(),
                isSearched: cell.isSearched,
                hasShip: !enemy && this.fleet.hasShipLocatedAt(cell.position)
            };
        });
    }

    /** Export the state of this board for the client rendering */
    public exportState(): GameBoardState {
        return {
            board: this.board.exportState(),
            ships: this.fleet.exportState()
        };
    }

    /** Handles the logic of getting hit */
    public handleHit(pos: Position) {
        return this.board.getCellAt(pos).markAsSearched();
    }

    public isDefeated() {
        return this.fleet.isDefeated();
    }

    /** Place a ship on the board */
    public placeShip(shipType: ShipType, pos: Position, direction: Direction): Result<PlacedShip, Error> {
        return this.fleet.placeShip(shipType, pos, direction, this.board);
    }

    /** Place multiple ships on the board */
    public placeShips(ships: ShipTypeWithPlacement[]) {//TODO: Use result
        ships.forEach(ship => {this.placeShip(ship.shipType, ship.pos, ship.direction);});
    }

    public placeSerializedShip(ship: ShipPlacementSerialized) {
        return this.placeShip(
            getShiptype(ship.shipType).unwrap(), //TODO: Handle errors, remove mocking
            Position.from_safe(ship.pos).unwrap(), //TODO: Handle errors
            ship.direction,
        );
    }
}
