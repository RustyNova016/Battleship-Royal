import {GameBoardManager} from "@/utils/class/game/GameManagers/GameBoardManager";
import {Position} from "@/utils/class/Position";
import {Direction} from "@/utils/objects/ship/Fleet";
import {ShipType} from "@/utils/objects/ship/shiptype/ShipType";

/** Handles the ship placement logic */
export class GameBoardSetupManager extends GameBoardManager {
    public shipsToPlace;

    constructor(shipsToPlace: ShipType[]) {
        super();
        this.shipsToPlace = shipsToPlace;
    }

    /** Place the ship on the board. Return true if it worked, false if not */
    handlePlacement(pos: Position, direction: Direction): boolean {
        const newShip = this.shipsToPlace[0];
        if(newShip === undefined) {throw new Error("Error: Cannot place a new ship when there's none left to place")}

        this.placeShip(newShip, pos, direction)
    }
}