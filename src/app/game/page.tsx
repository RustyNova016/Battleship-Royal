import {GameBoard} from "@/utils/objects/GameBoard";
import {Board} from "@/components/game/Board";

export default function page() {
    const board = GameBoard.new()
    return <div style={{margin: "20px"}}>
        <Board board={board}/>
    </div>
}