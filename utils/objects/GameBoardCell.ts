import {Position} from "@/utils/objects/Position";
import {ShipPart} from "@/utils/objects/ShipPart";

export class GameBoardCell {
    position: Position;
    shipPart: ShipPart | null

    constructor(position: Position) {
        this._searched = false;
        this.position = position;
        this.shipPart = null
    }

    private _searched: boolean;

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