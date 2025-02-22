import {atom} from 'jotai';
import {create} from 'zustand'

// global types
export type GameRow = {
    rank: number;
    name: string;
    link: string;
}

export type GameDayRanks = {
    day: string;
    [gameName: string]: number | string;
}

// global constants
export const ZERO_DATE = new Date('2024-04-01');
export const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;
export const DAYS_FROM_ZERO_DATE_TO_TODAY = Math.floor((new Date().getTime() - ZERO_DATE.getTime()) / MILLIS_IN_DAY)

// atoms
export const loadingAtom = atom<boolean>(false);
export const errorAtom = atom<string | null>(null);
export const datasetAtom = atom<GameDayRanks[]>([]);
export const visibleGameNamesAtom = atom<string[]>([]);
export const datapointNumberVisibleAtom = atom<number>(50);
export const topRanksShowedAtom = atom<number>(30);

// stores
export const useDateStore = create<{
    minDate: Date,
    maxDate: Date,
    minDateDisplayed: Date,
    maxDateDisplayed: Date,
    setDatesAsDaysAfterZeroDate: (minDaysFromZeroDate: number, maxDaysFromZeroDate: number) => void
    setDisplayDatesAsDaysAfterZeroDate: (minDaysFromZeroDate: number, maxDaysFromZeroDate: number) => void
}>((set) => ({
    minDate: ZERO_DATE, // used to actual data fetching
    maxDate: new Date(),
    minDateDisplayed: ZERO_DATE, // used to display the date range
    maxDateDisplayed: new Date(),

    setDatesAsDaysAfterZeroDate: (minDaysFromZeroDate: number, maxDaysFromZeroDate: number) =>
        set({
            minDate: plusDays(ZERO_DATE, minDaysFromZeroDate),
            maxDate: plusDays(ZERO_DATE, maxDaysFromZeroDate),
        }),
    setDisplayDatesAsDaysAfterZeroDate: (minDaysFromZeroDate: number, maxDaysFromZeroDate: number) =>
        set({
            minDateDisplayed: plusDays(ZERO_DATE, minDaysFromZeroDate),
            maxDateDisplayed: plusDays(ZERO_DATE, maxDaysFromZeroDate)
        })
}));

// helper functions

function plusDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * MILLIS_IN_DAY);
}
