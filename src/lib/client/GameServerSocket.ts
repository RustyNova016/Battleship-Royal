import {SerializedFleet, ShipPlacementSerialized,} from "@/utils/class/game/ShipManagers/ShipPlacementSerialized";
import {GameBoardManager} from "@/utils/class/game/GameManagers/GameBoardManager";
import {Err, Result} from "@rustynova/monads";
import gameServer from "@/lib/gameServer";
import {PipoRiskyLoop} from "../../../lib/Pipo/PipoRiskyLoop";


export class GameServerSocket {
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
}
