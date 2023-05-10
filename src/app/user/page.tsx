import {UserPage} from "@/components/UserPage/UserPage";
import {SetDynamicBackground} from "@/components/dynamic-background/dynamic-background-with-context";
import {DynamicBackgroundProps} from "@/components/dynamic-background/dynamic-background";

const dynamicBackground: DynamicBackgroundProps = {
    posX: "75%",
    posY: "25%",
    colorA: "#19305e"
};

export default function handle() {
    return <>
        <SetDynamicBackground {...dynamicBackground}/>
        <UserPage/>
    </>;
}