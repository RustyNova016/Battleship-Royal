import {SocketServerSide} from "@/pages/api/socketio";
import {Player} from "@/utils/ORM Entities/Players/Player";
import {Position} from "@/utils/class/Position";
import {CellState} from "@/utils/class/game/BoardManagers/CellState";
import {GameServerLogger} from "@/lib/server/GameServerLogger";
import {
    SerializedFleet,
    ShipPlacementSerialized,
    ShipUnSerializationError
} from "@/utils/class/game/ShipManagers/ShipPlacementSerialized";
import {Err, Result} from "@rustynova/monads";
import {GameBoardManager} from "@/utils/class/game/GameManagers/GameBoardManager";
import {PipoRiskyLoop} from "../../../lib/Pipo/PipoRiskyLoop";
import gameServer from "@/lib/gameServer";
import {GameSessionData} from "@/utils/ORM Entities/Sessions/GameSession";
import {ResultSerialized} from "@rustynova/monads/lib/result/result";
import {QueueProcessor} from "@/utils/QueueProcessor";
import {Server} from "socket.io";
import {ClientToServerEvents, ServerToClientEvents} from "../../../lib/SocketIO/events/clientToServerEvents";
import {GamemodesEnum} from "../../../data/GameMode";

export class PlayerSocket {
    private readonly IO: Server<ClientToServerEvents, ServerToClientEvents>;
    private readonly player: Player;
    private queue: QueueProcessor;
    private readonly socket: SocketServerSide;

    constructor(socket: SocketServerSide, player: Player, IO: Server<ClientToServerEvents, ServerToClientEvents>) {
        this.socket = socket;
        this.setUpReceiveEvent();
        this.player = player;
        this.queue = new QueueProcessor();
        this.IO = IO;
    }

    onNewDuelTable() {
        return this.updateOpponentBoard()
            .and(this.updateTurnState())
            .and(this.updatePlayerBoard());
    }

    /** Send the turn state to the client */
    public sendTurnState(isPlayerTurn: boolean) {
        console.log(`> Sending turn state to ${this.player.id}`);
        this.IO.to(this.socket.id).emit("isPlayerTurn", isPlayerTurn);
    }

    public updateLose() {
        return this.player
            .getBoard()
            .map(board => board.isDefeated())
            .inspect(isDefeated => (isDefeated ? this.sendLoseEvent(isDefeated) : undefined));
    }

    public updateOpponentBoard() {
        return this.player.getDuelTable()
            .andThen(table => table.getOtherPlayer(this.player))
            .andThen(opponent => opponent.getBoard())
            .map(board => board.board.getBoardAsOpponent())
            .inspect(boardState => this.sendOpponentBoard(boardState));
    }

    public updatePlayerBoard() {
        return this.player
            .getBoard()
            .inspect(board => this.sendPlayerBoard(board.board.exportState()));
    }

    /** Send the current session data to the client */
    public updateSessionData() {
        return this.player.getSession()
            .inspect(session => {
                this.sendSessionData(session.getData());
            }); //TODO: On error: Emit Clear Session
    }

    public updateTurnState() {
        return this.player.getDuelTable()
            .map(table => table.isPlayerTurn(this.player))
            .inspect(isTurn => this.sendTurnState(isTurn));
    }

    public updateWin() {
        return this.player
            .getBoard()
            .map(board => board.isDefeated())
            .inspect(isDefeated => (!isDefeated ? this.sendWinEvent(!isDefeated) : undefined));
    }

    private clientIO() {
        return this.IO.to(this.player.id);
    }

    /** Make the player join a session */
    private onJoinSession(shipsSerialized: SerializedFleet, gamemode: GamemodesEnum) {
        GameServerLogger.onJoinRequest(this.player);
        return this
            .saveSerializedFleet(shipsSerialized)
            .andThen(() => {
                return gameServer
                    .sessions
                    .getOrCreateSession(gamemode)
                    .handleJoinRequest(this.player)
                    .andThen(session => this.player.setSession(session));
            })
            .mapErr(err => {
                console.log(err);
                return err;
            });
    }

    private onQuitSession() {
        GameServerLogger.onPlayerQuit(this.player.id);
        this.player
            .session
            .okOr(`Cannot quit empty session for player ${this.player.id}`)
            .map(session => { session.playerQuit(this.player);});
    }

    private onReceiveMove(pos: Position) {
        this.player.getDuelTable()
            .andThen(dueltable => dueltable.handleMove(this.player, pos))
            .unwrap(); //Throw Error
    }

    private queueJoinSession(ships: ShipPlacementSerialized[], gamemode: GamemodesEnum, res: (result: ResultSerialized<GameSessionData, string>) => void) {
        this.queue.addToQueue(() => {
            res(this.onJoinSession(ships, gamemode)
                .map(session => session.getData())
                .mapErr(err => err.message).serialize());
        });
    }

    private queueQuitSession() {
        this.queue.addToQueue(() => this.onQuitSession());
    }

    private queueReceiveMove(posX: number, posY: number) {
        this.queue.addToQueue(() => {
            this.onReceiveMove(new Position(posX, posY));
        });
    }

    private saveSerializedFleet(shipsSerialized: SerializedFleet): Result<boolean, Error> {
        if (shipsSerialized.length < 4) {return Err(ShipUnSerializationError.getShipNumberError(shipsSerialized));}
        const newBoard = new GameBoardManager();

        return PipoRiskyLoop
            .enter<ShipPlacementSerialized>(shipsSerialized)
            .forEach((ship) => newBoard.placeSerializedShip(ship))
            .andThen(() => this.player.setBoard(newBoard))
            .replaceOk(true);
    }

    private sendLoseEvent(val: boolean) {
        this.clientIO().emit("isLoser", val);
    }

    /** Send the opponent's board to the client */
    private sendOpponentBoard(opponentBoard: CellState[]) {
        console.log(`> Sending opponent board to ${this.player.id}`);
        this.IO.to(this.socket.id).emit("setOpponentBoard", opponentBoard);
    }

    private sendPlayerBoard(playerBoard: CellState[]) {
        console.log(`> Sending player board to ${this.player.id}`);
        this.clientIO().emit("setPlayerBoard", playerBoard);
    }

    private sendSessionData(session: GameSessionData) {
        return this.clientIO().emit("updateClientSession", session);
    }

    private sendWinEvent(val: boolean) {
        this.clientIO().emit("isWinner", val);
    }

    private setUpReceiveEvent() {
        this.socket.on("sendMove", (posX, posY) => this.queueReceiveMove(posX, posY));
        this.socket.on("quitSession", () => this.queueQuitSession());
        this.socket.on("joinSession", (ships, gamemode, res) => this.queueJoinSession(ships, gamemode, res));
    }
}