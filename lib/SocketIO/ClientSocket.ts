import {io} from "socket.io-client";
import {SocketClientSide} from "./events/clientToServerEvents";

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000/";

console.log("Connecting websocket to:", URL);
export const clientSocket: SocketClientSide = io(URL, {
    autoConnect: true,
    path: "/api/socket_io"
});