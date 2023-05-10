import {WebSocketConnection} from "@/app/game/[gametype]/WebSocketConnection";
import {gamemodeParser} from "../../../../data/GameMode";
import {GamemodeSetter} from "@/app/game/[gametype]/GamemodeSetter";

export default function page({params}: {params: {gametype: string}}) {
    return <>
        <GamemodeSetter gamemode={gamemodeParser.parse(params.gametype)}>
            <WebSocketConnection/>
        </GamemodeSetter>
    </>;
}

