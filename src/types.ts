// global types
export type GameData = {
    rank: number;
    id: number;
    name: string;
    link: string;
}

export type DailyGameData = {
    day: string;
    data: GameData[];
}

export type SupplementedGameData = GameData & { // TBD
    rankDifference: number | undefined;
    // color: string
}

export type GameDayRanks = {
    day: string;
    [gameId: string]: number | string;
}
