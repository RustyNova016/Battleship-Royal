import {GameBoardManager} from "@/utils/class/game/GameManagers/GameBoardManager";
import {GameSession} from "@/utils/ORM Entities/Sessions/GameSession";
import {ShipPlacementSerialized} from "@/utils/class/game/ShipManagers/ShipPlacementSerialized";
import {PlacedShip} from "@/utils/objects/ship/PlacedShip/PlacedShip";
import {GameServerLogger} from "@/lib/server/GameServerLogger";
import {Err, None, Ok, Option, Result, Some} from "@rustynova/monads";
import {DuelTable} from "@/lib/server/data/session/DuelTable";
import {Position} from "@/utils/class/Position";
import {PlayerSocket} from "@/lib/server/PlayerSocket";
import {SocketServerSide} from "@/pages/api/socketio";
import {Server} from "socket.io";
import {ClientToServerEvents, ServerToClientEvents} from "../../../lib/SocketIO/events/clientToServerEvents";


export class Player {
    private _board: Option<GameBoardManager> = None;
    private _duelTable: Option<DuelTable> = None;
    private readonly _id: string;
    private _opponent: Option<Player> = None;
    private _session: Option<GameSession> = None;
    private _socket: Option<PlayerSocket> = None;

    constructor(id: string) {
        this._id = id;
    }

    get board(): Option<GameBoardManager> {
        return this._board;
    }

    get duelTable(): Option<DuelTable> {
        return this._duelTable;
    }

    get id(): string {
        return this._id;
    }

    get opponent() {
        return this._opponent;
    }

    get session(): Option<GameSession> {
        return this._session;
    }

    public createBoard(ships: ShipPlacementSerialized[]) {
        const newBoard = new GameBoardManager();

        ships.map(seriShip => PlacedShip.unserializePlace(seriShip, newBoard));
        return this.setBoard(newBoard);
    }

    public getBoard(): Result<GameBoardManager, Error> {
        return this._board.okOr(new Error(`Cannot get player ${this._id}'s board. The board isn't set`));
    }

    public getDuelTable(): Result<DuelTable, Error> {
        return this._duelTable.okOr(new Error(`Cannot get player ${this._id}'s dueltable. The player isn't assigned to any table`));
    }

    public getSession(): Result<GameSession, Error> {
        return this._session.okOr(new Error(`Cannot get player ${this._id}'s session. No Session have been assigned`));
    }

    public getSocket(): Result<PlayerSocket, Error> {
        return this._socket.okOr(new Error(`Cannot get player ${this._id}'s socket. The socket isn't set`));
    }

    public isDefeated() {
        return this.board.isSomeAnd(board => board.fleet.isDefeated());
    }

    /** Return true if the player is in the session
     * ⚠ It doesn't check if the Session knows that this player is in the session
     * */
    public isInSession(session: GameSession) {
        return this.session.isSomeAnd(thisSession => thisSession.id === session.id);
    }

    public joinSession(session: GameSession): Result<Player, Error> {
        // Check if the session has us
        if (!session.hasPlayer(this)) {return Err(new Error("Player isn't in this session"));}

        this.setSession(session);
        return Ok(this);
    }

    public receiveMove(atPos: Position): Result<undefined, Error> {
        return this._board
            .okOr(new Error("Cannot receive move: Player has no board"))
            .andThen(board => board.handleHit(atPos));
    }

    public resetSession() {
        this._session = None;
    };

    public setBoard(board: GameBoardManager): Result<Player, Error> {
        if (this._session.isSome()) {return Err(new Error("Cannot change board while in a game"));}
        this._board = Some(board);
        GameServerLogger.onSetBoardSuccess(this);
        return Ok(this);
    }

    public setDuelTable(duelTable: DuelTable) {
        if (this.session.isNoneOr(session => duelTable.session.id !== session.id)) {return Err(new Error(`Cannot set dueltable. The player is not in session ${duelTable.session.id}`));}
        this._duelTable = Some(duelTable);

        return this.getSocket().andThen(socket => socket.onNewDuelTable());
    }

    setOpponent(newOpponent: Player) {
        if (newOpponent._opponent.isSomeAnd(opponent => opponent._id !== this._id)) {return Err("Cannot set newOpponent as opponent. newOpponent already have an opponent");}
        if (this._opponent.isSomeAnd(opponent => opponent._id !== newOpponent._id)) {return Err("Cannot set player as opponent. Player already have an opponent");}
        this._opponent = Some(newOpponent);
        return Ok(undefined);
    }

    /** Set the session of the player */
    public setSession(session: GameSession): Result<GameSession, Error> {
        // Check if the session has us
        if (!session.hasPlayer(this)) {return Err(new Error("Player isn't in this session"));}

        this._session = Some(session);
        return this.getSocket().andThen(socket => socket.updateSessionData());
    }

    public setSocket(value: SocketServerSide, IO: Server<ClientToServerEvents, ServerToClientEvents>) {
        this._socket = Some(new PlayerSocket(value, this, IO));
    }
}

