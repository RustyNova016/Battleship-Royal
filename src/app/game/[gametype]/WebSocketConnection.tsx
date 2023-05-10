"use client";

import {useEffect, useState} from "react";
import {clientSocket} from "../../../../lib/SocketIO/ClientSocket";
import {GameSessionLayer} from "@/app/game/[gametype]/GameSessionLayer";

/** Handle the connection to the websocket */
export function WebSocketConnection() {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
            console.log("[Client] > Connected to the server");
        }

        function onDisconnect() {
            setIsConnected(false);
            console.log("[Client] > Disconnected");
        }

        clientSocket.on("connect", onConnect);
        clientSocket.on("disconnect", onDisconnect);

        return () => {
            clientSocket.off("connect", onConnect);
            clientSocket.off("disconnect", onDisconnect);
        };
    }, []);

    useEffect(() => {
        if (!clientSocket.connected) {
            console.log("[Client] > Trying to connect to the server");

            // Prevent connecting on the server side
            if (typeof window !== "object") {
                console.log("[Client] > Client is on the serverside, aborting");
                return;
            }

            // Fetch the api route to make sure that the socket.io server is attached to Next.js's server
            console.log("[Client] > Fetching");
            fetch("/api/socketio").finally(() => {clientSocket.connect();
                console.log("[Client] > Connect");});
            console.log("[Client] > Fetched");
        }

        return () => {
            if (clientSocket.connected) {
                console.log("[Client] > Disconnecting Socket");
                clientSocket.disconnect();
            }
        };
    }, []);


    if (!isConnected) {
        return <>Connecting to the Server</>;
    }

    return (
        <>
            {clientSocket.connected ? <GameSessionLayer/> : <></>}
        </>
    );
}

