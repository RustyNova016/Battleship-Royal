import {Direction} from "@/utils/objects/ship/Fleet";
import {z} from "zod";
import {directionZod} from "@/utils/validation/placedShipJSONZod";

/** State of ships */
export interface ShipPlacement {
    pos: string;
    direction: Direction;
    shipType: string;
}

export const ShipPlacementZod = z.object({
    pos: z.string().min(2),
    direction: directionZod,
    //TODO: Check for CUID2 since it's a CUID2.
    //TODO: However Prisma need to update their CUID Package and test values would require CUIDs
    //TODO: So this need to wait
    shipType: z.string()//.cuid2()
});