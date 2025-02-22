// useGameData.ts
import {useAtom, useAtomValue} from 'jotai';
import {useEffect} from 'react';
import {
    datasetAtom,
    errorAtom,
    GameDayRanks,
    GameRow,
    loadingAtom,
    maxDateAtom,
    minDateAtom,
    tickDaysResolutionAtom,
    topRanksShowedAtom,
    visibleGameNamesAtom
} from './atoms';
import Papa from "papaparse";

export function useGameData() {
    const minDate = useAtomValue(minDateAtom);
    const maxDate = useAtomValue(maxDateAtom);
    const tickDaysResolution = useAtomValue(tickDaysResolutionAtom);
    const topRanksShowed = useAtomValue(topRanksShowedAtom);

    const [dataset, setDataset] = useAtom(datasetAtom);
    const [_visibleGameNames, setVisibleGameNames] = useAtom(visibleGameNamesAtom);
    const [loading, setLoading] = useAtom(loadingAtom);
    const [error, setError] = useAtom(errorAtom);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                const dateRange = getDatesInRange(minDate, maxDate, tickDaysResolution);
                const data = await fetchGameData(dateRange);

                setVisibleGameNames(extractVisibleGameNames(data, topRanksShowed))
                setDataset(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [minDate, maxDate, tickDaysResolution, topRanksShowed, setVisibleGameNames, setDataset, setLoading, setError]);

    return {dataset, loading, error};
}

function getDatesInRange(startDate: Date, endDate: Date, resolution: number): string[] {
    const dates: Date[] = [];
    const dayDifference = Math.round(Math.abs(+endDate - +startDate) / (24 * 60 * 60 * 1000)) + 1;
    const leftoverDays = dayDifference % resolution;

    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() - leftoverDays);

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + resolution);
    }

    return dates.map(date => date.toISOString().split('T')[0]);
}

async function fetchGameData(
    dateRange: string[],
): Promise<GameDayRanks[]> {
    if (!dateRange.length) return [];

    const fetchPromises = dateRange.map(async (date) => {
        const response = await fetch(`/data/${date}.csv`);
        return {date, text: await response.text()};
    });

    const results = await Promise.all(fetchPromises);

    const allGameDayRanks = results.map(({date, text}) => {
        return new Promise<GameDayRanks>((resolve, reject) => {
            Papa.parse(text, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const data = results.data as GameRow[];
                    const mappedData = data.reduce((acc, {name, rank}) => ({
                        ...acc,
                        [name]: rank
                    }), {day: date} as GameDayRanks);
                    resolve(mappedData);
                },
                error: (error: Error) => reject(new Error(`Failed to parse CSV for ${date}: ${error.message}`))
            });
        });
    });

    const processedData = await Promise.all(allGameDayRanks);
    return processedData.filter((gameDayRanks) => Object.keys(gameDayRanks).length > 2);
}

function extractVisibleGameNames(data: GameDayRanks[], topRanksShowed: number): string[] {
    return Array.from(new Set(
        data.flatMap(dayRanks => Object.keys(dayRanks)
            .filter(key => Number(dayRanks[key]) < topRanksShowed))
    ));
}
