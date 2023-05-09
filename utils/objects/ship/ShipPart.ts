import {GameBoardCell} from "@/utils/objects/GameBoardCell";
import {PlacedShip} from "@/utils/objects/ship/PlacedShip/PlacedShip";
import {Ok, Result} from "@rustynova/monads";

/** Part of the ship. AKA the portion of a ship at a given cell */
export class ShipPart {
    /** The cell in which the part reside */
    private _cell: GameBoardCell;
    private readonly _ship: PlacedShip;

    private constructor(ship: PlacedShip, cell: GameBoardCell) {
        this._ship = ship;
        this._cell = cell;
    }

    get cell(): GameBoardCell {
        return this._cell;
    }

    get ship(): PlacedShip {
        return this._ship;
    }

    private _isDestroyed = false;

    /** Return true if the part is destroyed */
    get isDestroyed(): boolean {
        return this._isDestroyed;
    }

    /** Return true if the part is placed on the board */
    public get isPlaced() {return this._cell.shipPart.isSomeAnd(cellPart => cellPart.eq(this));}

    /** Create a new ship part */
    public static create(ship: PlacedShip, cell: GameBoardCell): ShipPart {
        return new this(ship, cell);
    }

    public canBePlaced() {return this._cell.canPutShipPart(this);}

    /** Destroy this part of the ship */
    public destroy() {
        this._isDestroyed = true;
    }

    /** Check for equality */
    public eq(other: ShipPart) {
        return this._cell.eq(other._cell)
            && this._ship.eq(other._ship);
    }

    public place(): Result<ShipPart, Error> {
        if (this.isPlaced) {return Ok(this);}
        return this._cell.setShipPart(this).replaceOk(this);
    }
}
