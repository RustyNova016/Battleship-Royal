import {GameBoardManager} from "@/utils/class/game/GameManagers/GameBoardManager";
import {GridUtils} from "@/utils/class/GridUtils";
import {Position} from "@/utils/class/Position";
import {GameBoardCell} from "@/utils/objects/GameBoardCell";
import {Direction} from "@/utils/objects/ship/Fleet";
import {PlacedShip} from "@/utils/objects/ship/PlacedShip/PlacedShip";
import {ShipPart} from "@/utils/objects/ship/ShipPart";
import {ShipType} from "@/utils/objects/ship/shiptype/ShipType";
import {UserGameInfo} from "@/utils/types/UserGameInfo";
import {CellState} from "@/utils/class/game/BoardManagers/CellState";

/** Class that handles board logic */
export class GameBoard {
    /** Board Manager */
    gameBoardManager: GameBoardManager;
    /** 2D array of the cells of the board */
    cells: GameBoardCell[][] = [];
    /** Is it considered as the enemies board? */
    isEnemy = false;
    /** Can the board be interacted with? */
    isInteractive = false;

    constructor(gameBoardManager: GameBoardManager) {
        this.gameBoardManager = gameBoardManager;
        this.generateCells();
    }

    get isBoardReady(): boolean {
        return this.fleet.areAllPlaced();
    }

    public static fromGameInfo(data: UserGameInfo): GameBoard {
        const gameBoard = new GameBoard();
        gameBoard.fleet.availableShipTypes = data.availableShipTypes;
        return gameBoard;
    }

    /** Check if the ship can be placed at a position */
    public canPlaceShip(shipType: ShipType, pos: Position, direction: Direction) {
        for (let i = 0; i < shipType.length; i++) {
            // Calculate the position of the ship part
            const partPos = GridUtils.getOffsetPos(pos, direction, i);

            if (this.getCellAt(partPos).shipPart !== null) {
                return false;
            }
        }

        return true;
    }

    public generateCells() {
        const cells: GameBoardCell[][] = [];

        for (let y = 0; y < 10; y++) {
            const row: GameBoardCell[] = [];
            for (let x = 0; x < 10; x++) {
                row.push(new GameBoardCell(new Position(x, y), this, this.gameBoardManager));
            }
            cells.push(row);
        }

        this.cells = cells;
    }

    public getCellAt(pos: Position): GameBoardCell {
        const row = this.cells[pos.yArray];
        if (row === undefined) {
            throw new Error("Y index out of range");
        }

        const cell = row[pos.xArray];
        if (cell === undefined) {
            throw new Error("X index out of range");
        }
        return cell;
    }

    public placeShip(ship: PlacedShip) {
        if (ship.anchorPosition === undefined) {return;}

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

    /** Export the state of this board for the client rendering */
    public exportState(): CellState[] {
        const gameBoardCells = this.cells.flat();
        return gameBoardCells.map(cell => cell.exportState());
    }
}