import {useEffect, useState} from "react";
import {BoardDisplay} from "@/utils/objects/DisplayBoard/BoardDisplay";
import {Board} from "@/components/game/board/Board";

export function BoardManager() {
    const [boardData, setBoardData] = useState<BoardDisplay | undefined>(undefined);

    useEffect(() => {
        setBoardData(new BoardDisplay())
    }, []);

    const handleClick = () => {
        // handle the click in the manager


        // Make changes to the display board
    }

    if (boardData === undefined) {return <></>}

    return <Board board={boardData}/>
}