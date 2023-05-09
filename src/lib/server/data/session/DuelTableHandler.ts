import {GameSession} from "@/utils/ORM Entities/Sessions/GameSession";
import {Collection} from "@/utils/class/Collection";
import {Player} from "@/utils/ORM Entities/Players/Player";
import {Err, Ok} from "@rustynova/monads";
import {DuelTable} from "@/lib/server/data/session/DuelTable";

export class DuelTableHandler {
    public duelTables: Collection<DuelTable> = new Collection<DuelTable>();
    public queue: Collection<Player> = new Collection<Player>();
    public session: GameSession;

    constructor(session: GameSession) {
        this.session = session;
    }

    public handleTableEnd(duelTable: DuelTable) {
        const results = duelTable.getWinResults();
        if (results.isNone()) {return Err(new Error("Cannot end a table with no winner"));}

        this.queue.push(results.get().winner);
        this.duelTables.remove(duelTable);
        return this.processQueue();
    }

    public startSession(queue: Collection<Player>) {
        this.queue = queue;

        this.processQueue().unwrap();
        this.duelTables.forEach(table => table.sendTurnState());
    }

    /** Put all the players in the queue into dueltables */
    private processQueue() {
        if(this.queue.length < 2 && this.duelTables.length === 0) {return this.handleSessionEnd();}

        while (this.queue.length >= 2) {
            const playerA = this.queue.at(0).unwrap(); // We loop if the array has at least 2 elements, so index 0 and 1 are defined
            const playerB = this.queue.at(1).unwrap(); // So, unwrapping here is safe

            const newDuelTable = DuelTable.new(playerA, playerB, this.session, this);
            if (newDuelTable.isErr()) {return newDuelTable;}

            this.duelTables.push(newDuelTable.unwrap()); //TODO: Put .get() once the package is fixed
            this.queue.splice(0, 2);
        }

        this.duelTables.forEach(table => table.start());

        return Ok(undefined);
    }

    private handleSessionEnd(){
        return this.queue
            .at(0)
            .okOr(new Error("No Player remaining"))
            .andThen(player => player.getSocket())
            .andThen(socket => socket.updateWin());
    }
}