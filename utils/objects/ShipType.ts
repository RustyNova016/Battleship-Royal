export interface ShipTypeJSON {
    id: string;
    name: string;
    length: number;
}

export class ShipType implements ShipTypeJSON {
    id: string;
    name: string;
    length: number;

    constructor(id: string, name: string, length: number) {
        this.id = id;
        this.name = name;
        this.length = length;
    }
}

