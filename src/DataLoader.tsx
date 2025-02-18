import {useEffect, useState} from 'react';
import Papa from 'papaparse';
import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts";

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
    const [minDate, setMinDate] = useState(getDaysAgoFromToday(7*4*6));
    const [maxDate, setMaxDate] = useState(new Date());
    // const [minDate, setMinDate] = useState(new Date('2025-02-01'));
    // const [maxDate, setMaxDate] = useState(new Date('2025-02-07'));
    const [tickDaysResolution, setTickDaysResolution] = useState(7);
    const [topRanksShowed, setTopRanksShowed] = useState(30);
    const [dataset, setDataset] = useState<GameDayRanks[]>([]);

    const absoluteMinDate = new Date('2024-04-01');

    useEffect(() => {
        loadData(getDatesInRange(minDate, maxDate));
    }, [minDate, maxDate, tickDaysResolution, topRanksShowed]);

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
                        preview: topRanksShowed, // limit number of rows to preview
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
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
            setLoading(false);
        }
    };

    const getGameNames = (): string[] => {
        if (dataset.length === 0) return [];

        // Get all keys except 'day' from the first data point
        const firstDataPoint = dataset[0];
        return Object.keys(firstDataPoint).filter(key => key !== 'day');
    };

    const lineColors = [
        "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F",
        "#FFBB28", "#FF8042", "#0088FE", "#00C49F", "#FFBB28"
    ];

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
            <div>
                <label>Select date resolution:</label>
                <input
                    type="number"
                    value={tickDaysResolution}
                    min="1"
                    max="100"
                    onChange={(e) => setTickDaysResolution(Number(e.target.value))}
                />
            </div>
            <div>
                <label>Select top ranks showed:</label>
                <input
                    type="number"
                    value={topRanksShowed}
                    min="1"
                    max="500"
                    onChange={(e) => setTopRanksShowed(Number(e.target.value))}
                />
            </div>


            {loading && <div>Loading data...</div>}
            {error && <div>Error: {error}</div>}
            {dataset.length > 0 && !loading && !error && (
                <LineChart
                    width={1000}
                    height={500}
                    data={dataset}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="day"/>
                    <YAxis/>
                    {/*<Tooltip/>*/}
                    {/*<Legend/>*/}
                    {getGameNames().map((gameName, index) => (
                        <Line
                            key={gameName}
                            type="monotone"
                            dataKey={gameName}
                            name={gameName}
                            stroke={lineColors[index % lineColors.length]}
                            activeDot={{r: 8}}
                        />
                    ))}
                </LineChart>
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
        const dayDifference = getDayDifference(startDate, endDate) + 1; // both start and end dates are inclusive
        const leftoverDays = dayDifference % tickDaysResolution;

        // Adjust start date by subtracting leftover days to get perfect intervals

        let currentDate = getDateWithOffset(startDate, -leftoverDays);
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate = getDateWithOffset(currentDate, tickDaysResolution);
        }

        const dateStrings = dates.map(date => date.toISOString().split('T')[0]);
        return dateStrings;

        function getDayDifference(date1: Date, date2: Date) {
            const oneDayMillis = 24 * 60 * 60 * 1000;
            const firstDate = new Date(date1);
            const secondDate = new Date(date2);
            return Math.round(Math.abs(+secondDate - +firstDate) / oneDayMillis);
        }

        function getDateWithOffset(initialDate: Date, dayDifference: number): Date {
            const newDate = new Date(initialDate);
            newDate.setDate(initialDate.getDate() + dayDifference);
            return newDate;
        }
    }


    function mapToGameDayRanks(rows: GameRow[], date: string): GameDayRanks {
        return rows.reduce((acc, {name, rank}) => ({
            ...acc,
            [name]: rank
        }), {day: date} as GameDayRanks);
    }
};

export default DataLoader;
