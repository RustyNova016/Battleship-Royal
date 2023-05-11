import {NextApiRequest} from "next";
import {Server, Socket} from "socket.io";
import {NextApiResponseWithSocket} from "../../../lib/SocketIO/Types";
import {ClientToServerEvents, ServerToClientEvents} from "../../../lib/SocketIO/events/clientToServerEvents";
import gameServer from "@/lib/gameServer";

export type SocketServerSide = Socket<ClientToServerEvents, ServerToClientEvents>

export default function handler(
    _: NextApiRequest,
    res: NextApiResponseWithSocket
) {
    if (res.socket.server.io) {
        console.log("[Server Socket] > Socket Server is already running");
    } else {
        console.log("[Server Socket] > Socket Server is initializing");
        const io: Server<ClientToServerEvents, ServerToClientEvents> = new Server(
            res.socket.server,
            {
                cors: {
                    origin: "http://localhost:3000"
                },
                connectionStateRecovery: {
                    // The backup duration of the sessions and the packets
                    maxDisconnectionDuration: 2 * 60 * 1000,
                    // Whether to skip middlewares upon successful recovery
                    skipMiddlewares: false,
                },
            }
        );
        console.log(`[Socket] > Initialized at ${io.path()}`);

        io.on("connection", (socket) => {
            gameServer.players.getOrCreate(socket.id).setSocket(socket, io);

            // Initialize Game Server Socket
            gameServer.socket.socketServer = socket;
        });

        res.socket.server.io = io;
    }
    res.end();
}
