import {Direction} from "@/utils/objects/ship/Fleet";

export class Orientation {
    public static getShipTailDirection(shipDirection: Direction): Direction {
        return this.invertDirection(shipDirection);
    }

    public static invertDirection(direction: Direction): Direction {
        switch (direction) {
            case "up":
                return "down";
            case "right":
                return "left";
            case "down":
                return "up";
            case "left":
                return "right";
        }
    }

    public static rotateClockwise(direction: Direction): Direction {
        switch (direction) {
            case "up":
                return "right"
            case "right":
                return "down";
            case "down":
                return "left";
            case "left":
                return "up";
        }
    }
}