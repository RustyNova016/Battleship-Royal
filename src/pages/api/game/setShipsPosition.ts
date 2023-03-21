import {z} from "zod";
import {NextApiRequest, NextApiResponse} from "next";
import {GameBoard} from "@/utils/objects/GameBoard";
import {placedShipJSONZod} from "@/utils/validation/placedShipJSONZod";
import {PlacedShip} from "@/utils/objects/ship/PlacedShip/PlacedShip";
import {Position} from "@/utils/objects/Position";
import {ShipTypeORM} from "@/prisma/ORM/ShipTypeORM";
import {ShipLocationORM} from "@/prisma/ORM/ShipLocationORM";

const setShipsPositionReq = z.object({
    playerId: z.string().cuid(),
    sessionId: z.string().cuid(),
    ships: z.array(placedShipJSONZod)
})

export default async function setShipsPosition(req: NextApiRequest, res: NextApiResponse) {
    const args = setShipsPositionReq.parse(req.query)

    // Check if the placements are valid
    const gameBoard = GameBoard.new()
    // TODO: Check if the number of ship isn't superior to the number of types
    for (const ship of args.ships) {
        const shipType = await ShipTypeORM.getShipType(ship.shipId);
        if(shipType === null) {res.status(422).json({message: "Unknown ship type"}); return}

        gameBoard.placeShip(new PlacedShip(shipType), new Position(ship.x, ship.y), ship.direction)
    }

    for (const ship of args.ships) {
        ShipLocationORM.saveLocation({
            x: ship.x,
            y: ship.y,
            direction: ship.direction,
            shipId: ship.shipId,
            playerId: args.playerId,
            sessionID: args.sessionId
        })
    }
}