"use client";
import {PropsWithChildren, useState} from "react";
import {FleetContext} from "@/components/context/fleetContext";
import {SerializedFleet} from "@/utils/class/game/ShipManagers/ShipPlacementSerialized";

export default function Layout(props: PropsWithChildren) {
    const [fleetcontext, setFleetcontext] = useState<SerializedFleet>([]);
    return <FleetContext.Provider value={{value: fleetcontext, set: setFleetcontext}}>
        {props.children}
    </FleetContext.Provider>;
}