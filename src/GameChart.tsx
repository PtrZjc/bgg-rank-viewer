// GameChart.tsx
import React, { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useGameData } from './useGameData';

const lineColors = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F",
    "#FFBB28", "#FF8042", "#0088FE", "#00C49F", "#FFBB28"
];

export const GameChart: React.FC = () => {
    const { dataset, loading, error } = useGameData();

    const gameNames = useMemo(() => {
        if (dataset.length === 0) return [];
        return Object.keys(dataset[0]).filter(key => key !== 'day');
    }, [dataset]);

    if (loading) {
        return <div className="flex items-center justify-center h-96">Loading data...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (dataset.length === 0) {
        return <div className="text-gray-500">No data available</div>;
    }

    return (
        <div className="w-full h-[500px]">
            <ResponsiveContainer>
                <LineChart
                    data={dataset}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="day"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        label={{
                            value: 'Rank',
                            angle: -90,
                            position: 'insideLeft',
                            style: { textAnchor: 'middle' }
                        }}
                    />
                    <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value, name) => [`Rank ${value}`, name]}
                    />
                    <Legend />
                    {gameNames.map((gameName, index) => (
                        <Line
                            key={gameName}
                            type="monotone"
                            dataKey={gameName}
                            name={gameName}
                            stroke={lineColors[index % lineColors.length]}
                            dot={false}
                            activeDot={{ r: 8 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
