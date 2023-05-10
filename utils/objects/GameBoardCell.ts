import {GameBoardManager} from "@/utils/class/game/GameManagers/GameBoardManager";
import {Position} from "@/utils/class/Position";
import {GameBoard} from "@/utils/objects/GameBoard";
import {ShipPart} from "@/utils/objects/ship/ShipPart";
import {CellState} from "@/utils/class/game/BoardManagers/CellState";
import {Err, None, Ok, Option, Result, Some} from "@rustynova/monads";

export class GameBoardCell {
    /** All the board information */
    boardManager: GameBoardManager;

    /** Board in which the cell resides */
    gameBoard: GameBoard;

    /** Position on the board */
    position: Position;

    /** The part of a ship that the cell contains */
    shipPart: Option<ShipPart> = None;
    private _searched: boolean;

    constructor(position: Position, gameBoard: GameBoard, boardManager: GameBoardManager) {
        this._searched = false;
        this.position = position;
        this.gameBoard = gameBoard;
        this.boardManager = boardManager;
    }

    get containShip(): boolean {
        return this.shipPart.isSome();
    }

    public get id() {return this.position.getStringCoordinates();}

    get isSearched(): boolean {
        return this._searched;
    }

    public canPutShipPart(shipPart: ShipPart): boolean {
        return this.shipPart.isNoneOr(curShipPart => curShipPart.eq(shipPart));
    }

    /** Check for equality */
    public eq(other: GameBoardCell) {
        return this.position.Eq(other.position);
    }

    /** Export the state of this cell for the client rendering */
    public exportState(): CellState {
        return {
            isSearched: this.isSearched,
            hasShip: this.containShip,
            pos: this.position.getStringCoordinates()
        };
    }

    /** Retrieve the state of the cell seen as a opponent */
    public getInfoAsOpponent(): CellState {
        return {
            pos: this.position.getStringCoordinates(),
            isSearched: this.isSearched,
            hasShip: this.containShip && this.isSearched
        };
    }

    public markAsSearched(): Result<undefined, Error> {
        if (this._searched) {return Err(new Error(`Cannot set cell ${this.position.getStringCoordinates()} as searched because it is already searched`));}
        this._searched = true;
        return Ok(undefined);
    }

    public setShipPart(shipPart: ShipPart): Result<GameBoardCell, Error> {
        if (this.containShip) {return Err(new Error("Cannot insert ShipPart. The cell already contain a ship"));}
        this.shipPart = Some(shipPart);
        return Ok(this);
    }
}
