import prisma from "@/lib/prismadb";
import {z} from "zod";

const guestReqZod = z.object({
    name: z.string()
})

export class PlayerORM {
    private static getPrisma() {
        return prisma.player
    }

    static registerGuest(data: { name: string; }) {
        return this.getPrisma().create({
            data: {
                name: guestReqZod.parse(data).name,
            }
        })
    }
}