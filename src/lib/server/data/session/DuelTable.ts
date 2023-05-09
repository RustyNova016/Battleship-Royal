import {Player} from "@/utils/ORM Entities/Players/Player";
import {GameSession} from "@/utils/ORM Entities/Sessions/GameSession";
import {Err, None, Ok, Option, Result, Some} from "@rustynova/monads";
import {Position} from "@/utils/class/Position";

enum PlayerTurn {
    playerA,
    playerB
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
    turn: PlayerTurn = PlayerTurn.playerA;
    state: TableState = TableState.starting;

    private constructor(playerA: Player, playerB: Player, session: GameSession) {
        this.playerA = playerA;
        this.playerB = playerB;
        this.session = session;
    }

    private handleState() {
        switch (this.state) {
        case TableState.starting:
            break;
        case TableState.waitForPlayerMove:
            break;
        case TableState.endOfTurn:

        }
    }

    public static new(playerA: Player, playerB: Player, session: GameSession): Result<DuelTable, Error> {
        const table = new this(playerA, playerB, session);
        return table.link().replaceOk(table);
    }

    /** Change the turn */
    public changeTurn() {

        // Change the turn
        if (this.turn === PlayerTurn.playerA) {
            console.log("[DuelTable] > Changing turn");
            this.turn = PlayerTurn.playerB;
        } else {
            this.turn = PlayerTurn.playerA;
        }



        const winResults = this.getWinResults();
        if (winResults.isSome()) {
            return Ok(undefined)
                .andThen(() => winResults.get().winner.getSocket().andThen());
        }

        return this.playerA.getSocket().inspect(socket => {
            socket.updateTurnState();
            socket.updatePlayerBoard();
        })
            .andThen(() => this.playerB.getSocket().inspect(socket => {
                socket.updateTurnState();
                socket.updatePlayerBoard();
            }));
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
        if(this.state !== TableState.waitForPlayerMove) {return Err("Cannot handle move: The dueltable isn't accepting moves"); }
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

    //Public onEndOfTurn() {
    //    Return this.changeTurn().andThen(() => {
    //        This.getWinResults().isSome()
    //    })
    //}

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

    /** Update the players info */
    private updatePlayers() {
        return Ok(undefined)
            .and(this.playerA.getSocket().inspect(socket => {
                socket.updateTurnState();
                socket.updatePlayerBoard();
            }))
            .and(this.playerB.getSocket().inspect(socket => {
                socket.updateTurnState();
                socket.updatePlayerBoard();
            }));
    }
}