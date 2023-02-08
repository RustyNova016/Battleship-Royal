export interface BoardCell {
    x: number;
    y: number;
    isHit: boolean;
}

export class GameBoard {
    cells: BoardCell[][];

    constructor(cells: BoardCell[][]) {
        this.cells = cells
    }

    public static new(): GameBoard {
        const cells: BoardCell[][] = [];

        for (let y = 1; y < 11; y++) {
            const row: BoardCell[] = []
            for (let x = 1; x < 11; x++) {
                row.push({
                    x: x,
                    y: y,
                    isHit: false
                })
            }
            cells.push(row)
        }

        return new GameBoard(cells)
    }
}