import {HomePage} from "@/components/Page/home-page/home-page";
import {SetDynamicBackground} from "@/components/dynamic-background/dynamic-background-with-context";
import {DynamicBackgroundProps} from "@/components/dynamic-background/dynamic-background";

const homeDynamicBackground: DynamicBackgroundProps = {
    posX: "25%",
    posY: "75%",
    colorA: "#2F59AC",
    colorB: "rgb(0, 11, 63)"
};

export default function Home() {
    return (
        <>
            <SetDynamicBackground {...homeDynamicBackground}/>
            <HomePage/>
        </>
    );
}
