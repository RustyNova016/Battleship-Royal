import "./game-board.css";
import { GameBoardCell, GameBoardCellData, } from "./game-board-cell/game-board-cell";
import Classnames from "classnames";
import { Position } from "@/utils/class/Position";

export interface GameBoardProps {
    className?: string;
    cells: GameBoardCellData[];
    onCellClick: (pos: Position) => void;
        disabled: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({ className = "", cells, onCellClick, disabled }) => {
    return <div className={Classnames(className, "GameBoard")}>
        {cells.map((cell) => <GameBoardCell key={cell.pos.getStringCoordinates()} {...cell} disabled={disabled} onClick={onCellClick} />)}
    </div>;
};
