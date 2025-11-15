import {create} from 'zustand';
import {DailyGameData, GameDayRanks, SupplementedGameData} from "src/types";

// Create the store with simpler selectors to avoid infinite loops
export const useGameDataStore = create<{
  dailyGameData: DailyGameData[],
  dataset: GameDayRanks[],
  visibleGamesData: SupplementedGameData[],
  visibleGameNames: string[],
  allGameNames: string[],

  setDailyGameDataAndDataset: (dailyGameData: DailyGameData[]) => void,
  calculateVisibleGamesData: (topRanksShowed: number) => void
}>()(set => ({
  dailyGameData: [],
  dataset: [],
  visibleGamesData: [],
  visibleGameNames: [],
  allGameNames: [],

  setDailyGameDataAndDataset: (dailyGameData: DailyGameData[]) => {
    // Process data before setting the state
    const dataset = dailyGameData.map(({day, data}) =>
      data.reduce((acc, {name, rank}) => ({
        ...acc,
        [name]: rank
      }), {day} as GameDayRanks)
    ).filter(dayRanks => Object.keys(dayRanks).length > 2);

    // Compute the allGameNames just once here
    const allGameNames = Array.from(new Set(
      dataset.flatMap(dayRanks =>
        Object.keys(dayRanks).filter(key => key !== 'day')
      )
    ));

    set({
      dailyGameData,
      dataset,
      allGameNames
    });
  },

  calculateVisibleGamesData: (topRanksShowed: number) => set(state => {
    if (!state.dailyGameData?.length) return state;

    // Get the last day of data
    const lastDayData = state.dailyGameData[state.dailyGameData.length - 1];

    const firstVisibleDay = state.dataset[0]
    const lastVisibleDay = state.dataset[state.dataset.length - 1]

    // Filter and sort the data
    const lastDayArray = lastDayData.data
      .filter(({rank}) => rank <= topRanksShowed)
      .map((game) => {
        const firstDayRank = firstVisibleDay[game.name] as number | undefined;
        const lastDayRank = lastVisibleDay[game.name] as number;
        const rankDifference = (firstDayRank !== undefined && !isNaN(firstDayRank))
          ? firstDayRank - lastDayRank
          : undefined;

        return {
          ...game,
          rankDifference
        } as SupplementedGameData;
      })
      .sort((a, b) => a.rank - b.rank);

    return {
      visibleGamesData: lastDayArray,
      visibleGameNames: lastDayArray.map(game => game.name)
    };
  })
}));
