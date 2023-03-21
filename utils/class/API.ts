import {GameManager} from "@/utils/objects/GameManager";

export class API {
    public static sendUserShipPlacements(game: GameManager) {
        const shipPlacements = []

        for (const ship of game.userBoard.fleet.ships) {
            shipPlacements.push({

            })
        }
    }
}