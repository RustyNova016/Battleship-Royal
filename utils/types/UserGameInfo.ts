import {PlacedShip} from "@/utils/objects/ship/PlacedShip";
import {ShipTypeModel} from ".prisma/client";

export interface UserGameInfo {
    availableShipTypes: ShipTypeModel[];
    board: UserBoardCellState[][];
    idUser: string;
    ship: PlacedShip[];
}

export interface UserBoardCellState {
    isSearched: boolean
}