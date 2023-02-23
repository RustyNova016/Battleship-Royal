import prisma from "@/lib/prismadb";
import {ShipType} from "@/utils/objects/ship/ShipType";

export class ShipTypeORM {
    private static getPrisma() {
        return prisma.shipTypeModel
    }

    public static async findShipById(id: string){
        return this.getPrisma().findUnique({
            where: {id}
        })
    }

    public static async getShipType(id: string) {
        const data = await this.findShipById(id);
        if(data === null) {return null}
        return ShipType.fromModel(data)
    }
}