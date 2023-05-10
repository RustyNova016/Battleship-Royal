import {PrismaClient} from "@prisma/client";

declare let global: { prisma: PrismaClient };

// PrismaClient is attached to the `global` object in development to prevent
// Exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
} else {
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}
export default prisma;