import {GameBoardCell} from "@/utils/objects/GameBoardCell";

export class GameBoard {
    cells: GameBoardCell[][];

    constructor(cells: GameBoardCell[][]) {
        this.cells = cells
    }

    public static new(): GameBoard {
        const cells: GameBoardCell[][] = [];

        for (let y = 1; y < 11; y++) {
            const row: GameBoardCell[] = []
            for (let x = 1; x < 11; x++) {
                row.push(new GameBoardCell(x, y, false))
            }
            cells.push(row)
        }

        return new GameBoard(cells)
    }
}