export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
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