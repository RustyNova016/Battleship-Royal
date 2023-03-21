export class Position {
    private x: number;
    private y: number;

    constructor(xArray: number, yArray: number) {
        this.x = xArray;
        this.y = yArray;
    }

    /** Board grid start at 1,1 for the player. This returns the position corrected to start in 0,0 for array calculations */
    get yArray() {
        return this.y
    }

    /** Board grid start at 1,1 for the player. This returns the position corrected to start in 0,0 for array calculations */
    get xArray() {
        return this.x
    }

    /** Board grid start at 1,1 for the player. This returns the position based on the player's perspective */
    get xBoard() {
        return this.x + 1
    }

    /** Board grid start at 1,1 for the player. This returns the position based on the player's perspective */
    get yBoard() {
        return this.y  + 1
    }

    public static letterToPos(letter: string): number {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const index = alphabet.indexOf(letter.toUpperCase());

        if (index === -1) {throw new Error("Error: Letter wasn't a valid alphabetical letter")}

        return index
    }

    public static from(coordinates: string) {
        const [letter, numString] = coordinates.split('') as [(string | undefined), (string)]
        const num = parseInt(numString)

        if (letter === undefined || num === undefined || isNaN(num)) {throw new Error("Invalid coordinate string")}

        return new this(this.letterToPos(letter) -1, num -1)
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