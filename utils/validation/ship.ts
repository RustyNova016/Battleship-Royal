import {z} from "zod";

export const shipJSONZod = z.object({
    id: z.string(),
    name: z.string(),
    length: z.number()
})

export const gameBoardCellJSONZod = z.object({
    x: z.number(),
    y: z.number(),
    ship: shipJSONZod.optional()
})

export const gameBoardJSONZod = z.object({
    id: z.string(),
    name: z.string(),
    length: z.number()
})