import "./game-board.scss";
import {GameBoardCell, GameBoardCellData,} from "./game-board-cell/game-board-cell";
import Classnames from "classnames";
import {Position} from "@/utils/class/Position";
import {ReactNode} from "react";

export interface GameBoardProps {
    className?: string;
    cells: GameBoardCellData[];
    onCellClick: (pos: Position) => void;
    disabled: boolean;
    header?: ReactNode;
}

export const GameBoard: React.FC<GameBoardProps> = ({ className = "", header, cells, onCellClick, disabled }) => {
    return <div className="GameBoardOuter">
        {header}
        <div className={Classnames(className, "GameBoard")}>
            {cells.map((cell) => <GameBoardCell key={cell.pos.getStringCoordinates()} {...cell} disabled={disabled} onClick={onCellClick} />)}
        </div>
    </div>;
};
