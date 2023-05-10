import {SetUpPage} from "@/components/set-up-page/SetUpPage";
import {DynamicBackgroundProps} from "@/components/dynamic-background/dynamic-background";
import {SetDynamicBackground} from "@/components/dynamic-background/dynamic-background-with-context";
import {gamemodeParser} from "../../../../../data/GameMode";

const dynamicBackground: DynamicBackgroundProps = {
    posX: "50%",
    posY: "50%",
    colorA: "#19305e"
};

export default async function page({params}: { params: { gametype: string } }) {
    return <>
        <SetDynamicBackground {...dynamicBackground}/>
        <SetUpPage gamemode={gamemodeParser.parse(params.gametype)}/>
    </>;
}

