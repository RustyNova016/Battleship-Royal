import prisma from "@/lib/prismadb";

export class GameSessonPlayersORM {
    static getPrisma() {
        return prisma.gamesessionplayers
    }

    public static async joinSession(sessionId: string, playerId: string) {
        //TODO: Check if session is full or not
        //TODO: Add zod
        return this.getPrisma().create({
            data: {
                sessionId,
                playerId
            }
        });
    }
}