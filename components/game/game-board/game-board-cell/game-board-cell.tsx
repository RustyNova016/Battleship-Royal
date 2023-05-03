import "./game-board-cell.scss";
import React, {useEffect, useRef} from "react";
import Classnames from "classnames";
import {Position} from "@/utils/class/Position";
import autoAnimate from "@formkit/auto-animate";

export interface GameBoardCellData {
    hasShip: boolean;
    isSearched: boolean;
    pos: Position;
}

export interface GameBoardCellProps extends GameBoardCellData {
    className?: string;
    disabled: boolean;
    onClick: (pos: Position) => void;
}

function getBackgroundColor(hasShip: boolean, isSearched: boolean, isActive: boolean) {
    if (hasShip && isSearched) { return "#dc3737"; }
    if (isSearched) { return "#2651c2"; }
    if (hasShip) { return "#d0d0d0"; }
    //If (isActive) {return "#36312b"; }

    return "#00000000";
}

export const GameBoardCell: React.FC<GameBoardCellProps> = ({
    className = "",
    pos,
    isSearched,
    hasShip,
    onClick,
    disabled
}) => {
    const backgroundColor = getBackgroundColor(hasShip, isSearched, !disabled);

    const parentRef = useRef(null);

    useEffect(() => {
        if (parentRef.current) {
            autoAnimate(parentRef.current);
        }
    }, [parent]);

    return (
        <div ref={parentRef}
            className={Classnames(className, "Cell")}
            style={{
                gridColumn: pos.xBoard + " / " + pos.xBoard,
                gridRow: pos.yBoard + " / " + pos.yBoard,
                backgroundColor: backgroundColor,
                color: backgroundColor === "#d0d0d0" ? "#000000aa" : "#d0d0d0aa"
            }}>
            <div className="CellContent">
                <button disabled={isSearched || hasShip || disabled}
                    onClick={() => {onClick(pos);}}
                    className={"CellButton"}
                    style={{
                        cursor: isSearched || hasShip || disabled ? "cell" : "crosshair"
                    }}>
                    {pos.getStringCoordinates()}
                </button>
            </div>
        </div>
    );
};
