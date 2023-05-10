"use client";
import React, {PropsWithChildren, useContext, useState} from "react";
import {dynamicContext} from "@/hooks/style/dynamicBackground";
import {DynamicBackground, DynamicBackgroundProps} from "@/components/dynamic-background/dynamic-background";

export function DynamicBackgroundWithContext({children}: PropsWithChildren) {
    const [props, setProps] = useState<DynamicBackgroundProps>({});

    console.log("Porps:", props);
    return <>
        <dynamicContext.Provider value={setProps}>
            <DynamicBackground {...props}>
                {children}
            </DynamicBackground>
        </dynamicContext.Provider>
    </>;
}

export function SetDynamicBackground(props: DynamicBackgroundProps) {
    const dynamicSetter = useContext(dynamicContext);
    dynamicSetter(props);
    return <></>;
}