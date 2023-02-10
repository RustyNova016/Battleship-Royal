import prisma from "@/lib/prismadb";

export class GameTypeORM {
     public static getPrisma() {
        return prisma.gametype
    }
}