import {createContext} from "react";
import {GamemodesEnum} from "../../data/GameMode";

export const GameModeContext = createContext<GamemodesEnum>(GamemodesEnum.vs1);