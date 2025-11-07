import { describe, it, expect, beforeEach } from 'vitest'
import { useGameDataStore } from './useGameDataStore'
import { DailyGameData } from 'src/types'

describe('useGameDataStore', () => {
  beforeEach(() => {
    // Reset store to initial state by setting empty data
    useGameDataStore.setState({
      dailyGameData: [],
      dataset: [],
      visibleGamesData: [],
      visibleGameNames: [],
      allGameNames: [],
    })
  })

  describe('initial state', () => {
    it('has empty arrays initially', () => {
      const state = useGameDataStore.getState()

      expect(state.dailyGameData).toEqual([])
      expect(state.dataset).toEqual([])
      expect(state.visibleGamesData).toEqual([])
      expect(state.visibleGameNames).toEqual([])
      expect(state.allGameNames).toEqual([])
    })
  })

  describe('setDailyGameDataAndDataset', () => {
    it('processes and sets daily game data', () => {
      const mockData: DailyGameData[] = [
        {
          day: new Date('2024-04-01'),
          data: [
            { rank: 1, id: '174430', name: 'Gloomhaven' },
            { rank: 2, id: '291457', name: 'Brass: Birmingham' },
            { rank: 3, id: '224517', name: 'Ark Nova' },
          ],
        },
      ]

      const { setDailyGameDataAndDataset } = useGameDataStore.getState()
      setDailyGameDataAndDataset(mockData)

      const state = useGameDataStore.getState()

      // Should store daily game data
      expect(state.dailyGameData).toEqual(mockData)

      // Should create dataset
      expect(state.dataset).toHaveLength(1)
      expect(state.dataset[0]).toHaveProperty('day')
      expect(state.dataset[0]).toHaveProperty('Gloomhaven', 1)
      expect(state.dataset[0]).toHaveProperty('Brass: Birmingham', 2)
      expect(state.dataset[0]).toHaveProperty('Ark Nova', 3)
    })

    it('extracts all unique game names', () => {
      const mockData: DailyGameData[] = [
        {
          day: new Date('2024-04-01'),
          data: [
            { rank: 1, id: '174430', name: 'Gloomhaven' },
            { rank: 2, id: '291457', name: 'Brass: Birmingham' },
          ],
        },
        {
          day: new Date('2024-04-02'),
          data: [
            { rank: 1, id: '174430', name: 'Gloomhaven' },
            { rank: 2, id: '224517', name: 'Ark Nova' },
          ],
        },
      ]

      const { setDailyGameDataAndDataset } = useGameDataStore.getState()
      setDailyGameDataAndDataset(mockData)

      const state = useGameDataStore.getState()

      // Should have 3 unique game names
      expect(state.allGameNames).toContain('Gloomhaven')
      expect(state.allGameNames).toContain('Brass: Birmingham')
      expect(state.allGameNames).toContain('Ark Nova')
      expect(state.allGameNames).toHaveLength(3)
    })

    it('handles multiple days of data', () => {
      const mockData: DailyGameData[] = [
        {
          day: new Date('2024-04-01'),
          data: [
            { rank: 1, id: '1', name: 'Game A' },
            { rank: 2, id: '2', name: 'Game B' },
          ],
        },
        {
          day: new Date('2024-04-02'),
          data: [
            { rank: 2, id: '1', name: 'Game A' },
            { rank: 1, id: '2', name: 'Game B' },
          ],
        },
        {
          day: new Date('2024-04-03'),
          data: [
            { rank: 3, id: '1', name: 'Game A' },
            { rank: 1, id: '2', name: 'Game B' },
          ],
        },
      ]

      const { setDailyGameDataAndDataset } = useGameDataStore.getState()
      setDailyGameDataAndDataset(mockData)

      const state = useGameDataStore.getState()

      expect(state.dataset).toHaveLength(3)
      expect(state.dataset[0]['Game A']).toBe(1)
      expect(state.dataset[1]['Game A']).toBe(2)
      expect(state.dataset[2]['Game A']).toBe(3)
    })
  })

  describe('calculateVisibleGamesData', () => {
    beforeEach(() => {
      // Set up mock data for these tests
      const mockData: DailyGameData[] = [
        {
          day: new Date('2024-04-01'),
          data: [
            { rank: 1, id: '1', name: 'Top Game' },
            { rank: 2, id: '2', name: 'Second Game' },
            { rank: 3, id: '3', name: 'Third Game' },
            { rank: 10, id: '4', name: 'Lower Game' },
          ],
        },
        {
          day: new Date('2024-04-02'),
          data: [
            { rank: 2, id: '1', name: 'Top Game' },
            { rank: 1, id: '2', name: 'Second Game' },
            { rank: 3, id: '3', name: 'Third Game' },
            { rank: 11, id: '4', name: 'Lower Game' },
          ],
        },
      ]

      const { setDailyGameDataAndDataset } = useGameDataStore.getState()
      setDailyGameDataAndDataset(mockData)
    })

    it('filters games by top rank threshold', () => {
      const { calculateVisibleGamesData } = useGameDataStore.getState()

      calculateVisibleGamesData(3)

      const state = useGameDataStore.getState()

      // Should only show top 3 games from last day
      expect(state.visibleGamesData).toHaveLength(3)
      expect(state.visibleGameNames).toEqual([
        'Second Game',
        'Top Game',
        'Third Game',
      ])
    })

    it('calculates rank differences correctly', () => {
      const { calculateVisibleGamesData } = useGameDataStore.getState()

      calculateVisibleGamesData(5)

      const state = useGameDataStore.getState()

      // Find 'Top Game' in visible data
      const topGame = state.visibleGamesData.find(
        (game) => game.name === 'Top Game'
      )

      // Rank went from 1 to 2, so difference should be -1
      expect(topGame?.rankDifference).toBe(-1)

      // Find 'Second Game'
      const secondGame = state.visibleGamesData.find(
        (game) => game.name === 'Second Game'
      )

      // Rank went from 2 to 1, so difference should be 1
      expect(secondGame?.rankDifference).toBe(1)
    })

    it('sorts games by current rank', () => {
      const { calculateVisibleGamesData } = useGameDataStore.getState()

      calculateVisibleGamesData(5)

      const state = useGameDataStore.getState()

      // Should be sorted by rank (1, 2, 3, ...)
      expect(state.visibleGamesData[0].rank).toBe(1)
      expect(state.visibleGamesData[1].rank).toBe(2)
      expect(state.visibleGamesData[2].rank).toBe(3)
    })

    it('returns empty when no data exists', () => {
      // Explicitly clear the store (nested beforeEach set up data)
      useGameDataStore.setState({
        dailyGameData: [],
        dataset: [],
        visibleGamesData: [],
        visibleGameNames: [],
        allGameNames: [],
      })

      const { calculateVisibleGamesData } = useGameDataStore.getState()

      calculateVisibleGamesData(5)

      const state = useGameDataStore.getState()

      // When there's no data, calculateVisibleGamesData returns state unchanged
      expect(state.visibleGamesData).toEqual([])
      expect(state.visibleGameNames).toEqual([])
    })

    it('handles games with no historical data (undefined rankDifference)', () => {
      // Add a game that only appears in the last day
      // Note: We need at least 2 games per day to pass the filter (>2 keys including 'day')
      const mockDataWithNewGame: DailyGameData[] = [
        {
          day: new Date('2024-04-01'),
          data: [
            { rank: 1, id: '1', name: 'Old Game' },
            { rank: 2, id: '3', name: 'Another Old Game' },
          ],
        },
        {
          day: new Date('2024-04-02'),
          data: [
            { rank: 1, id: '2', name: 'New Game' },
            { rank: 2, id: '1', name: 'Old Game' },
            { rank: 3, id: '3', name: 'Another Old Game' },
          ],
        },
      ]

      const { setDailyGameDataAndDataset, calculateVisibleGamesData } =
        useGameDataStore.getState()

      setDailyGameDataAndDataset(mockDataWithNewGame)
      calculateVisibleGamesData(5)

      const state = useGameDataStore.getState()

      const newGame = state.visibleGamesData.find(
        (game) => game.name === 'New Game'
      )

      // New game has no rank difference because it didn't appear in first day
      expect(newGame?.rankDifference).toBeUndefined()
    })
  })
})
