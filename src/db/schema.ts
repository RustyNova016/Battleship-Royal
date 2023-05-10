import {boolean, pgEnum, pgTable, primaryKey, varchar} from "drizzle-orm/pg-core";

export const GamemodeTypeColumn = pgEnum("GameMode", ["1v1", "1v100"]);

export const GameSession = pgTable("GameSession", {
    id: varchar("id").primaryKey().notNull(),
    gamemodeType: GamemodeTypeColumn("GamemodeType").notNull(),
    isStarted: boolean("isStarted").default(false).notNull(),
    isEnded: boolean("isEnded").default(false).notNull()
});

export const Player = pgTable("Player", {
    id: varchar("id").primaryKey().notNull(),
});

export const GameSessionPlayer = pgTable("GameSessionPlayer", {
    sessionId: varchar("sessionId").references(() => GameSession.id),
    playerId: varchar("playerId").references(() => Player.id)
},
(gameSessionPlayer) => ({
    pk: primaryKey(gameSessionPlayer.sessionId, gameSessionPlayer.playerId)
})
);

