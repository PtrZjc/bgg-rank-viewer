import React, {useMemo} from "react";
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
import {Line} from "react-chartjs-2";
import {useGameData} from "components/Game/useGameData";
import {useGameDataStore} from "components/Game/useGameDataStore";

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
  const {loading, error} = useGameData();

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

  const {labels, datasets} = useMemo(() => {
    if (dataset.length === 0) return {labels: [], datasets: []};

    const labels = dataset.map((entry) =>
      new Date(entry.day).toLocaleDateString()
    );

    // Create a map from game ID to its position in visibleGamesData (right side)
    // This ensures colors match the order on the right side
    const gameColorIndexMap = new Map(
      visibleGamesData.map((game, index) => [game.id.toString(), index])
    );

    const datasets = allGameNames.map((gameId) => {
      // Get the color index from the game's position in visibleGamesData
      const colorIndex = gameColorIndexMap.get(gameId) ?? 0;
      const color = lineColors[colorIndex % lineColors.length];

      // Find the game name for the label
      const gameName = visibleGamesData.find(g => g.id.toString() === gameId)?.name ?? gameId;

      return {
        label: gameName,
        data: dataset.map((entry) => entry[gameId] as number | undefined),
        borderColor: color,
        backgroundColor: color,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 4,
        spanGaps: true,
        borderWidth: 1.5,
        hoverBorderWidth: 3,
        hoverBorderColor: color,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: "white",
        pointHitRadius: 10,
      };
    });

    return {labels, datasets};
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
    <div style={{height: `${chartHeight}px`}} className="w-full">
      <div className="flex h-full">
        {/* Left column - Chart */}
        <div className="flex-grow h-full">
          <Line options={options} data={{labels, datasets}}/>
        </div>

        {/* Right column - Game names */}
        <div className="h-full flex flex-col">
          {visibleGamesData.map(({name, rank, link, rankDifference}, index) => {
            // Colors are assigned based on position in visibleGamesData (right side order)
            return (
              <div
                key={index}
                className="flex items-center pl-1"
                style={{height: `${rowHeight}px`}}
              >
                <p
                  style={{color: `${lineColors[index % lineColors.length]}`}}
                  className="text-lg flex items-center w-full"
                >
                  <span className="mr-1">{rank}.</span>
                  <a href={`https://boardgamegeek.com${link}`} className="truncate">{name}</a>
                  {(rankDifference == 0 || rankDifference) && (
                    <span
                      className={`text-xs ml-2 px-1 py-0.5 rounded-full font-medium ${getTagColorClass(rankDifference)}`}
                    >
                    {rankDifference > 0 ? `+${rankDifference}` : rankDifference}
                  </span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Calculate color intensity based on rank difference
function getTagColorClass(rankDifference: number) {
  let tagColorClass = '';
  const absValue = Math.abs(rankDifference);
  const intensity = Math.min(absValue / 100, 1);

  if (rankDifference === 0) {
    tagColorClass = 'bg-white text-blue-600'
  } else if (rankDifference > 0) {
    if (intensity < 0.2) tagColorClass = 'bg-green-50 text-green-600';
    else if (intensity < 0.4) tagColorClass = 'bg-green-100 text-green-700';
    else if (intensity < 0.6) tagColorClass = 'bg-green-200 text-green-800';
    else if (intensity < 0.8) tagColorClass = 'bg-green-300 text-green-900';
    else tagColorClass = 'bg-green-400 text-green-900';
  } else {
    if (intensity < 0.2) tagColorClass = 'bg-red-50 text-red-600';
    else if (intensity < 0.4) tagColorClass = 'bg-red-100 text-red-700';
    else if (intensity < 0.6) tagColorClass = 'bg-red-200 text-red-800';
    else if (intensity < 0.8) tagColorClass = 'bg-red-300 text-red-900';
    else tagColorClass = 'bg-red-400 text-red-900';
  }
  return tagColorClass;
}
