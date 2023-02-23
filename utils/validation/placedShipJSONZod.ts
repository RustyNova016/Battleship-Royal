import {z} from "zod";


const directionZod = z.enum(["up", "right", "down", "left"]);
export const placedShipJSONZod = z.object({
    x: z.number().min(0).max(10),
    y: z.number().min(0).max(10),
    direction: directionZod,
    shipId: z.string().cuid()
});

export type direction = z.infer<typeof directionZod>