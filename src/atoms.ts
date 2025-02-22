import {atom} from 'jotai';

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
export const ABSOLUTE_MIN_DATE = new Date('2024-04-01');
export const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;

const minDateDaysAgoFromToday = Math.floor((new Date().getTime() - ABSOLUTE_MIN_DATE.getTime()) / MILLIS_IN_DAY)

// Primitive atoms for controls
export const minDateAtom = atom<Date>(getDaysAgoFromToday(minDateDaysAgoFromToday));
export const maxDateAtom = atom<Date>(new Date());
export const visibleGameNamesAtom = atom<string[]>([]);
export const datapointNumberVisibleAtom = atom<number>(50);
export const topRanksShowedAtom = atom<number>(30);

// Data and loading state atoms

export const datasetAtom = atom<GameDayRanks[]>([]);
export const loadingAtom = atom<boolean>(false);
export const errorAtom = atom<string | null>(null);

// Helper function to get dates
function getDaysAgoFromToday(days: number): Date {
    const daysInMillis = days * 1000 * 60 * 60 * 24;
    return new Date(new Date().getTime() - daysInMillis);
}
