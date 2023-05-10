import {CellState} from "@/utils/class/game/BoardManagers/CellState";
import {ShipPlacementSerialized} from "@/utils/class/game/ShipManagers/ShipPlacementSerialized";

/** State of the whole board */
export interface GameBoardState {
    ships: ShipPlacementSerialized[];
    board: CellState[];
}
