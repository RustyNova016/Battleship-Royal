import {GridUtils} from "@/utils/class/GridUtils";
import {Position} from "@/utils/class/Position";
import {GameBoardCell} from "@/utils/objects/GameBoardCell";
import {Fleet} from "@/utils/objects/ship/Fleet";
import {PlacedShip} from "@/utils/objects/ship/PlacedShip";
import {ShipPart} from "@/utils/objects/ship/ShipPart";
import {UserGameInfo} from "@/utils/types/UserGameInfo";


export class GameBoard {
    /** 2D array of the cells of the board */
    cells: GameBoardCell[][] = [];
    /** Collection of ship that will and are used in the game */
    fleet: Fleet = new Fleet(this);
    /** Is it considered as the enemies board */
    isEnemy: boolean = false;
    /** Can the board be interacted with? */
    isInteractive: boolean = false;

    constructor(ships: PlacedShip[] | undefined = undefined) {
        this.generateCells();
        ships !== undefined ? this.placeShips(ships) : undefined;
    }

    get isBoardReady(): boolean {
        return this.fleet.areAllPlaced();
    }

    public static fromGameInfo(data: UserGameInfo): GameBoard {
        const gameBoard = new GameBoard();
        gameBoard.fleet.availableShipTypes = data.availableShipTypes;
        return gameBoard;
    }

    public canPlaceShip(ship: PlacedShip) {
        if (ship.anchorPosition === undefined || ship.facing) {
            return false;
        }

        for (let i = 0; i < ship.shipType.length; i++) {
            // Calculate the position of the ship part
            const partPos = GridUtils.getOffsetPos(ship.anchorPosition, ship.facing, i);

            if (this.getCellAt(partPos).shipPart !== null) {
                return false;
            }
        }

        return true;
    }

    public generateCells() {
        const cells: GameBoardCell[][] = [];

        for (let y = 1; y < 11; y++) {
            const row: GameBoardCell[] = [];
            for (let x = 1; x < 11; x++) {
                row.push(new GameBoardCell(new Position(x, y), this));
            }
            cells.push(row);
        }

        this.cells = cells;
    }

    public getCellAt(pos: Position): GameBoardCell {
        let row = this.cells[pos.yArray];
        if (row === undefined) {
            throw new Error("Y index out of range");
        }

        let cell = row[pos.xArray];
        if (cell === undefined) {
            throw new Error("X index out of range");
        }
        return cell;
    }

    public placeShip(ship: PlacedShip) {
        if (!this.canPlaceShip(ship)) {
            throw new Error("Cannot place a ship");
        }

        // Ship position is already checked in the placement check function. This is just a typescript check
        if (ship.anchorPosition === undefined || ship.facing) {
            return;
        }

        for (let i = 0; i < ship.shipType.length; i++) {
            // Calculate the position of the ship part
            const partPos = GridUtils.getOffsetPos(ship.anchorPosition, ship.facing, i);

            const shipPart = new ShipPart(partPos, []);
            this.getCellAt(partPos).shipPart = shipPart;
            ship.parts.push(shipPart);
        }
        this.ships.push(ship);
    }

    public placeShips(ships: PlacedShip[]) {
        for (const ship of ships) {
            this.placeShip(ship);
        }
    }
}