// useGameData.ts
import {useAtom, useAtomValue} from 'jotai';
import {useEffect} from 'react';
import {
    datapointNumberVisibleAtom,
    datasetAtom,
    errorAtom,
    GameDayRanks,
    GameRow,
    loadingAtom,
    maxDateAtom,
    MILLIS_IN_DAY,
    minDateAtom,
    topRanksShowedAtom,
    visibleGameNamesAtom
} from './atoms';
import Papa from "papaparse";

export function useGameData() {
    const minDate = useAtomValue(minDateAtom);
    const maxDate = useAtomValue(maxDateAtom);
    const datapointNumberVisible = useAtomValue(datapointNumberVisibleAtom);
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
                const dateRange = getDatesInRange(minDate, maxDate, datapointNumberVisible);
                const data = await fetchGameData(dateRange);

                setDataset(data);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error occurred');
            } finally {
                setLoading(false);
            }

        };

        loadData();
    }, [minDate, maxDate, setDataset, setLoading, setError, datapointNumberVisible]);

    useEffect(() => {
        const gameNames = Array.from(new Set(
            dataset.flatMap(dayRanks => Object.keys(dayRanks)
                .filter(key => Number(dayRanks[key]) < topRanksShowed))
        ));
        setVisibleGameNames(gameNames)
    }, [dataset, topRanksShowed, setVisibleGameNames]);

    return {dataset, loading, error, topRanksShowed};
}

function getDatesInRange(startDate: Date, endDate: Date, datapointNumberVisible: number): string[] {
    const dates: Date[] = [];

    const datapointResolution =
        (endDate.getTime() - startDate.getTime()) / MILLIS_IN_DAY / (datapointNumberVisible - 1) // -1 to include the last day

    const currentDate = new Date(endDate);

    while (currentDate >= startDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() - datapointResolution);
    }

    dates.reverse() // starting from oldest

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

