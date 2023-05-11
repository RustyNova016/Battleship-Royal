export enum GameStateClient {
    /** The game isn't started */
    idle,

    /** The Session is searching for other players */
    matchMaking,

    /** There is no opponent for the player for now, but there will be one in the future */
    waitingForOpponent,

    /** The player is playing the game */
    playing,

    /** The player won the session */
    won,

    /** The player lost the session */
    lost,
}