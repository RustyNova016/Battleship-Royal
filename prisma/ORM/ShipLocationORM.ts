import prisma from "@/lib/prismadb";
import {Prisma} from "@prisma/client";
import ShipLocationModelCreateInput = Prisma.ShipLocationModelCreateInput;
import ShipLocationModelUncheckedCreateInput = Prisma.ShipLocationModelUncheckedCreateInput;


export class ShipLocationORM {
    public static saveLocation(data: ShipLocationModelCreateInput | ShipLocationModelUncheckedCreateInput) {
        return this.getPrisma().create({
            data
        })
    }

    private static getPrisma() {
        return prisma.shipLocationModel
    }
}