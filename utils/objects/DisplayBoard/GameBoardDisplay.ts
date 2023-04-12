import {DataTable} from "@/utils/class/ORM/ORM/DataTable";
import {GameBoardCellDisplay} from "@/utils/objects/DisplayBoard/GameBoardCellDisplay";
import {classicBoardLength} from "../../../data/Boards";

import {GameBoardState} from "@/utils/class/game/GameManagers/GameBoardState";
import {CellState} from "@/utils/class/game/BoardManagers/CellState";

/** All the data to display a board */
export class GameBoardDisplay extends DataTable<GameBoardCellDisplay> {
    public userId = "";

    constructor(cells: CellState[]) {
        super();
        cells.forEach(cellState => {
            this.getOrCreate(cellState.pos).updateFromState(cellState);
        });
    }

    get id() {return this.userId;}

    public create(id: string) {
        this.set(id, new GameBoardCellDisplay(id));
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
    
    /** Set all the cells as clickable or not */
    public setClickable(click: boolean) {
        this.toValueArray().forEach(cell => {
            console.log(`Setting cell ${cell.pos.getStringCoordinates()} as ${click && !cell.isSearched}`);
            cell.isClickable = click && !cell.isSearched;
        });
        return this;
    }


}

