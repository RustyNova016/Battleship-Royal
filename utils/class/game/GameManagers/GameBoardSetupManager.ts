import {GameBoardManager} from "@/utils/class/game/GameManagers/GameBoardManager";
import {Position} from "@/utils/class/Position";
import {Direction} from "@/utils/objects/ship/Fleet";
import {ShipType} from "@/utils/objects/ship/shiptype/ShipType";
import {Collection} from "@/utils/class/Collection";
import {Option, Result, Some} from "@rustynova/monads";
import {PlacedShip} from "@/utils/objects/ship/PlacedShip/PlacedShip";

/** Handles the ship placement logic */
export class GameBoardSetupManager extends GameBoardManager {
    public shipsToPlace;

    constructor(shipsToPlace: ShipType[]) {
        super();
        this.shipsToPlace = new Collection(...shipsToPlace);
    }

    private getNextShip(): Option<ShipType> {
        return Some(this.shipsToPlace[0]);
    }

    /** Place the ship on the board. Return true if it worked, false if not */
    public handlePlacement(pos: Position, direction: Direction): Result<PlacedShip, Error> {
        return this
            .getNextShip()
            .okOr(new Error("Error: Cannot place a new ship when there's none left to place"))
            .inspect(ship => console.log(`Placing ship: ${ship.name}`))
            .andThen(shipType => this.placeShip(shipType, pos, direction))
            .inspect(ship => {
                console.log(`Succefully placed ship: ${ship}`);
                this.shipsToPlace.removeAt(0);
            });
    }
}
