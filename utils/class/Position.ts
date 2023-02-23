export class Position {
    x: number;
    y: number;

    get yArray(){
        return this.y - 1
    }

    get xArray() {
        return this.x - 1
    }

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public stringCoordinates(): string {
        const mapper = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
        const letter = mapper[this.xArray];

        if (letter === undefined) {
            throw new Error("X index out of range")
        }

        return letter + this.y;
    }
}