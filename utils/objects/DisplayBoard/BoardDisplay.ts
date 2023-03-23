import {DataTable} from "@/utils/class/ORM/ORM/DataTable";
import {CellDisplay} from "@/utils/objects/DisplayBoard/CellDisplay";
import {classicBoardLength} from "../../../data/Boards";

import {GameBoardState} from "@/utils/class/game/GameManagers/GameBoardState";

/** Board component data, only handles display logic */
export class BoardDisplay extends DataTable<CellDisplay> {
    isClickable = false;

    public create(id: string) {
        this.set(id, new CellDisplay(id));
    }

    public getOrCreate(id: string) {
        const cell = this.get(id);
        if (cell !== undefined) {return cell;}

        this.create(id);
        return this.getOrThrow(id);
    }

    /** Convert it to a 2d Array */
    public to2DArray(){
        const rows = [];

        for (let i = 0; i < classicBoardLength; i++) {
            rows.push(this.getRow(i));
        }

        return rows;
    }

    /** Get a specific row of the board */
    public getRow(rowNum: number) {
        return this
            .toValueArray()
            .filter(cell => cell.pos.yArray === rowNum)
            .sort((pos1, pos2) => pos1.pos.xArray - pos2.pos.xArray);
    }

    /** Update from a board state */
    updateFromState(state: GameBoardState) {
        state.board.forEach(cellState => {
            this.getOrCreate(cellState.pos).updateFromState(cellState);
        });
        return this;
    }
}

