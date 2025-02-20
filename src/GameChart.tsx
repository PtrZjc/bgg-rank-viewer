// GameChart.tsx
import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useGameData } from './useGameData';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const lineColors = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F",
    "#FFBB28", "#FF8042", "#0088FE", "#00C49F", "#FFBB28"
];

export const GameChart: React.FC = () => {
    const { dataset, loading, error } = useGameData();

    const { labels, datasets } = useMemo(() => {
        if (dataset.length === 0) return { labels: [], datasets: [] };

        // Get game names (excluding 'day' field)
        const gameNames = Object.keys(dataset[0]).filter(key => key !== 'day');

        // Extract labels (dates)
        const labels = dataset.map(entry =>
            new Date(entry.day).toLocaleDateString()
        );

        // Create datasets for each game
        const datasets = gameNames.map((gameName, index) => ({
            label: gameName,
            data: dataset.map(entry => entry[gameName] as number),
            borderColor: lineColors[index % lineColors.length],
            backgroundColor: lineColors[index % lineColors.length],
            tension: 0.1,
            pointRadius: 0,
            pointHoverRadius: 8,
        }));

        return { labels, datasets };
    }, [dataset]);

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Rank'
                },
                reverse: true, // Lower rank numbers are better, so reverse the scale
            },
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            }
        },
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: (context) => {
                        return `${context.dataset.label}: Rank ${context.parsed.y}`;
                    }
                }
            },
            legend: {
                position: 'right' as const,
                labels: {
                    boxWidth: 12,
                    usePointStyle: true,
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

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
        <div className="w-[1200px] h-[2800px]">
            <Line
                options={options}
                data={{ labels, datasets }}
            />
        </div>
    );
};
