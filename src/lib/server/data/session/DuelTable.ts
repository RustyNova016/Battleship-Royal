import {Player} from "@/utils/ORM Entities/Players/Player";
import {GameSession} from "@/utils/ORM Entities/Sessions/GameSession";
import {Err, None, Ok, Option, Result, Some} from "@rustynova/monads";
import {Position} from "@/utils/class/Position";

enum PlayerTurn {
    playerA,
    playerB
}

/** Class that handle a duel of two players */
export class DuelTable {
    playerA: Player;
    playerB: Player;
    session: GameSession;
    turn: PlayerTurn = PlayerTurn.playerA;

    private constructor(playerA: Player, playerB: Player, session: GameSession) {
        this.playerA = playerA;
        this.playerB = playerB;
        this.session = session;
    }

    public sendTurnState() {
        return Ok(undefined)
            .and(this.playerA.getSocket().inspect(socket => socket.sendTurnState(this.turn === PlayerTurn.playerA)))
            .and(this.playerB.getSocket().inspect(socket => socket.sendTurnState(this.turn === PlayerTurn.playerB)));
    }

    /** Set the player's dueltable */
    private link() {
        return this.playerA.setDuelTable(this)
            .andThen(() => this.playerB.setDuelTable(this));
    }

    public static new(playerA: Player, playerB: Player, session: GameSession): Result<DuelTable, Error> {
        const table = new this(playerA, playerB, session);
        return table.link().replaceOk(table);
    }
    
    public getWinResults(): Option<{ winner: Player, loser: Player }> {
        if(this.playerA.isDefeated()) {return Some({loser: this.playerA, winner: this.playerB});}
        if(this.playerB.isDefeated()) {return Some({loser: this.playerB, winner: this.playerA});}
        return None;
    }

    /** Handle the move of a player */
    public handleMove(player: Player, position: Position) {
        return this
            .getOtherPlayer(player)
            .andThen(otherPlayer => otherPlayer.receiveMove(position));
    }

    /** Return the opponent of this player */
    public getOtherPlayer(player: Player): Result<Player, Error> {
        if(player.id === this.playerA.id) {
            return Ok(this.playerB);
        }

        if(player.id === this.playerB.id) {
            return Ok(this.playerA);
        }

        return Err(new Error("Provided player isn't at this duel table"));
    }

    /** Return true if it's this player turn */
    public isPlayerTurn(player: Player): boolean {
        return (player === this.playerA && this.turn === PlayerTurn.playerA) ||
            (player === this.playerB && this.turn === PlayerTurn.playerB);
    }
}