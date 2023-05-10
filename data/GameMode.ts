import {z} from "zod";

export enum GamemodesEnum {
    vs1 = "1v1",
    vs100 = "1v100",
    vs3 = "1v3"
}

export function getGamemodeData(gamemode: GamemodesEnum): { maxPlayers: number } {
    switch (gamemode) {
    case GamemodesEnum.vs1:
        return {maxPlayers: 2};
    case GamemodesEnum.vs100:
        return {maxPlayers: 100};
    case GamemodesEnum.vs3:
        return {maxPlayers: 3};
    }
    return {
        maxPlayers: 0
    };
}

export const gamemodeParser = z.nativeEnum(GamemodesEnum);