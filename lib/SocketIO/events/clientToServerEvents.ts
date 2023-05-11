import {ShipPlacementSerialized} from "@/utils/class/game/ShipManagers/ShipPlacementSerialized";
import {GameSessionData} from "@/utils/ORM Entities/Sessions/GameSession";
import {Socket} from "socket.io-client";
import {ResultSerialized} from "@rustynova/monads/lib/result/result";
import {CellState} from "@/utils/class/game/BoardManagers/CellState";
import {GamemodesEnum} from "../../../data/GameMode";
import {GameStateClient} from "@/utils/states/GameStateClient";

export interface ClientToServerEvents {
    joinSession: (
        ships: ShipPlacementSerialized[],
        gamemode: GamemodesEnum,
        res: (result: ResultSerialized<GameSessionData, string>) => void
    ) => void; //TODO: Add gamemode
    /** Quit the session */
    quitSession: () => void;

    sendBoard: (ships: ShipPlacementSerialized[], res: (result: ResultSerialized<boolean, string>) => void) => void;
    sendMove: (posX: number, posY: number) => void;
}

export interface ServerToClientEvents {
    receiveMove: (posX: number, posY: number, on: number) => void;

    // Session Event
    updateClientSession: (data: GameSessionData) => void;
    clearClientSession: () => void

    // Game Events
    isPlayerTurn: (state: boolean) => void
    setOpponentBoard: (opponentBoard: CellState[]) => void;
    setPlayerBoard: (playerBoard: CellState[]) => void;

    // State Event
    setGameState: (gameState: GameStateClient) => void;

    // End Event
    isWinner:(isWinner: boolean) => void;
    isLoser: (isLoser: boolean) => void
}

/** Websocket of the game */
export type SocketClientSide = Socket<ServerToClientEvents, ClientToServerEvents>;

