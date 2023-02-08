export interface BoardCell {
    x: number;
    y: number;
    isHit: boolean;
}

export class GameBoard {
    cells: BoardCell[];

    constructor(cells: BoardCell[]) {
        this.cells = cells
    }

    public new(): GameBoard {
        const cells: BoardCell[] = [];

        for (let y = 1; y < 11; y++) {
            for (let x = 1; x < 11; x++) {
                cells.push({
                    x: x,
                    y: y,
                    isHit: false
                })
            }
        }

        return new GameBoard(cells)
    }
}