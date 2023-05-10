import {Pool} from "pg";
import {drizzle} from "drizzle-orm/d1";

const pool = new Pool({
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "",
    database: "BattleshipRoyal_dev",
});

export const db = drizzle(pool);