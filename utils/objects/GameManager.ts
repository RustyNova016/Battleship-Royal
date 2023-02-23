import {GameBoard} from "@/utils/objects/GameBoard";
import {GameBoardCell} from "@/utils/objects/GameBoardCell";
import {Direction} from "@/utils/objects/ship/Fleet";
import {ShipType} from "@/utils/objects/ship/ShipType";

export type GameState = "setUp"

export class GameManager {
    public idBoardOwner: string
    public userBoard: GameBoard;
    public shipPlacementDirection: Direction = "up";

    constructor(userShipTypes: ShipType[]) {
        this.userBoard = new GameBoard();
        this.userBoard.fleet.availableShipTypes = userShipTypes;
    }

    get state(): GameState {
        if (!this.userBoard.isBoardReady) {
            return "setUp"
        }
    }

    public handleClick(atCell: GameBoardCell) {
        switch (this.state) {
            case "setUp":
                this.userBoard.fleet.placeNextType(atCell.position, this.shipPlacementDirection)
        }
    }
}