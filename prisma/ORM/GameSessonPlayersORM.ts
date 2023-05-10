import {GameSession, SessionState} from "@/utils/ORM Entities/Sessions/GameSession";
import {Err} from "@rustynova/monads";
import prisma from "../../lib/prismadb";
import {ShipLocationORM} from "@/prisma/ORM/ShipLocationORM";

export class GameSessonPlayersORM {
    static getPrisma() {
        return prisma.gameSessionPlayers;
    }

    public static async joinLobby(sessionId: string, playerId: string) {
        //TODO: Check if session is full or not
        //TODO: Add zod
        return this.getPrisma().create({
            data: {
                sessionId,
                playerId
            }
        });
    }

    public static SaveSessionPlayers(session: GameSession) {
        if(session.state === SessionState.setUp) {return Err(new Error("Cannot save players: Session is still setting up"));}

        return session.players.map(player => {
            this.getPrisma().upsert({
                where: {
                    playerId_sessionId: {
                        sessionId: session.id,
                        playerId: player.id
                    }
                },
                create: {
                    playerId: player.id,
                    sessionId: session.id,
                },
                update: {
                    sessionId: session.id,
                    playerId: player.id
                }
            });

            return ShipLocationORM.saveFleet(player);
        });
    }
}