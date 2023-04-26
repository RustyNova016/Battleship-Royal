/** Handles the socket requests */
import {Socket} from "socket.io";
import {ClientToServerEvents, ServerToClientEvents} from "@/lib/SocketIO/events/clientToServerEvents";
import {Err, None, Option, Some} from "@rustynova/monads";
import {Player} from "@/utils/ORM Entities/Players/Player";
import {GameSession} from "@/utils/ORM Entities/Sessions/GameSession";

export class ServerSocketHandler {
    private _socketServer: Option<Socket<ClientToServerEvents, ServerToClientEvents>> = None;
    set socketServer(value: Socket<ClientToServerEvents, ServerToClientEvents>) {
        this._socketServer = Some(value);
    }

    public sendOpponentBoardToClient(player: Player) {
        if(this._socketServer.isNone()) {return this.getNoSocketError();}
        if(player.opponent.isNone()) {return Err( new Error("[Server > Socket > Send Opponent] Player has no opponent set"));}
        const opponent = player.opponent.get();
        if(opponent.board.isNone()) {return Err( new Error("[Server > Socket > Send Opponent] Opponent has no board set"));}


        this._socketServer.get().to(player.id).emit("setOpponentBoard", opponent.board.get().board.getBoardAsOpponent());
        
    }

    private getNoSocketError() {
        return Err(new Error("[Server > Socket] Cannot send request, no socket is provided"));
    }

    public updateClientSession(session: GameSession) {
        session.players.forEach(player => {
            this.socketServer.to(player.id).emit("updateClientSession", session.getData());
        });
    }
}
