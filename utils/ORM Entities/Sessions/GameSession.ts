import {Err, Ok, Result} from "@rustynova/monads";
import {PlayerTable} from "@/utils/ORM Entities/Players/PlayerTable";
import {Player} from "@/utils/ORM Entities/Players/Player";
import {GameServerLogger} from "@/lib/server/GameServerLogger";
import {DuelTableHandler} from "@/lib/server/data/session/DuelTableHandler";
import {GameSessionORM} from "@/prisma/ORM/GameSessionORM";
import {GamemodesEnum, getGamemodeData} from "../../../data/GameMode";

export enum SessionState {
    setUp,
    onGoing,
    ended
}

//TODO: Implement different game-modes
export class GameSession {
    public duelTableHandler = new DuelTableHandler(this);
    public readonly gamemode: GamemodesEnum;
    public id: string;
    public players = new PlayerTable();
    public state = SessionState.setUp;

    constructor(id: string, gamemode: GamemodesEnum) {
        this.id = id;
        this.gamemode = gamemode;
        GameSessionORM.saveSession(this);
    }

    get maxPlayers() {
        return getGamemodeData(this.gamemode).maxPlayers;
    }

    public endSession() {
        this.state = SessionState.ended;
        GameSessionORM.saveSession(this);
    }

    public getData(): GameSessionData {
        return {
            id: this.id,
            playerCount: this.players.size
        };
    }

    /** Retrieve a player's board */
    public getPlayerBoard(idPlayer: string) {
        return this.players.get_asOption(idPlayer);
    }

    public getState(): SessionState {
        if (this.players.size < this.maxPlayers) {
            return SessionState.setUp;
        }

        return SessionState.onGoing;
    }

    public handleJoinRequest(player: Player): Result<GameSession, Error> {
        // Check is the player is already in a different session
        if (!player.isInSession(this) && player.session.isSome()) {return Err(new Error("Player already in another session"));}

        // Check if the lobby is full
        if (this.isFull()) {return Err(new Error("Player count maxed"));}

        this.addPlayer(player);

        return Ok(this);
    }

    /** Return true if the session contains this player
     *  ⚠ It doesn't check if the Player knows that this session is his
     * */
    public hasPlayer(player: Player) {
        return this.players.hasItem(player);
    }

    public isFull() {
        return this.players.size === this.maxPlayers;
    }

    /** Runs when a player join the session */
    public onPlayerJoin() {
        // Update all the player's sessions
        this.players.forEach(player => {
            player.getSocket().inspect(socket => socket.updateSessionData());
        });


        // If the Session is full, start the game
        console.log("Player Size", this.players.size);
        if (this.players.size === this.maxPlayers) {
            this.startSession();
        }
    }

    public playerQuit(player: Player) {
        player.resetSession();
        return this.players.delete(player.id);
    }

    /** Remove a user from the session */
    public removeUser(idPlayer: string) {
        return this
            .getPlayerBoard(idPlayer)
            .map(board => this.players.delete(board.id))
            .unwrapOr(false);
    }

    /** Add a player to the session */
    private addPlayer(player: Player) {
        this.players.insert(player);
        player.setSession(this);

        GameServerLogger.playerJoin(player, this);
        this.onSessionUpdate();
        this.onPlayerJoin();
    }

    /** Handles the refresh of the session on clients */
    private onSessionUpdate() {
        this.players.forEach(player => {
            player.getSocket().inspect(socket => socket.updateSessionData()); // TODO: Use rooms
        });
    }

    /** Start the session */
    private startSession() {
        console.log(`[Server > Session] Starting Session ${this.id}`);
        this.state = SessionState.onGoing;
        this.duelTableHandler.startSession(this.players.toValueArray());
        GameSessionORM.saveSession(this);
    }
}

export interface GameSessionData {
    id: string;
    playerCount: number;
}
