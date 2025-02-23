// useGameData.ts
import {useAtom, useAtomValue} from 'jotai';
import {useEffect} from 'react';
import {
    DailyGameData,
    datapointNumberVisibleAtom,
    datasetAtom,
    errorAtom,
    GameData,
    GameDayRanks,
    GameDisplayData,
    gameDisplayDataDataAtom,
    loadingAtom,
    MILLIS_IN_DAY,
    topRanksShowedAtom,
    useDateStore,
    visibleGameNamesAtom
} from './state.ts';
import Papa from "papaparse";

export function useGameData() {
    const minDate = useDateStore(state => state.minDate);
    const maxDate = useDateStore(state => state.maxDate);
    const datapointNumberVisible = useAtomValue(datapointNumberVisibleAtom);
    const topRanksShowed = useAtomValue(topRanksShowedAtom);

    const [dataset, setDataset] = useAtom(datasetAtom);
    const [_gameDisplayDataData, setGameDisplayDataData] = useAtom(gameDisplayDataDataAtom);
    const [_visibleGameNames, setVisibleGameNames] = useAtom(visibleGameNamesAtom);
    const [loading, setLoading] = useAtom(loadingAtom);
    const [error, setError] = useAtom(errorAtom);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                const dateRange = getDatesInRange(minDate, maxDate, datapointNumberVisible);
                const dailyGameData = await fetchGameData(dateRange);
                const dataset = mapToDataset(dailyGameData);

                const lastDayData = dailyGameData[dailyGameData.length - 1].data.reduce((acc, {name, rank, link}) => ({
                    ...acc, [name]: {newestRank: rank, link}
                }), {} as GameDisplayData);

                console.log('Last day data:', lastDayData);
                setGameDisplayDataData(lastDayData);
                setDataset(dataset);

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
): Promise<DailyGameData[]> {
    if (!dateRange.length) return [];

    const fetchPromises = dateRange.map(async (date) => {
        const response = await fetch(`/data/${date}.csv`);
        return {date, text: await response.text()};
    });

    const results = await Promise.all(fetchPromises);

    const parseTextToGameData = results.map(({date, text}) => {
        return new Promise<GameData[]>((resolve, reject) => {
            Papa.parse(text, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => resolve(results.data as GameData[]),
                error: (error: Error) => reject(new Error(`Failed to parse CSV for ${date}: ${error.message}`))
            });
        });
    });
    const processedData = await Promise.all(parseTextToGameData);
    return processedData.map((data, index) => ({day: dateRange[index], data}));
}

function mapToDataset(dailyGameData: DailyGameData[]) {
    return dailyGameData.map(({day, data}) => {
        return data.reduce((acc, {name, rank}) => ({
            ...acc,
            [name]: rank
        }), {day} as GameDayRanks);
    }).filter(dayRanks => Object.keys(dayRanks).length > 2);
}
