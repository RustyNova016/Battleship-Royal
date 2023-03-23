import {Direction} from "@/utils/objects/ship/Fleet";

/** State of ships */
export interface ShipPlacement {
    pos: string;
    direction: Direction;
    shipType: string;
}