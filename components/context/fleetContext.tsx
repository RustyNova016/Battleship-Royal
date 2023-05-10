import {createContext} from "react";
import {SerializedFleet} from "@/utils/class/game/ShipManagers/ShipPlacementSerialized";

export const FleetContext = createContext<{ value: SerializedFleet, set: (val: SerializedFleet) => void }>({
    value: [],
    set: () => {}
});