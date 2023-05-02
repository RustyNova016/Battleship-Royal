import {DataTable} from "@/utils/class/ORM/ORM/DataTable";
import {GameSession, SessionState,} from "@/utils/ORM Entities/Sessions/GameSession";
import {createId} from "@paralleldrive/cuid2";
import {Err, Ok, Option, Result} from "@rustynova/monads";
import {Player} from "@/utils/ORM Entities/Players/Player";
import {GameServerLogger} from "@/lib/server/GameServerLogger";


export class GameSessionTable extends DataTable<GameSession> {
    /** Return a session that haven't its players maxed */
    public getAInitializingSession(): Option<GameSession> {
        return this.find(session => session.getState() === SessionState.setUp);
    }

    /** Make the player join a session. If the player is already in a session, return it */
    public playerJoinSession(playerId: string) {

        const gameSession = this
            .playerGetSession(playerId)
            .orElse(this.getAInitializingSession)
            .unwrapOrElse(this.createSession);

        GameServerLogger.playerJoin(playerId);

        return gameSession.addPlayer();
    }

    public getOrCreateSession(gameMode: string){
        // TODO: Filter by gamemode
        return this.getAInitializingSession().unwrapOrElse(()=> this.createSession());
    }

    private createSession() {
        const newSession = new GameSession(createId());
        this.insert(newSession);
        return newSession;
    }

    /** @deprecated */
    public getGameSessionOfUser_old(userId: string) {
        return this.toValueArray().find(session => session.hasPlayer(userId));
    }
    
    public playerGetSession(userId: string){
        return this.toValueArray().findAsOption(session => session.hasPlayer(userId));
    }

    public playerQuitSession(userId: string) {
        console.log(`[Sessions] > Player ${userId} quit`);
        return this
            .playerGetSession(userId)
            .map(val => val.removeUser(userId))
            .unwrapOr(false);
    }

    public assignPlayerToSession(player: Player): Result<null, Error> {
        if(player.session.isSome()) {return Err(new Error("The player already join a session"));}

        //TODO: Handle gamemode
        this.getOrCreateSession("").addPlayerOld(player);
        return Ok(null);
    }
}
