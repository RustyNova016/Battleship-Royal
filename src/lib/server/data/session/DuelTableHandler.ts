import {GameSession} from "@/utils/ORM Entities/Sessions/GameSession";
import {Collection} from "@/utils/class/Collection";
import {Player} from "@/utils/ORM Entities/Players/Player";
import {Ok} from "@rustynova/monads";
import {DuelTable} from "@/lib/server/data/session/DuelTable";

export class DuelTableHandler {
    public duelTables: DuelTable[] = [];
    public queue: Collection<Player> = new Collection<Player>();
    public session: GameSession;

    constructor(session: GameSession) {
        this.session = session;
    }

    public handleTableWin(duelTable: DuelTable) {
        const results = duelTable.getWinResults();
        if (results.isNone()) {return;}

        this.queue.push(results.get().winner);
    }

    public startSession(queue: Collection<Player>) {
        this.queue = queue;

        this.processQueue().unwrap();
        this.duelTables.forEach(table => table.sendTurnState());
    }

    /** Put all the players in the queue into dueltables */
    private processQueue() {
        while (this.queue.length >= 2) {
            const playerA = this.queue.at(0).unwrap(); // We loop if the array has at least 2 elements, so index 0 and 1 are defined
            const playerB = this.queue.at(1).unwrap(); // So, unwrapping here is safe

            const newDuelTable = DuelTable.new(playerA, playerB, this.session);
            if (newDuelTable.isErr()) {return newDuelTable;}

            this.duelTables.push(newDuelTable.unwrap()); //TODO: Put .get() once the package is fixed
        }
        return Ok(undefined);
    }
}