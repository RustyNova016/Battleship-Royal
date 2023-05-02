import {Err, Ok, Result} from "@rustynova/monads";
import {PlayerTable} from "@/utils/ORM Entities/Players/PlayerTable";
import {Player} from "@/utils/ORM Entities/Players/Player";
import {GameServerLogger} from "@/lib/server/GameServerLogger";
import {DuelTableHandler} from "@/lib/server/data/session/DuelTableHandler";

export enum SessionState {
    setUp,
    onGoing,
    ended
}

//TODO: Implement different game-modes
export class GameSession {
    public duelTableHandler = new DuelTableHandler(this);
    public id: string;
    public maxPlayers = 2;
    public players = new PlayerTable();

    constructor(id: string) {
        this.id = id;
    }

    public addPlayerOld(player: Player): Result<GameSession, Error> {
        // Check is the player is already in a different session
        if (!player.isInSession(this) && player.session.isSome()) {return Err(new Error("Player already in another session"));}

        // Check if the lobby is full
        if (this.isFull()) {return Err(new Error("Player count maxed"));}

        // Now that the state is valid, insert the player
        this.players.insert(player);
        this.onPlayerJoin();

        // Then give the session to the player
        return player
            .joinSession(this)
            .inspect(() => this.onSessionUpdate())
            .replaceOk(this);
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
        GameServerLogger.playerJoin(player, this);
        this.onPlayerJoin();
        this.onSessionUpdate();
    }

    /** Handles the refresh of the session on clients */
    private onSessionUpdate() {
        this.players.forEach(player => {
            player.getSocket().inspect(socket => socket.updateSessionData()); // TODO: Use rooms
        });
    }

    private setOpponents() {
        let prevPlayer;

        for (const curPlayer of this.players.values()) {
            if (prevPlayer === undefined) {
                prevPlayer = curPlayer;
                continue;
            }
            if (prevPlayer.opponent.isSome()) {continue;}

            prevPlayer.setOpponent(curPlayer).andThen(() => curPlayer.setOpponent(curPlayer)); //TODO: Handle Errors
        }
    };

    /** Start the session */
    private startSession() {
        console.log(`[Server > Session] Starting Session ${this.id}`);
        this.duelTableHandler.startSession(this.players.toValueArray());
    }
}

export interface GameSessionData {
    id: string;
    playerCount: number;
}
