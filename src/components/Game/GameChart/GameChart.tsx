import React, { useMemo } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useGameData } from "components/Game/useGameData";
import { useGameDataStore } from "components/Game/useGameDataStore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

const lineColors = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
];

export const GameChart: React.FC = () => {
  const { loading, error } = useGameData();

  const dataset = useGameDataStore((state) => state.dataset);
  const allGameNames = useGameDataStore((state) => state.allGameNames);
  const visibleGamesData = useGameDataStore((state) => state.visibleGamesData);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          display: false,
          stepSize: 1,
          autoSkip: false,
        },
        min: 1,
        max: visibleGamesData.length,
        title: {
          display: false,
          text: "Rank",
        },
        reverse: true,
      },
      x: {
        ticks: {
          display: false,
          autoSkip: true,
          maxRotation: 90,
          minRotation: 90,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: "dataset",
        intersect: true,
        position: "nearest",
        yAlign: "bottom",
        caretPadding: 10,
        callbacks: {
          title: (contexts: TooltipItem<"line">[]) => {
            if (contexts.length > 0) {
              return contexts[0].dataset.label;
            }
            return "";
          },
          label: () => "",
        },
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          size: 14,
          weight: "bold",
        },
        padding: 10,
        displayColors: false,
      },
    },
    interaction: {
      mode: "dataset",
      intersect: true,
    },
    hover: {
      mode: "dataset",
      intersect: false,
    },
    layout: {
      padding: {
        top: 10,
        // right: isXl ? 200 : 0
      },
    },
  };

  const { labels, datasets } = useMemo(() => {
    if (dataset.length === 0) return { labels: [], datasets: [] };

    const labels = dataset.map((entry) =>
      new Date(entry.day).toLocaleDateString()
    );

    const datasets = allGameNames.map((gameName, index) => ({
      label: gameName,
      data: dataset.map((entry) => entry[gameName] as number | undefined),
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
      pointHoverBorderColor: "white",
      pointHitRadius: 10,
    }));

    return { labels, datasets };
  }, [dataset, visibleGamesData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        Loading data...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (dataset.length === 0) {
    return <div className="text-gray-500">No data available</div>;
  }

  const rowHeight = 20;
  const chartHeight = visibleGamesData.length * rowHeight;

  return (
    <div style={{ height: `${chartHeight}px` }} className="w-full">
      <div className="flex h-full">
        {/* Left column - Ranks */}
        <div className="h-full flex flex-col">
          {visibleGamesData.map(({ rank }, index) => (
            <div
              key={index}
              className="flex items-center justify-items-end pr-1"
              style={{ height: `${rowHeight}px` }}
            >
              <p
                style={{ color: `${lineColors[index % lineColors.length]}` }}
                className="text-lg truncate w-full"
              >
                {rank}.
              </p>
            </div>
          ))}
        </div>

        {/* Middle column - Chart */}
        <div className="flex-grow h-full">
          <Line options={options} data={{ labels, datasets }} />
        </div>

        {/* Right column - Game names */}
        <div className="h-full flex flex-col">
          {visibleGamesData.map(({ name }, index) => (
            <div
              key={index}
              className="flex items-center pl-1"
              style={{ height: `${rowHeight}px` }}
            >
              <p
                style={{ color: `${lineColors[index % lineColors.length]}` }}
                className="text-lg truncate w-full"
              >
                {name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
