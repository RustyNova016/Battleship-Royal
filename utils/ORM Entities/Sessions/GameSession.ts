import {UserBoardTable} from "@/utils/ORM Entities/UserBoard/UserBoardTable";
import {UserBoard} from "@/utils/ORM Entities/UserBoard/UserBoard";
import {OneToOneRelation} from "@/lib/ORMUtils/Relations/OneToOneRelation";
import {Err, Ok, Result} from "@rustynova/monads";


export enum SessionState {
    setUp,
    onGoing,
    ended
}

//TODO: Implement different game-modes
export class GameSession {
    public id: string;
    public userBoards: UserBoardTable = new UserBoardTable();
    public opponentMap = new OneToOneRelation(this.userBoards, this.userBoards);
    public maxPlayers = 2;

    constructor(id: string) {
        this.id = id;
    }

    /** Add a player to the session */
    public addPlayer(userBoard: UserBoard): Result<GameSession, Error> {
        if (this.userBoards.size === this.maxPlayers) {return Err(new Error("Player count maxed"));}
        if (this.containUser(userBoard.userId)) {return Ok(this);}

        this.userBoards.insert(userBoard);
        return Ok(this);
    }

    public containUser(userId: string) {
        return this.userBoards.matchOne(userBoard => userBoard.userId === userId);
    }

    /** Get the board of the opponent to the player */
    public getOpponentBoard(idPlayer: string) {
        return this.opponentMap.getFromLeftTable(idPlayer);
    }

    /** Retrieve a player's board */
    public getPlayerBoard(idPlayer: string) {
        return this.userBoards.get_asOption(idPlayer);
    }

    public getState(): SessionState {
        if (this.userBoards.size < this.maxPlayers) {
            return SessionState.setUp;
        }

        return SessionState.onGoing;
    }

    /** Remove a user from the session */
    public removeUser(idPlayer: string) {
        return this
            .getPlayerBoard(idPlayer)
            .map( board => this.userBoards.delete(board.id))
            .unwrapOr(false);
    }
}
