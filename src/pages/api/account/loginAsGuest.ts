import {NextApiRequest, NextApiResponse} from "next";
import {PlayerORM} from "@/prisma/ORM/PlayerORM";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    console.log(req.body)
    console.log(req.body.name)
    const player = await PlayerORM.registerGuest(req.body);
    if (player !== undefined) {
        res.status(200).json({temporaryId: player.id})
    } else {
        res.status(400)
    }
}