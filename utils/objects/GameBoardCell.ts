import {Position} from "@/utils/objects/Position";
import {ShipPart} from "@/utils/objects/ShipPart";
import {BoardState} from "@/components/game/Board";

export class GameBoardCell {
    position: Position;
    shipPart: ShipPart | null

    constructor(position: Position) {
        this._searched = false;
        this.position = position;
        this.shipPart = null
    }

    private _searched: boolean;

    public isClickable(boardState: BoardState) {
        switch (boardState) {
            case "display":
                return false
            case "active":
                return this._searched;
            case "setup":
                return !this.hasShip
        }
    }

    get searched(): boolean {
        return this._searched;
    }

    get hasShip(): boolean {
        return this.shipPart !== null;
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

    public markAsSearched() {
        this._searched = true
    }
}