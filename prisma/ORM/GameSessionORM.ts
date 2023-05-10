import {Prisma} from "@prisma/client";
import {GameSession, SessionState} from "@/utils/ORM Entities/Sessions/GameSession";
import prisma from "../../lib/prismadb";
import gamesessionWhereInput = Prisma.gamesessionWhereInput;

const nonStartedSessionsFilter: gamesessionWhereInput = {isEnded: false, isStarted: false};

export class GameSessionORM {
    static async createNewSession(gameTypeId: string) {
        return await this.getPrisma().create({
            data: {gameTypeId}
        });
    }

    static getPlayerCountOfSession(id: string) {
        return this.getPrisma().findMany({
            select: {
                _count: {
                    select: {
                        gamesessionplayers: {}
                    }
                }
            },
            where: {
                id: id
            }
        });
    }

    /** Give the id of an available session */
    static async findAvailableSession(): Promise<string> {
        const nonStartedSessions = this.getNonStartedSessions();

        for (const nonStartedSession of (await nonStartedSessions)) {
            const nbOfPlayers = this.getPlayerCountOfSession(nonStartedSession.id);
            const querryRes = (await nbOfPlayers)[0];

            if (querryRes === undefined) {
                continue;
            }

            if (querryRes._count.gamesessionplayers <= nonStartedSession.gametype.maxPlayers) {
                return nonStartedSession.id;
            }
        }

        return "";
    }

    static getOngoingSessions() {
        return this.getPrisma().findMany({where: {isEnded: false}});
    }

    static getNonStartedSessions() {
        return this.getPrisma().findMany({
            where: nonStartedSessionsFilter,
            include: {
                gametype: true
            }
        });
    }

    private static getPrisma() {
        return prisma.gameSession;
    }

    /** Save the Session */
    public static saveSession(session: GameSession) {
        this.getPrisma().upsert({
            where: {
                id: session.id
            },
            create: {
                id: session.id,
                isStarted: session.state !== SessionState.setUp,
                isEnded: session.state === SessionState.ended,
                gameMode: "1v1" //TODO: Put it dynamically
            },
            update: {
                id: session.id,
                isStarted: session.state !== SessionState.setUp,
                isEnded: session.state === SessionState.ended,
            }
        });
    }
}