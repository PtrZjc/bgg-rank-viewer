import React, {useMemo} from 'react';
import {
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    TooltipItem
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {useGameData} from './useGameData';
import {gameDisplayDataDataAtom, topRanksShowedAtom, visibleGameNamesAtom} from "./state.ts";
import {useAtomValue} from "jotai";
import {useScreenSize} from "./useScreenSize.ts";

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
    const {isSmAndDown, isXl} = useScreenSize();

    const gameNames = useAtomValue(visibleGameNamesAtom);
    const topRanksShowed = useAtomValue(topRanksShowedAtom);
    const gameDisplayDataData = useAtomValue(gameDisplayDataDataAtom);

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                ticks: {
                    stepSize: 1,
                    autoSkip: false
                },
                min: 1,
                max: topRanksShowed,
                title: {
                    display: !isSmAndDown,
                    text: 'Rank'
                },
                reverse: true,
            },
            x: {
                ticks: {
                    autoSkip: true,
                    maxRotation: 90, // Rotate labels for better fit
                    minRotation: 90  // Keep consistent rotation
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: true,
                mode: 'dataset',
                intersect: true,
                position: 'nearest',
                yAlign: 'bottom',
                caretPadding: 10,
                callbacks: {
                    // Show only title (game name)
                    title: (contexts: TooltipItem<'line'>[]) => {
                        if (contexts.length > 0) {
                            // console.log(contexts[0]);
                            return contexts[0].dataset.label;
                        }
                        return '';
                    },
                    label: () => ''
                },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                padding: 10,
                displayColors: false
            }
        },
        interaction: {
            mode: 'dataset',
            intersect: true,
        },
        hover: {
            mode: 'dataset',
            intersect: false
        },
        layout: {
            padding: {
                right: isXl ? 200 : 0
            }
        }
    };

    // Create plugin instance once
    const endLineLabelsPlugin = {

        id: 'endLineLabels' as const,
        afterDatasetsDraw(chart: any) {
            if (!isXl) return

            const {ctx, scales: {x, y}} = chart;
            const maxY = chart.scales.y.options.max;

            chart.data.datasets.forEach((dataset: any) => {
                const lastDataPoint = dataset.data[dataset.data.length - 1];
                if (lastDataPoint === undefined || lastDataPoint > maxY) return;

                const xScale = x.getPixelForTick(dataset.data.length - 1);
                const yScale = y.getPixelForValue(lastDataPoint);

                const rank = gameDisplayDataData[dataset.label].newestRank;
                const text = `${rank}. ${dataset.label}`;
                ctx.save();
                ctx.fillStyle = dataset.borderColor;
                ctx.font = '12px Arial';
                ctx.textBaseline = 'middle';
                ctx.fillText(
                    text || '',
                    xScale + 5,
                    yScale
                );
                ctx.restore();
            });
        }
    }

    const {labels, datasets} = useMemo(() => {
        if (dataset.length === 0) return {labels: [], datasets: []};

        const labels = dataset.map(entry => new Date(entry.day).toLocaleDateString());

        const datasets = gameNames.map((gameName, index) => ({
            label: gameName,
            data: dataset.map(entry => entry[gameName] as number | undefined),
            borderColor: lineColors[index % lineColors.length],
            backgroundColor: lineColors[index % lineColors.length],
            tension: 0.1,
            pointRadius: 0,
            pointHoverRadius: 4,
            spanGaps: true,
            borderWidth: 1.5,
            hoverBorderWidth: 3,
            hoverBorderColor: lineColors[index % lineColors.length],
            pointHoverBackgroundColor: lineColors[index % lineColors.length],
            pointHoverBorderColor: 'white',
            pointHitRadius: 10,
        }));

        return {labels, datasets};
    }, [dataset, gameNames]);

    if (loading) {
        return <div className="flex items-center justify-center h-96">Loading data...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (dataset.length === 0) {
        return <div className="text-gray-500">No data available</div>;
    }

    // Simple height calculation
    const chartHeight = topRanksShowed * (isSmAndDown ? 15 : 20) + 100;

    return (
        <div style={{height: `${chartHeight}px`}}>
            <Line
                options={options}
                data={{labels, datasets}}
                // plugins={isXl ? [endLineLabelsPlugin] : []}
                plugins={[endLineLabelsPlugin]}
            />
        </div>
    );
};
