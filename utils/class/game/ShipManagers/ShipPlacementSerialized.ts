import {Direction} from "@/utils/objects/ship/Fleet";
import {z} from "zod";
import {directionZod} from "@/utils/validation/placedShipJSONZod";
import {ShipTypeModel} from ".prisma/client";
import {Position} from "@/utils/class/Position";

/** State of ships */
export interface ShipPlacementSerialized {
    pos: string;
    direction: Direction;
    shipType: string;
}

export type SerializedFleet = ShipPlacementSerialized[]

/** Represent the location of a ship on a board, and contain the data with the ship */
export interface ShipTypeWithPlacement {
    shipType: ShipTypeModel,
    pos: Position;
    direction: Direction;
}

export const ShipPlacementZod = z.object({
    pos: z.string().min(2),
    direction: directionZod,
    //TODO: Check for CUID2 since it's a CUID2.
    //TODO: However Prisma need to update their CUID Package and test values would require CUIDs
    //TODO: So this need to wait
    shipType: z.string()//.cuid2()
});

export class ShipUnSerializationError extends Error {
    public static getShipNumberError(fleet: SerializedFleet) {
        if(fleet.length === 0) {
            return new this("Invalid ship number. Recieved 0 ships. The client may have skipped setting up the board and sent an empty board.");
        }
        
        return new this(`Invalid ship number. Recieved ${fleet.length} instead of 4`);
    }
}