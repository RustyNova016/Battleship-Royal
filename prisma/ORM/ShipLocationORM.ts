import prisma from "../../lib/prismadb";
import {Player} from "@/utils/ORM Entities/Players/Player";
import {Ok} from "@rustynova/monads";


export class ShipLocationORM {
    public static saveFleet(player: Player) {
        const session = player.getSession();
        const fleet = player.getBoard().map(board => board.fleet);

        if (session.isErr()) {return session;}
        if (fleet.isErr()) {return session;}

        fleet.unwrap().ships.forEach(ship => {
            this.getPrisma().upsert({
                where: {
                    shipType_sessionID_playerId: {
                        shipType: ship.shipType.name,
                        playerId: player.id,
                        sessionID: session.unwrap().id
                    }
                },
                create: {
                    shipType: ship.shipType.name,
                    x: ship.anchorPosition.xArray,
                    y: ship.anchorPosition.yArray,
                    sessionID: session.unwrap().id,
                    playerId: player.id,
                    direction: ship.facing,
                },
                update: {
                    shipType: ship.shipType.name,
                    x: ship.anchorPosition.xArray,
                    y: ship.anchorPosition.yArray,
                    sessionID: session.unwrap().id,
                    playerId: player.id,
                    direction: ship.facing,
                }
            });
        });

        return Ok(undefined);
    }

    private static getPrisma() {
        return prisma.shipLocationModel;
    }
}