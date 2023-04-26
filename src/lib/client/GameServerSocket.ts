import {
    SerializedFleet,
    ShipPlacementSerialized,
    ShipUnSerializationError,
} from "@/utils/class/game/ShipManagers/ShipPlacementSerialized";
import {GameBoardManager} from "@/utils/class/game/GameManagers/GameBoardManager";
import {PipoRiskyLoop} from "@/lib/Pipo/PipoRiskyLoop";
import {Err, Result} from "@rustynova/monads";
import gameServer from "@/srcLib/gameServer";
import {GameSession} from "@/utils/ORM Entities/Sessions/GameSession";


export class GameServerSocket {
    /** Unserialize the ships, then try to find a session for the user */
    public static onGetSession(shipsSerialized: SerializedFleet, playerId: string): Result<GameSession, Error> {
        return GameServerSocket.saveSerializedFleet(shipsSerialized, playerId)
            .andThen(() => {
                return gameServer.matchMaker("1v1", gameServer.players.getOrCreate(playerId));
            });
    }

    public static onSendFleet(shipsSerialized: SerializedFleet, playerId: string): Result<boolean, string> {
        if (shipsSerialized.length < 4) {return Err(`Invalid ship number. Recieved ${shipsSerialized.length} instead of 4`);}
        const newBoard = new GameBoardManager();

        return PipoRiskyLoop
            .enter<ShipPlacementSerialized>(shipsSerialized)
            .forEach((ship) => newBoard.placeSerializedShip(ship))
            .andThen(() => gameServer.players.getOrCreate(playerId).setBoard(newBoard))
            .replaceOk(true)
            .mapErr(err => err.toString());
    }

    private static saveSerializedFleet(shipsSerialized: SerializedFleet, playerId: string): Result<boolean, Error> {
        if (shipsSerialized.length < 4) {return Err(ShipUnSerializationError.getShipNumberError(shipsSerialized));}
        const newBoard = new GameBoardManager();

        return PipoRiskyLoop
            .enter<ShipPlacementSerialized>(shipsSerialized)
            .forEach((ship) => newBoard.placeSerializedShip(ship))
            .andThen(() => gameServer.players.getOrCreate(playerId).setBoard(newBoard))
            .inspect(pla => console.log(pla.board))
            .replaceOk(true);
    }
}
