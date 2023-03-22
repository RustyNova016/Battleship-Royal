import {CellState, GameBoardManager} from "@/utils/class/game/GameManagers/GameBoardManager";
import {Position} from "@/utils/class/Position";
import {GameBoard} from "@/utils/objects/GameBoard";
import {ShipPart} from "@/utils/objects/ship/ShipPart";

export class GameBoardCell {
    /** All the board information */
    boardManager: GameBoardManager;

    /** Board in which the cell resides */
    gameBoard: GameBoard;

    /** Position on the board */
    position: Position;

    /** The part of a ship that the cell contains */
    shipPart: ShipPart | undefined;

    constructor(position: Position, gameBoard: GameBoard, boardManager: GameBoardManager) {
        this._searched = false;
        this.position = position;
        this.shipPart = undefined;
        this.gameBoard = gameBoard;
        this.boardManager = boardManager;
    }

    public get id() {return this.position.getStringCoordinates();}

    private _searched: boolean;

    get isChecked(): boolean {
        return this._searched;
    }

    public get isHit() {return this.boardManager.fleet.hasShipLocatedAt(this.position);}

    get hasShip(): boolean {
        return this.shipPart !== undefined;
    }

    public getColor() {
        if (this.isHit) {return "#dc3737";}
        if (this.isChecked) {return "#2651c2";}
        if (this.hasShip) {return "#aaaaaa";}

        return "#00000000";
    }

    public get isClickable() {return this.isChecked}

    public markAsSearched() {
        this._searched = true;
    }

    /** Export the state of this cell for the client rendering */
    public exportState(): CellState {
        return {
            isHit: this.isHit,
            isChecked: this.isChecked,
            hasShip: this.hasShip, // TODO: Put false if it's the enemies board
            pos: this.position.getStringCoordinates()
        }
    }
}