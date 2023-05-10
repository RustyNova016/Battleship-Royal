import {DataTable} from "@/utils/class/ORM/ORM/DataTable";
import {GameBoardCellDisplay} from "@/utils/objects/DisplayBoard/GameBoardCellDisplay";
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
    /** Get a specific row of the board */
    public getRow(rowNum: number) {
        return this
            .toValueArray()
            .filter(cell => cell.pos.yArray === rowNum)
            .sort((pos1, pos2) => pos1.pos.xArray - pos2.pos.xArray);
    }
}

