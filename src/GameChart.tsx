import React, {useMemo} from 'react';
import {
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    LineElement,
    Plugin,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {useGameData} from './useGameData';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip
);

const lineColors = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F",
    "#FFBB28", "#FF8042", "#0088FE", "#00C49F", "#FFBB28"
];

export const GameChart: React.FC = () => {
    const {dataset, loading, error} = useGameData();

    const {labels, datasets} = useMemo(() => {
        if (dataset.length === 0) return {labels: [], datasets: []};

        // Collect all unique game names from all datasets
        const gameNames = Array.from(new Set(
            dataset.flatMap(entry =>
                Object.keys(entry).filter(key => key !== 'day')
            )
        ));

        const labels = dataset.map(entry => new Date(entry.day).toLocaleDateString());

        const datasets = gameNames.map((gameName, index) => ({
            label: gameName,
            data: dataset.map(entry => entry[gameName] as number),
            borderColor: lineColors[index % lineColors.length],
            backgroundColor: lineColors[index % lineColors.length],
            tension: 0.1,
            pointRadius: 0,
            pointHoverRadius: 8,
            spanGaps: true,
        }));

        return {labels, datasets};
    }, [dataset]);

    // Plugin for end-of-line labels
    const endLineLabelsPlugin: Plugin = {
        id: 'endLineLabels',
        afterDatasetsDraw(chart) {
            const {ctx, scales: {x, y}} = chart;

            chart.data.datasets.forEach((dataset) => {
                const lastDataPoint = dataset.data[dataset.data.length - 1] as number;
                if (lastDataPoint === undefined) return;

                const xScale = x.getPixelForTick(dataset.data.length - 1);
                const yScale = y.getPixelForValue(lastDataPoint);

                ctx.save();
                ctx.fillStyle = dataset.borderColor as string;
                ctx.font = '12px Arial';
                ctx.textBaseline = 'middle';
                ctx.fillText(
                    dataset.label || '',
                    xScale + 10,
                    yScale
                );
                ctx.restore();
            });
        }
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Rank'
                },
                reverse: true,
            },
            x: {
                title: {
                    display: true,
                    text: 'Date'
                }
            }
        },
        plugins: {
            legend: {
                display: false // Hide the legend since we're using end-of-line labels
            }
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
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
        <div className="w-100% h-200">
            <Line
                options={options}
                data={{labels, datasets}}
                plugins={[endLineLabelsPlugin]}
            />
        </div>
    );
};
