import {NextApiRequest} from "next";
import {Server} from "socket.io";
import {Position} from "@/utils/class/Position";
import {NextApiResponseWithSocket} from "../../../lib/SocketIO/Types";
import {ClientToServerEvents, ServerToClientEvents} from "../../../lib/SocketIO/events/clientToServerEvents";
import gameServer from "@/lib/gameServer";
import {GameServerLogger} from "@/lib/server/GameServerLogger";
import {GameServerSocket} from "@/lib/client/GameServerSocket";

export default function handler(
    _: NextApiRequest,
    res: NextApiResponseWithSocket
) {
    //If (res.socket.server.io) {
    //    Console.log("[Server Socket] > Socket is already running");
    //} else {
    console.log("[Server Socket] > Socket is initializing");
    const io: Server<ClientToServerEvents, ServerToClientEvents> = new Server(
        res.socket.server,
        {
            connectionStateRecovery: {
                // The backup duration of the sessions and the packets
                maxDisconnectionDuration: 2 * 60 * 1000,
                // Whether to skip middlewares upon successful recovery
                skipMiddlewares: false,
            },
        }
    );

    io.on("connection", (socket) => {
    // Initialize Game Server Socket
        gameServer.socket.socketServer = socket;

        socket.on("sendBoard", (shipsSerialized, res) => {
            GameServerLogger.onSendFleet(socket.id);
            res(GameServerSocket.onSendFleet(shipsSerialized, socket.id).serialize());
            console.log("foeeffieoohe");
        });

        socket.on("sendMove", (posX, posY) => {
            gameServer.sessions
                .getGameSessionOfUser_old(socket.id)
                ?.getOpponentBoard(socket.id)
                ?.handleHit(new Position(posX, posY));
        });

        socket.on("joinSession", (ships, callback) => {
            callback(GameServerSocket.onGetSession(ships, socket.id)
                .map(val => val.getData())
                .mapErr(err => err.message)
                .serialize()
            );

            /*

            Console.log("Adding ships!");
            console.log(ships);

            // We convert the json string sent by the user into something containing more information
            const shipsWithData: ShipTypeWithPlacement[] = ships.map((ship) => {
                return {
                    shipType: getShiptype(ship.shipType).unwrap(), //TODO: Handle errors, remove mocking
                    pos: Position.from_safe(ship.pos).unwrap(), //TODO: Handle errors
                    direction: ship.direction,
                };
            });

            // Then create the board of the user
            const userBoard = new UserBoard(socket.id);
            userBoard.placeShips(shipsWithData);

            // Finally, get a session and insert the player in it
            const session = gameServer.joinSession("1v1", userBoard); //TODO: Handle Gamemode

            if (session.isErr()) {
                session.unwrap(); // Throw the error;
                return;
            }

            callback(
                session
                    .unwrap()
                    .map((session) => session.getData())
                    .mapErr((err) => err.name)
                    .serialize()
            );*/
        });

        socket.on("quit", () => {
            GameServerLogger.onPlayerQuit(socket.id);
            const player = gameServer.players.get_asOption(socket.id).unwrap(); //TODO: Remove Unwrap
            GameServerLogger.playerLeave(player, player.session.unwrap());
            gameServer.sessions.playerQuitSession(socket.id);
        });
    });

    res.socket.server.io = io;
    //}
    res.end();
}
