import {GameBoardCell} from "@/utils/objects/GameBoardCell";
import {ShipType} from "@/utils/objects/ShipType";
import {Position} from "@/utils/objects/Position";


export class GameBoard {
    cells: GameBoardCell[][];
    ships: ShipType[]

    constructor(cells: GameBoardCell[][], ships: ShipType[]) {
        this.cells = cells;
        this.ships = ships;
    }

    public static new(): GameBoard {
        const cells: GameBoardCell[][] = [];

        for (let y = 1; y < 11; y++) {
            const row: GameBoardCell[] = []
            for (let x = 1; x < 11; x++) {
                row.push(new GameBoardCell(new Position(x, y)))
            }
            cells.push(row)
        }

        return new GameBoard(cells, [])
    }

    public getCellAt(pos: Position): GameBoardCell {
        let row = this.cells[pos.y];
        if (row === undefined) {
            throw new Error("Y index out of range")
        }

        let cell = row[pos.x];
        if (cell === undefined) {
            throw new Error("X index out of range")
        }
        return cell;
    }
}