import {Position} from "@/utils/objects/Position";

export class ShipPart {
    position: Position;
    connections: ["up"?, "right"?, "down"?, "left"?];
    private _destroyed = false

    constructor(position: Position, connections: ["up"?, "right"?, "down"?, "left"?]) {
        this.position = position;
        this.connections = connections;
    }

    get destroyed(): boolean {
        return this._destroyed;
    }

    public destroy() {
        this._destroyed = true;
    }
}