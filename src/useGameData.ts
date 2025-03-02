// useGameData.ts
import { useEffect } from 'react';
import {
    DailyGameData,
    MILLIS_IN_DAY,
    useDateStore
} from './state.ts';
import Papa from "papaparse";
import { useGameDataStore } from "./useGameDataStore.ts";

export function useGameData() {
    // Use individual selectors for better performance
    const minDate = useDateStore(state => state.minDate);
    const maxDate = useDateStore(state => state.maxDate);
    const datapointNumberVisible = useDateStore(state => state.datapointNumberVisible);
    const loading = useDateStore(state => state.loading);
    const error = useDateStore(state => state.error);
    const setLoading = useDateStore(state => state.setLoading);
    const setError = useDateStore(state => state.setError);

    const setDailyGameDataAndDataset = useGameDataStore(state => state.setDailyGameDataAndDataset);
    const calculateVisibleGamesData = useGameDataStore(state => state.calculateVisibleGamesData);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                const dateRange = getDatesInRange(minDate, maxDate, datapointNumberVisible);
                const dailyGameData = await fetchGameData(dateRange);

                if (isMounted) {
                    setDailyGameDataAndDataset(dailyGameData);
                    // Calculate visible games with default value of 100
                    calculateVisibleGamesData(100);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Unknown error occurred');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [minDate, maxDate, datapointNumberVisible]);

    return { loading, error };
}

function getDatesInRange(startDate: Date, endDate: Date, datapointNumberVisible: number): string[] {
    const dates: Date[] = [];

    const datapointResolution =
        Math.max(1, Math.floor((endDate.getTime() - startDate.getTime()) / MILLIS_IN_DAY / (datapointNumberVisible - 1))); // -1 to include the last day

    const currentDate = new Date(endDate);

    while (currentDate >= startDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() - datapointResolution);
    }

    dates.reverse(); // starting from oldest

    return dates.map(date => date.toISOString().split('T')[0]);
}

async function fetchGameData(
    dateRange: string[],
): Promise<DailyGameData[]> {
    if (!dateRange.length) return [];

    const fetchPromises = dateRange.map(async (date) => {
        const response = await fetch(`/data/${date}.csv`);
        return { date, text: await response.text() };
    });

    const results = await Promise.all(fetchPromises);

    const parseTextToGameData = results.map(({ date, text }) => {
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
    return processedData.map((data, index) => ({ day: dateRange[index], data }));
}

interface GameData {
    rank: number;
    name: string;
    link: string;
}
