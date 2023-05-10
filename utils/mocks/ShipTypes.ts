import {ShipType} from "@/utils/objects/ship/shiptype/ShipType";
import {None, Option, Some} from "@rustynova/monads";


export enum defaultShips {
    "cruiser",
    "submarine",
    "battleship",
    "aircraftcarrier"
}

export function getShiptype(id: string | defaultShips): Option<ShipType> {
    switch (id) {
    case "Destroyer":
        return Some(new ShipType("Destroyer", "Destroyer", 2));

    case "Cruiser":
        return Some(new ShipType("Cruiser", "Cruiser", 3));

    case "Submarine":
        return Some(new ShipType("Submarine", "Submarine", 3));

    case "AircraftCarrier":
        return Some(new ShipType("AircraftCarrier", "Aircraft Carrier", 4));

    default:
        return None;
    }
}
