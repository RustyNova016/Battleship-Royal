import {CellState} from "@/utils/class/game/BoardManagers/CellState";
import {ShipPlacement} from "@/utils/class/game/ShipManagers/ShipPlacement";

/** State of the whole board */
export interface GameBoardState {
    ships: ShipPlacement[];
    board: CellState[];
}