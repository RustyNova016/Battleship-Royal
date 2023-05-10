import {createContext} from "react";
import {DynamicBackgroundProps} from "@/components/dynamic-background/dynamic-background";

export const dynamicContext = createContext<(props: DynamicBackgroundProps) => void>(() => {});