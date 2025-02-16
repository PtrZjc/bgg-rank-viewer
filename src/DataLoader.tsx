import { useState, useEffect } from 'react';
import Papa from 'papaparse';

type GameRow = {
    rank: number;
    name: string;
    link: string;
}

const DataLoader = () => {
  const [data, setData] = useState<GameRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');

  const minDate = '2024-04-01';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const maxDate = yesterday.toISOString().split('T')[0];

  useEffect(() => {
    setSelectedDate(maxDate);
  }, [maxDate]);

  const loadData = async (date: string) => {
    if (!date) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/data/${date}.csv`);
      if (!response.ok) {
        throw new Error(`No data available for ${date}`);
      }

      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Map CSV data to GameRow type
          const gameRows = results.data.map((row: any): GameRow => ({
            rank: Number(row.rank),
            name: String(row.name),
            link: String(row.link)
          }));

          setData(gameRows);
          setLoading(false);
        },
        error: (error: Error) => {
          setError(`Failed to parse CSV: ${error.message}`);
          setLoading(false);
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      loadData(selectedDate);
    }
  }, [selectedDate]);

  return (
    <div>
      <div>
        <label>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          min={minDate}
          max={maxDate}
          onChange={(e) => setSelectedDate(e.target.value)}

        />
      </div>

      {loading && <div>Loading data...</div>}
      {error && <div>Error: {error}</div>}

      {data.length > 0 && !loading && !error && (
        <div>
          <h2>Rankings for {selectedDate}</h2>
          <div>
            <table className={"table table-lg"}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {data.map((game) => (
                  <tr key={game.link}>
                    <td>{game.rank}</td>
                    <td>{game.name}</td>
                    <td>
                      <a
                        href={"https://boardgamegeek.com/" + game.link}
                        target="_blank"
                        rel="noopener noreferrer"

                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            Total games: {data.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default DataLoader;
