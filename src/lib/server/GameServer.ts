import {GameSessionTable} from "@/utils/ORM Entities/Sessions/GameSessionTable";
import {ServerSocketHandler} from "@/lib/server/ServerSocketHandler";
import {PlayerTable} from "@/utils/ORM Entities/Players/PlayerTable";

/** Class that represent the game server */
export class GameServer {
    private _players = new PlayerTable();
    private _sessions = new GameSessionTable();
    private _socket = new ServerSocketHandler();

    get players(): PlayerTable {
        return this._players;
    }

    get sessions(): GameSessionTable {
        return this._sessions;
    }

    get socket(): ServerSocketHandler {
        return this._socket;
    }
}

