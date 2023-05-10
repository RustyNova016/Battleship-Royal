import {DataTable} from "@/utils/class/ORM/ORM/DataTable";
import {GameSession, SessionState,} from "@/utils/ORM Entities/Sessions/GameSession";
import {createId} from "@paralleldrive/cuid2";
import {Option} from "@rustynova/monads";
import {GamemodesEnum} from "../../../data/GameMode";


export class GameSessionTable extends DataTable<GameSession> {
    /** Return a session that haven't its players maxed */
    public getAInitializingSession(gamemode: GamemodesEnum): Option<GameSession> {
        return this.find(session => session.getState() === SessionState.setUp && session.gamemode === gamemode);
    }

    public getOrCreateSession(gameMode: GamemodesEnum) {
        // TODO: Filter by gamemode
        return this.getAInitializingSession(gameMode).unwrapOrElse(() => this.createSession(gameMode));
    }

    public playerGetSession(userId: string) {
        return this.toValueArray().findAsOption(session => session.hasPlayer(userId));
    }

    public playerQuitSession(userId: string) {
        console.log(`[Sessions] > Player ${userId} quit`);
        return this
            .playerGetSession(userId)
            .map(val => val.removeUser(userId))
            .unwrapOr(false);
    }

    private createSession(gamemodesEnum: GamemodesEnum) {
        const newSession = new GameSession(createId(), gamemodesEnum);
        this.insert(newSession);
        return newSession;
    }
}
