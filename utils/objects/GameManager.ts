import {GameBoard} from "@/utils/objects/GameBoard";
import {GameBoardCell} from "@/utils/objects/GameBoardCell";
import {Direction, Fleet} from "@/utils/objects/ship/Fleet";
import {ShipType} from "@/utils/objects/ship/shiptype/ShipType";
import {BoardDisplay} from "@/utils/objects/DisplayBoard/BoardDisplay";

export type GameState = "setUp"



export class GameManager {
    public idBoardOwner: string;
    public userBoard: GameBoard;
    public shipPlacementDirection: Direction = "up";

    constructor(userShipTypes: ShipType[]) {
        this.userBoard = new GameBoard();
        this.userBoard.fleet.availableShipTypes = userShipTypes;
    }

    get state() {
        if (!this.userBoard.isBoardReady) {
            return "setup"
        }
    }

    /** Return the display data for the board */
    public getBoardData() {
        return new BoardDisplay()
    }

    public handleClick(atCell: GameBoardCell) {
        switch (this.state) {
            case "setup":
                this.userBoard.fleet.placeNextType(atCell.position, this.shipPlacementDirection);
                if(this.userBoard.isBoardReady) {}
        }
    }
}

export class PlayerData {
    /** All the ships owned by the player */
    public fleet: Fleet;
}

export class EnemyData {
    /** Cells that have been discovered and publicly known */
    public discoveredCells;
    public playerId: string
}

