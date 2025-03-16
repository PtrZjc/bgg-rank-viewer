// global types
export type GameData = {
    rank: number;
    name: string;
    link: string;
}

export type DailyGameData = {
    day: string;
    data: GameData[];
}

export type SupplementedGameData = GameData & { // TBD
    // rankDifference: number
    // color: string
}

export type GameDayRanks = {
    day: string;
    [gameName: string]: number | string;
}