import {Position} from "@/utils/objects/Position";
import {ShipPart} from "@/utils/objects/ship/ShipPart";
import {GameBoard} from "@/utils/objects/GameBoard";
import {PlacedShip} from "@/utils/objects/ship/PlacedShip/PlacedShip";

export class GameBoardCell {
    /** Board in which the cell reside */
    gameBoard: GameBoard;

    /** Position on the board */
    position: Position;

    /** The part of a ship that the cell contain */
    shipPart: ShipPart | undefined;

    constructor(position: Position, gameBoard: GameBoard) {
        this._searched = false;
        this.position = position;
        this.shipPart = undefined;
        this.gameBoard = gameBoard
    }

    private _searched: boolean;

    get searched(): boolean {
        return this._searched;
    }

    get hasShip(): boolean {
        return this.shipPart !== undefined;
    }

    public getColor() {
        const hasShip = this.hasShip;

        if (!hasShip) {
            if (!this._searched) {
                return "#00000000";
            } else {
                return "#2651c2";
            }
        }

        if (!this._searched) {
            return "#aaaaaa";
        }
        {
            return "#dc3737";
        }
    }


    public isClickable() {
        switch (this.gameBoard.boardState) {
            case "display":
                return false
            case "active":
                return this._searched;
            case "setup":
                return !this.hasShip
        }
    }

    public markAsSearched() {
        this._searched = true
    }
}