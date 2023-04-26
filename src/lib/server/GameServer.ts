import {GameSessionTable} from "@/utils/ORM Entities/Sessions/GameSessionTable";
import {UserBoard} from "@/utils/ORM Entities/UserBoard/UserBoard";
import {PlayerTable} from "@/utils/ORM Entities/Players/PlayerTable";
import {GameServerLogger} from "@/srcLib/server/GameServerLogger";
import {Err, Result, Some} from "@rustynova/monads";
import {Socket} from "socket.io";
import {ClientToServerEvents, ServerToClientEvents,} from "@/lib/SocketIO/events/clientToServerEvents";
import {GameSession} from "@/utils/ORM Entities/Sessions/GameSession";
import {ServerSocketHandler} from "@/lib/server/ServerSocketHandler";
import {Player} from "@/utils/ORM Entities/Players/Player";

/** Class that represent the game server */
export class GameServer {
    private _socket = new ServerSocketHandler();
    private _sessions = new GameSessionTable();
    private _players = new PlayerTable();


    get socket(): ServerSocketHandler {
        return this._socket;
    }

    get sessions(): GameSessionTable {
        return this._sessions;
    }

    get players(): PlayerTable {
        return this._players;
    }

    set socketServer(value: Socket<ClientToServerEvents, ServerToClientEvents>) {
        this._socketServer = Some(value);
    }

    /** Make the user join a session */
    public joinSession(gamemode: string, userBoard: UserBoard) {
        return this._players
            // Get the player obj
            .getOrCreate(userBoard.userId)

            // Associate the board to the player
            .setBoard(userBoard)

            // Make the player join the session
            .map((player) => {
                const session = this._sessions.getOrCreateSession(gamemode);
                return session.addPlayer(player).inspect(() => GameServerLogger.playerJoin(player, session));
            });
    }

    public matchMaker(gamemode: string, player: Player): Result<GameSession, Error> {
        console.log("Player board: ", player.board);
        if(player.board.isNone()) {
            console.log(`[Session] > The player ${player.id} didn't provide a board before trying to join a session`);
            return Err(new Error("[Session] > The player didn't provide a board before trying to join a session"));}
        return this._sessions
            .getOrCreateSession(gamemode)
            .addPlayer(player)
            .inspect((session) => GameServerLogger.playerJoin(player, session));
    }

    /** Start a session */
    public startSession(session: GameSession) {
        // Announce to all players their new opponents
    }
}

