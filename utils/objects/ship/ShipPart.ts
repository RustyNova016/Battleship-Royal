import {GameBoardCell} from "@/utils/objects/GameBoardCell";
import {PlacedShip} from "@/utils/objects/ship/PlacedShip";

/** Part of the ship. AKA the portion of a ship at a given cell */
export class ShipPart {
    /** The cell in which the part reside */
    public cell: GameBoardCell;
    //TODO: Make sprites where this actually matter
    connections: ["up"?, "right"?, "down"?, "left"?];
    public ship: PlacedShip;

    constructor(ship: PlacedShip, cell: GameBoardCell, connections: ["up"?, "right"?, "down"?, "left"?]) {
        this.ship = ship
        this.ship.parts.push(this)
        this.cell = cell;
        this.cell.shipPart = this
        this.connections = connections;
    }

    private _destroyed = false

    get destroyed(): boolean {
        return this._destroyed;
    }

    public destroy() {
        this._destroyed = true;
    }
}