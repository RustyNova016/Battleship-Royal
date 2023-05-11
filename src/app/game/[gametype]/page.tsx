import {WebSocketConnection} from "@/app/game/[gametype]/WebSocketConnection";
import {gamemodeParser} from "../../../../data/GameMode";
import {GamemodeProvider} from "@/app/game/[gametype]/GamemodeProvider";

export default function page({params}: {params: {gametype: string}}) {
    return <>
        <GamemodeProvider gamemode={gamemodeParser.parse(params.gametype)}>
            
            <WebSocketConnection/>
        </GamemodeProvider>
    </>;
}

