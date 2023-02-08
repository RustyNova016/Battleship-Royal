import {Position} from "@/utils/objects/Position";
import {direction} from "@/utils/objects/Ship";

export class GridUtils {
    public static getOffsetPos(pos: Position, offsetDir: direction, cellNum: number): Position {
        switch (offsetDir) {
            case "up":
                return new Position(pos.x, pos.y - cellNum)
            case "right":
                return new Position(pos.x + cellNum, pos.y)
            case "down":
                return new Position(pos.x, pos.y + cellNum)
            case "left":
                return new Position(pos.x + cellNum, pos.y)
        }
    }
}