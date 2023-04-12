import {Position} from "@/utils/class/Position";

import {CellState} from "@/utils/class/game/BoardManagers/CellState";


/** Cell in the Board component. This only handles display logic. */
export class GameBoardCellDisplay {
    pos: Position;
    /** True if the user searched this cell */
    isSearched = false;
    /** True if the cell contain a ship */
    hasShip = false;
    /** True if the cell can be clicked */
    isClickable = false;

    constructor(pos: string) {
        this.pos = Position.from(pos);
    }

    get id() {return this.pos.getStringCoordinates();}

    public getColor() {
        if(this.isSearched && this.hasShip) {return "#dc3737";}
        if (this.isSearched) {return "#2651c2";}
        if (this.hasShip) {return "#d0d0d0";}

        return "#00000000";
    }

    public updateFromState(cellState: CellState) {
        this.hasShip = cellState.hasShip;
        this.isSearched = cellState.isSearched;
    }
}
