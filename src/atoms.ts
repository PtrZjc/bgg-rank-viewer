import { atom } from 'jotai';

export type GameRow = {
    rank: number;
    name: string;
    link: string;
}

export type GameDayRanks = {
    day: string;
    [gameName: string]: number | string;
}

// Primitive atoms for controls
export const minDateAtom = atom<Date>(getDaysAgoFromToday(7*4*6));
export const maxDateAtom = atom<Date>(new Date());
export const visibleGameNamesAtom = atom<string[]>([]);
export const tickDaysResolutionAtom = atom<number>(7);
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
