import { create } from 'zustand'

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

// global constants
export const ZERO_DATE = new Date('2024-04-01');
export const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;
export const DAYS_FROM_ZERO_DATE_TO_TODAY = Math.floor((new Date().getTime() - ZERO_DATE.getTime()) / MILLIS_IN_DAY)

// Consolidated Zustand store for date and UI controls
export const useDateStore = create<{
    minDate: Date,
    maxDate: Date,
    minDateDisplayed: Date,
    maxDateDisplayed: Date,
    datapointNumberVisible: number,
    loading: boolean,
    error: string | null,
    setDatesAsDaysAfterZeroDate: (minDaysFromZeroDate: number, maxDaysFromZeroDate: number) => void
    setDisplayDatesAsDaysAfterZeroDate: (minDaysFromZeroDate: number, maxDaysFromZeroDate: number) => void
    setDatapointNumberVisible: (value: number) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}>()(set => ({
    minDate: ZERO_DATE, // used to actual data fetching
    maxDate: plusDays(ZERO_DATE, DAYS_FROM_ZERO_DATE_TO_TODAY),
    minDateDisplayed: ZERO_DATE, // used to display the date range
    maxDateDisplayed: new Date(),
    datapointNumberVisible: 50,
    loading: false,
    error: null,

    setDatesAsDaysAfterZeroDate: (minDaysFromZeroDate: number, maxDaysFromZeroDate: number) =>
        set({
            minDate: plusDays(ZERO_DATE, minDaysFromZeroDate),
            maxDate: plusDays(ZERO_DATE, maxDaysFromZeroDate),
        }),
    setDisplayDatesAsDaysAfterZeroDate: (minDaysFromZeroDate: number, maxDaysFromZeroDate: number) =>
        set({
            minDateDisplayed: plusDays(ZERO_DATE, minDaysFromZeroDate),
            maxDateDisplayed: plusDays(ZERO_DATE, maxDaysFromZeroDate)
        }),
    setDatapointNumberVisible: (value: number) => set({ datapointNumberVisible: value }),
    setLoading: (loading: boolean) => set({ loading }),
    setError: (error: string | null) => set({ error }),
}));

// helper functions
function plusDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * MILLIS_IN_DAY);
}
