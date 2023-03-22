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
        return this.y + 1
    }

    public static letterToArrayPos(letter: string): number {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const index = alphabet.indexOf(letter.toUpperCase());

        if (index === -1) {throw new Error("Error: Letter wasn't a valid alphabetical letter")}

        return index
    }

    public static ArrayPosToLetter(index: number) {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const letter = alphabet.at(index)

        if(letter === undefined) {
            throw new Error("Error: The index is out of range")
        }

        return letter
    }

    public static from(coordinates: string) {
        const letter = coordinates.at(0)
        const numString = coordinates.slice(1);
        const num = parseInt(numString)

        if (letter === undefined || num === undefined || isNaN(num)) {throw new Error("Invalid coordinate string")}

        return new this(this.letterToArrayPos(letter), num - 1)
    }

    public getStringCoordinates(): string {
        return Position.ArrayPosToLetter(this.xArray) + this.yBoard
    }
}