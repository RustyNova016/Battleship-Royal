import {Collection} from "@/utils/class/Collection";
import {CellState} from "@/utils/class/game/BoardManagers/CellState";
import {GameBoardCellData} from "@/components/game/game-board/game-board-cell/game-board-cell";
import {Position} from "@/utils/class/Position";

export function convertCellStatesToBoard(boardLength: number, cellStates: Collection<CellState>): GameBoardCellData[] {
    const out: GameBoardCellData[] = [];

    for (let i = 0; i < boardLength; i++) {
        for (let j = 0; j < boardLength; j++) {
            const position = new Position(i, j);
            const hasShip = cellStates.findAsOption(cell => cell.pos === position.getStringCoordinates()).map(cell => cell.hasShip).unwrapOr(false);
            out.push({
                pos: position,
                hasShip: hasShip,
                isSearched: cellStates.findAsOption(cell => cell.pos === position.getStringCoordinates()).map(cell => cell.isSearched).unwrapOr(false)
            });
        }
    }

    return out;
}