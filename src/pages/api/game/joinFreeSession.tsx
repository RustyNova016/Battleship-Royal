import {NextApiRequest, NextApiResponse} from "next";
import {GameSessionORM} from "@/prisma/ORM/GameSessionORM";
import {GameSessonPlayersORM} from "@/prisma/ORM/GameSessonPlayersORM";
import {z} from "zod";

const joinFreeSessionReq = z.object({
    playerId: z.string()
})

export default async function joinFreeSession(req: NextApiRequest, res: NextApiResponse) {
    //TODO: Get session type from request
    const args = joinFreeSessionReq.parse(req.query)

    // Search the current sessions to find free ones
    let sessionId = await GameSessionORM.findAvailableSession()

    if(sessionId === ""){
        sessionId = (await GameSessionORM.createNewSession("azerty")).id
    }

    const joinSession = await GameSessonPlayersORM.joinSession(sessionId, args.playerId)

    res.status(200).json({
        message: "Joined session",
        joinSession
    })
}