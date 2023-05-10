import {GameSession} from "@/utils/ORM Entities/Sessions/GameSession";
import {Player} from "@/utils/ORM Entities/Players/Player";

export class GameServerLogger {
    public static onPlayerQuit(playerId: string) {
        console.info(`[Server > Player] Player ${playerId} quit`);
    }

    public static onSendFleet(playerId: string) {
        console.info(`[Server > Player] Receiving fleet of Player ${playerId}`);
    }

    static onJoinRequest(player: Player) {
        console.info(
            `[Server > Player > Join] Player ${player.id} request to join a session`
        );
    }

    static playerJoin(player: Player, session: GameSession) {
        console.info(
            `[Server > Player > Join] Player ${player.id} joined session ${session.id}`
        );
        console.info(
            `  ∟[Server > Session] Player count: ${session.players.size} / ${session.maxPlayers}`
        );
    }

    static playerLeave(player: Player, session: GameSession) {
        console.info(
            `[Server > Player] Player ${player.id} left session ${session.id}`
        );
    }

    static onSetBoardSuccess(player: Player) {
        console.info(
            `[Server > Player] Successfully set player ${player.id}'s board`
        );
    }
}
