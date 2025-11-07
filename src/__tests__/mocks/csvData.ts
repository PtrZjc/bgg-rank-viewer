/**
 * Mock CSV data for testing game data loading
 */

export const mockGameData = [
  { rank: '1', id: '174430', name: 'Gloomhaven' },
  { rank: '2', id: '291457', name: 'Brass: Birmingham' },
  { rank: '3', id: '224517', name: 'Ark Nova' },
  { rank: '4', id: '167791', name: 'Terraforming Mars' },
  { rank: '5', id: '233078', name: 'Twilight Imperium: Fourth Edition' },
]

export const mockGameDataParsed = mockGameData.map(game => ({
  rank: parseInt(game.rank),
  id: game.id,
  name: game.name,
}))

/**
 * Mock CSV data for multiple dates
 */
export const mockHistoricalData = {
  '2024-04-01': [
    { rank: '1', id: '174430', name: 'Gloomhaven' },
    { rank: '2', id: '291457', name: 'Brass: Birmingham' },
    { rank: '3', id: '224517', name: 'Ark Nova' },
  ],
  '2024-04-02': [
    { rank: '1', id: '174430', name: 'Gloomhaven' },
    { rank: '2', id: '224517', name: 'Ark Nova' },
    { rank: '3', id: '291457', name: 'Brass: Birmingham' },
  ],
  '2024-04-03': [
    { rank: '1', id: '224517', name: 'Ark Nova' },
    { rank: '2', id: '174430', name: 'Gloomhaven' },
    { rank: '3', id: '291457', name: 'Brass: Birmingham' },
  ],
}

/**
 * Helper to create mock fetch response for CSV data
 */
export function createMockFetchResponse(csvData: string) {
  return Promise.resolve({
    ok: true,
    status: 200,
    text: () => Promise.resolve(csvData),
  } as Response)
}

/**
 * Convert mock data to CSV string
 */
export function convertToCSV(data: typeof mockGameData) {
  const header = 'rank,id,name\n'
  const rows = data.map(row => `${row.rank},${row.id},"${row.name}"`).join('\n')
  return header + rows
}
