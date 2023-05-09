import {Player} from "@/utils/ORM Entities/Players/Player";
import {GameSession} from "@/utils/ORM Entities/Sessions/GameSession";
import {Err, None, Ok, Option, Result, Some} from "@rustynova/monads";
import {Position} from "@/utils/class/Position";
import {DuelTableHandler} from "@/lib/server/data/session/DuelTableHandler";

enum PlayerTurn {
    playerA,
    playerB,
    none
}

enum TableState {
    starting,
    waitForPlayerMove,
    waitForPlayerA,
    waitForPlayerB,
    endOfTurn,
    finished
}

/** Class that handle a duel of two players */
export class DuelTable {
    playerA: Player;
    playerB: Player;
    session: GameSession;
    duelTableHandler: DuelTableHandler;
    state: TableState = TableState.starting;
    turn: PlayerTurn = PlayerTurn.none;

    constructor(playerA: Player, playerB: Player, session: GameSession, duelTableHandler: DuelTableHandler) {
        this.playerA = playerA;
        this.playerB = playerB;
        this.session = session;
        this.duelTableHandler = duelTableHandler;
    }

    public static new(playerA: Player, playerB: Player, session: GameSession, duelTableHandler: DuelTableHandler): Result<DuelTable, Error> {
        const table = new this(playerA, playerB, session, duelTableHandler);
        return table.link().replaceOk(table);
    }

    /** Change the turn */
    public changeTurn() {
        const winResults = this.getWinResults();
        switch (this.turn) {
        case PlayerTurn.none:
            if (winResults.isSome()) {break;}
            this.turn = PlayerTurn.playerA;
            break;

        case PlayerTurn.playerA:
            if (winResults.isSome()) {
                this.turn = PlayerTurn.none;
            } else {
                this.turn = PlayerTurn.playerB;
            }

            break;

        case PlayerTurn.playerB:
            if (winResults.isSome()) {
                this.turn = PlayerTurn.none;
            } else {
                this.turn = PlayerTurn.playerA;
            }
            break;
        }

        if(winResults.isSome()) {return this.endTable().replaceOk(undefined);}

        return this.updatePlayers().replaceOk(undefined);
    }

    /** Destroy the table and put the remaining players in the queue */
    private endTable() {
        console.log("[Server] > Ending table: ", this.getWinResults());
        return this.duelTableHandler.handleTableEnd(this);
    }

    /** Return the opponent of this player */
    public getOtherPlayer(player: Player): Result<Player, Error> {
        if (player.id === this.playerA.id) {
            return Ok(this.playerB);
        }

        if (player.id === this.playerB.id) {
            return Ok(this.playerA);
        }

        return Err(new Error("Provided player isn't at this duel table"));
    }

    public getWinResults(): Option<{ winner: Player, loser: Player }> {
        if (this.playerA.isDefeated()) {return Some({loser: this.playerA, winner: this.playerB});}
        if (this.playerB.isDefeated()) {return Some({loser: this.playerB, winner: this.playerA});}
        return None;
    }

    /** Handle the move of a player */
    public handleMove(fromPlayer: Player, position: Position) {
        //If(this.state !== TableState.waitForPlayerMove) {return Err("Cannot handle move: The dueltable isn't accepting moves"); }
        console.log(`Player receiving move: ${position.getStringCoordinates()} to player ${fromPlayer.id}`);
        if (!this.isPlayerTurn(fromPlayer)) {return Err(new Error("This isn't the player's turn"));}

        return this
            .getOtherPlayer(fromPlayer)
            .andThen(otherPlayer => otherPlayer.receiveMove(position))
            .inspect(() => this.state = TableState.endOfTurn)
            .andThen(() => this.changeTurn())
            .inspect(() => fromPlayer.getSocket().inspect(socket => socket.updateOpponentBoard()));
    }

    /** Return true if it's this player turn */
    public isPlayerTurn(player: Player): boolean {
        return (player === this.playerA && this.turn === PlayerTurn.playerA) ||
            (player === this.playerB && this.turn === PlayerTurn.playerB);
    }

    public sendTurnState() {
        return Ok(undefined)
            .and(this.playerA.getSocket().inspect(socket => socket.sendTurnState(this.turn === PlayerTurn.playerA)))
            .and(this.playerB.getSocket().inspect(socket => socket.sendTurnState(this.turn === PlayerTurn.playerB)));
    }

    public start() {
        if(this.turn !== PlayerTurn.none) {return;}

        return this.changeTurn();
    }

    /** Set the player's dueltable */
    private link() {
        return this.playerA.setDuelTable(this)
            .andThen(() => this.playerB.setDuelTable(this))
            .inspect(() => this.updatePlayers());
    }

    /** Update the players info */
    private updatePlayers() {
        return Ok(undefined)
            .and(this.playerA.getSocket().inspect(socket => {
                socket.updateTurnState();
                socket.updatePlayerBoard();
                socket.updateLose();
            }))
            .and(this.playerB.getSocket().inspect(socket => {
                socket.updateTurnState();
                socket.updatePlayerBoard();
                socket.updateLose();
            }));
    }
}