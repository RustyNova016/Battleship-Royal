import {Position} from "@/utils/class/Position";
import {direction} from "@/utils/validation/placedShipJSONZod";


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