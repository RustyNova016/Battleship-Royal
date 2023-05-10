import {DataTableItemType} from "@/utils/class/ORM/ORM/DataTable";
import {ShipTypeModel} from ".prisma/client";

export class ShipType implements ShipTypeModel, DataTableItemType {
    id: string;
    length: number;
    name: string;

    constructor(id: string, name: string, length: number) {
        this.id = id;
        this.name = name;
        this.length = length;
    }

    public static fromModel(data: ShipTypeModel): ShipType {
        return new ShipType(data.id, data.name, data.length);
    }

    /** Check for equality */
    public eq(other: ShipType) {
        return this.id === other.id;
    }
}

