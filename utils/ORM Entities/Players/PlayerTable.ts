import {DataTable} from "@/utils/class/ORM/ORM/DataTable";
import {Player} from "@/utils/ORM Entities/Players/Player";

export class PlayerTable extends DataTable<Player> {
    public getOrCreate(id: string) {
        return this
            .get_asOption(id)
            .unwrapOrElse(() => {
                const player = new Player(id);
                this.insert(player);
                return player;
            });
    }
}
