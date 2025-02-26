import {create} from 'zustand'
import {DailyGameData, GameDayRanks, SupplementedGameData} from "./state.ts";

export const useGameDataStore = create<{
    dailyGameData: DailyGameData[],
    dataset: GameDayRanks[],
    visibleGamesData: SupplementedGameData[],
    visibleGameNames: string[],
    allGameNames: string[],

    setDailyGameDataAndDataset: (dailyGameData: DailyGameData[]) => void
    calculateVisibleGamesData: (topRanksShowed: number) => void

}>((set) => ({
    dailyGameData: [],
    dataset: [],
    visibleGamesData: [],
    visibleGameNames: [],
    allGameNames: [],

    setDailyGameDataAndDataset: (dailyGameData: DailyGameData[]) => set(() => {
        return {
            dailyGameData: dailyGameData,
            dataset: dailyGameData.map(({day, data}) =>
                data.reduce((acc, {name, rank}) => ({
                    ...acc,
                    [name]: rank
                }), {day} as GameDayRanks)
            ).filter(dayRanks => Object.keys(dayRanks).length > 2)
        };
    }),

    calculateVisibleGamesData: (topRanksShowed: number) => set((state) => {
        if (!state?.dailyGameData?.length) return {};

        console.log((state?.dailyGameData));
        const lastDayData = state.dailyGameData[state.dailyGameData.length - 1];
        const lastDayArray = lastDayData.data
            .filter(({rank}) => rank <= topRanksShowed)
            .map((game) => ({...game}));

        lastDayArray.sort((a, b) => a.rank - b.rank);

        const allGameNames = Array.from(new Set(
            state.dataset.flatMap(dayRanks =>
                Object.keys(dayRanks).filter(key => key !== 'day')
            )
        ));

        return {
            visibleGamesData: lastDayArray,
            allGameNames
        };
    })
}));
