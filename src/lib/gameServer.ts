import { GameServer } from "@/srcLib/server/GameServer";

declare let global: { gameServer: GameServer };

let gameServer: GameServer;

if (process.env.NODE_ENV === "production") {
    gameServer = new GameServer();
} else {
    if (!global.gameServer) {
        global.gameServer = new GameServer();
    }
    gameServer = global.gameServer;
}
export default gameServer;
