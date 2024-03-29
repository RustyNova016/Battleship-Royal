import {Position} from "@/utils/class/Position";

import {CellState} from "@/utils/class/game/BoardManagers/CellState";

/** Cell in the Board component. This only handles display logic. */
export class CellDisplay {
    pos: Position;
    isChecked = false;
    isHit = false;
    hasShip = false;
    isClickable = false;

    constructor(pos: string) {
        this.pos = Position.from(pos);
    }

    get id() {return this.pos.getStringCoordinates();}

    public getColor() {
        if (this.isHit) {return "#dc3737";}
        if (this.isChecked) {return "#2651c2";}
        if (this.hasShip) {return "#aaaaaa";}

        return "#00000000";
    }

    public updateFromState(cellState: CellState) {
        this.hasShip = cellState.hasShip;
        this.isHit = cellState.isHit;
        this.isChecked = cellState.isChecked;
    }
}