import {useCallback, useEffect, useState} from 'react';
import Papa from 'papaparse';
import React, { PureComponent } from 'react';
type GameRow = {
    rank: number;
    name: string;
    link: string;
}

type GameDayRanks = {
    day: string;
    [gameName: string]: number | string;
}

const DataLoader = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [minDate, setMinDate] = useState(getDaysAgoFromToday(7));
    const [maxDate, setMaxDate] = useState(new Date());
    const [dataset, setDataset] = useState<GameDayRanks[]>([]);

    const absoluteMinDate = new Date('2024-04-01');

    useEffect(() => {
        loadData(getDatesInRange(minDate, maxDate));
    }, [minDate, maxDate]);

    const loadData = async (dateRange: string[]) => {
        if (!dateRange.length) return;

        setLoading(true);
        setError(null);

        try {
            // Create promises of all fetches
            const fetchPromises = dateRange.map(async (date) => {
                const response = await fetch(`/data/${date}.csv`);
                return {date, text: await response.text()};
            });

            // Wait for all fetches to complete
            const results = await Promise.all(fetchPromises);

            // Process each CSV file
            const allGameDayRanks = results.map(({date, text}) => {
                return new Promise<GameDayRanks>((resolve, reject) => {
                    Papa.parse(text, {
                        preview: 50, // limit number of rows to preview
                        header: true,
                        dynamicTyping: true,
                        skipEmptyLines: true,
                        complete: (results) => resolve(mapToGameDayRanks(results.data as GameRow[], date)),
                        error: (error: Error) => reject(new Error(`Failed to parse CSV for ${date}: ${error.message}`))
                    });
                });
            });

            // Wait for all parsing to complete
            const processedData = (await Promise.all(allGameDayRanks))
                .filter((gameDayRanks) => Object.keys(gameDayRanks).length > 2);
            setDataset(processedData);
            setLoading(false);

            console.log('processedData:', processedData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
            setLoading(false);
        }
    };

    return (
        <div>
            <div>
                <label>Select minimum date:</label>
                <input
                    type="date"
                    value={minDate.toISOString().split('T')[0]}
                    min={absoluteMinDate.toISOString().split('T')[0]}
                    max={maxDate.toISOString().split('T')[0]}
                    onChange={(e) => setMinDate(new Date(e.target.value))}
                />
            </div>
            <div>
                <label>Select maximum date:</label>
                <input
                    type="date"
                    value={maxDate.toISOString().split('T')[0]}
                    min={minDate.toISOString().split('T')[0]}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setMaxDate(new Date(e.target.value))}
                />
            </div>


            {loading && <div>Loading data...</div>}
            {error && <div>Error: {error}</div>}
            {dataset.length > 0 && !loading && !error && (
                <div>something worked</div>
            )
            }
        </div>
    );

    function getDaysAgoFromToday(days: number): Date {
        const daysInMillis = days * 1000 * 60 * 60 * 24;
        return new Date(new Date().getTime() - daysInMillis);
    }

    function getDatesInRange(startDate: Date, endDate: Date): string[] {
        const dates: Date[] = [];
        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates.map(date => date.toISOString().split('T')[0]);
    }

    function mapToGameDayRanks(rows: GameRow[], date: string): GameDayRanks {
        return rows.reduce((acc, {name, rank}) => ({
            ...acc,
            [name]: rank
        }), {day: date} as GameDayRanks);
    }
};

export default DataLoader;
