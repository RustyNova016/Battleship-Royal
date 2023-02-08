export interface GameBoardCellI {
    x: number;
    y: number;
    isHit: boolean;
}

export class GameBoardCell implements GameBoardCellI {
    isHit: boolean;
    x: number;
    y: number;

    constructor(x: number, y: number, isHit: boolean) {
        this.isHit = isHit;
        this.x = x;
        this.y = y;
    }

    public stringCoordinates(): string {
        const mapper = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
        const letter = mapper[this.x - 1];

        if (letter === undefined) {
            throw new Error("X index out of range")
        }

        return letter + this.y;
    }
}