import { vi } from 'vitest'

/**
 * Mock for react-chartjs-2 Line component
 * Use this in tests that render GameChart
 */
export const mockLineChart = vi.fn(() => <div data-testid="mock-line-chart" />)

/**
 * Mock Chart.js for tests
 * Import this at the top of test files that use Chart.js:
 *
 * vi.mock('react-chartjs-2', () => ({
 *   Line: mockLineChart,
 * }))
 */
export function setupChartMock() {
  vi.mock('react-chartjs-2', () => ({
    Line: mockLineChart,
  }))
}
