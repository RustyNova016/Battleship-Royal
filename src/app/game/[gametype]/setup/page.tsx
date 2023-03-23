import {ShipType} from "@/utils/objects/ship/shiptype/ShipType";
import {SetUpBoard} from "@/app/game/[gametype]/setup/setUpBoard";

export const testShipTypes = [
    new ShipType("1", "Destroyer", 2),
    new ShipType("2", "Cruiser", 3),
    new ShipType("3", "Submarine", 3),
    new ShipType("4", "Aircraft carrier", 4),
];

export default async function () {
    return <SetUpBoard/>;
}

