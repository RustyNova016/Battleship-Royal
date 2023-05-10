/** Handles the socket requests */
import {Socket} from "socket.io";
import {ClientToServerEvents, ServerToClientEvents} from "@/lib/SocketIO/events/clientToServerEvents";
import {None, Option, Some} from "@rustynova/monads";
import {GameSession} from "@/utils/ORM Entities/Sessions/GameSession";

export class ServerSocketHandler {
    private _socketServer: Option<Socket<ClientToServerEvents, ServerToClientEvents>> = None;
    set socketServer(socket: Socket<ClientToServerEvents, ServerToClientEvents>) {
        this._socketServer = Some(socket);
    }
    public updateClientSession(session: GameSession) {
        session.players.forEach(player => {
            this.socketServer.to(player.id).emit("updateClientSession", session.getData());
        });
    }
}
