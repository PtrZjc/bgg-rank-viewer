import { describe, it, expect, beforeEach } from 'vitest'
import {
  useDateStore,
  ZERO_DATE,
  MILLIS_IN_DAY,
  DAYS_FROM_ZERO_DATE_TO_TODAY,
  DAYS_FROM_ZERO_DATE_TO_ONE_YEAR_AGO,
} from './store'

describe('useDateStore', () => {
  beforeEach(() => {
    // Reset the store to initial state before each test
    const state = useDateStore.getState()
    state.setDatesAsDaysAfterZeroDate(
      DAYS_FROM_ZERO_DATE_TO_ONE_YEAR_AGO,
      DAYS_FROM_ZERO_DATE_TO_TODAY
    )
    state.setDisplayDatesAsDaysAfterZeroDate(
      DAYS_FROM_ZERO_DATE_TO_ONE_YEAR_AGO,
      DAYS_FROM_ZERO_DATE_TO_TODAY
    )
    state.setDatapointNumberVisible(50)
    state.setLoading(false)
    state.setError(null)
  })

  describe('initial state', () => {
    it('has correct initial values', () => {
      const state = useDateStore.getState()

      // Should start approximately 1 year ago
      expect(state.minDate).toBeInstanceOf(Date)
      expect(state.maxDate).toBeInstanceOf(Date)
      expect(state.minDateDisplayed).toBeInstanceOf(Date)
      expect(state.maxDateDisplayed).toBeInstanceOf(Date)

      // Default datapoint number
      expect(state.datapointNumberVisible).toBe(50)

      // Not loading initially
      expect(state.loading).toBe(false)
      expect(state.error).toBe(null)
    })

    it('max date is approximately today', () => {
      const state = useDateStore.getState()
      const today = new Date()
      const diff = Math.abs(state.maxDate.getTime() - today.getTime())

      // Should be within 1 day (to handle test execution timing)
      expect(diff).toBeLessThan(MILLIS_IN_DAY)
    })
  })

  describe('setDatesAsDaysAfterZeroDate', () => {
    it('sets dates correctly based on days from zero date', () => {
      const { setDatesAsDaysAfterZeroDate } = useDateStore.getState()

      // Set to 10 days and 20 days after zero date
      setDatesAsDaysAfterZeroDate(10, 20)

      const state = useDateStore.getState()
      const expectedMinDate = new Date(
        ZERO_DATE.getTime() + 10 * MILLIS_IN_DAY
      )
      const expectedMaxDate = new Date(
        ZERO_DATE.getTime() + 20 * MILLIS_IN_DAY
      )

      expect(state.minDate.getTime()).toBe(expectedMinDate.getTime())
      expect(state.maxDate.getTime()).toBe(expectedMaxDate.getTime())
    })

    it('handles zero days correctly', () => {
      const { setDatesAsDaysAfterZeroDate } = useDateStore.getState()

      setDatesAsDaysAfterZeroDate(0, 0)

      const state = useDateStore.getState()
      expect(state.minDate.getTime()).toBe(ZERO_DATE.getTime())
      expect(state.maxDate.getTime()).toBe(ZERO_DATE.getTime())
    })
  })

  describe('setDisplayDatesAsDaysAfterZeroDate', () => {
    it('sets display dates independently from actual dates', () => {
      const { setDatesAsDaysAfterZeroDate, setDisplayDatesAsDaysAfterZeroDate } =
        useDateStore.getState()

      // Set actual dates
      setDatesAsDaysAfterZeroDate(0, 100)

      // Set display dates differently
      setDisplayDatesAsDaysAfterZeroDate(10, 20)

      const state = useDateStore.getState()

      // Actual dates should be 0-100
      expect(state.minDate.getTime()).toBe(ZERO_DATE.getTime())
      expect(state.maxDate.getTime()).toBe(
        new Date(ZERO_DATE.getTime() + 100 * MILLIS_IN_DAY).getTime()
      )

      // Display dates should be 10-20
      const expectedMinDisplayDate = new Date(
        ZERO_DATE.getTime() + 10 * MILLIS_IN_DAY
      )
      const expectedMaxDisplayDate = new Date(
        ZERO_DATE.getTime() + 20 * MILLIS_IN_DAY
      )

      expect(state.minDateDisplayed.getTime()).toBe(
        expectedMinDisplayDate.getTime()
      )
      expect(state.maxDateDisplayed.getTime()).toBe(
        expectedMaxDisplayDate.getTime()
      )
    })
  })

  describe('setDatapointNumberVisible', () => {
    it('updates datapoint number', () => {
      const { setDatapointNumberVisible } = useDateStore.getState()

      setDatapointNumberVisible(100)

      expect(useDateStore.getState().datapointNumberVisible).toBe(100)
    })

    it('handles different values', () => {
      const { setDatapointNumberVisible } = useDateStore.getState()

      setDatapointNumberVisible(1)
      expect(useDateStore.getState().datapointNumberVisible).toBe(1)

      setDatapointNumberVisible(500)
      expect(useDateStore.getState().datapointNumberVisible).toBe(500)
    })
  })

  describe('loading state', () => {
    it('sets loading state', () => {
      const { setLoading } = useDateStore.getState()

      setLoading(true)
      expect(useDateStore.getState().loading).toBe(true)

      setLoading(false)
      expect(useDateStore.getState().loading).toBe(false)
    })
  })

  describe('error state', () => {
    it('sets error message', () => {
      const { setError } = useDateStore.getState()

      setError('Test error')
      expect(useDateStore.getState().error).toBe('Test error')
    })

    it('clears error message', () => {
      const { setError } = useDateStore.getState()

      setError('Test error')
      expect(useDateStore.getState().error).toBe('Test error')

      setError(null)
      expect(useDateStore.getState().error).toBe(null)
    })
  })

  describe('constants', () => {
    it('ZERO_DATE is April 1, 2024', () => {
      expect(ZERO_DATE.getFullYear()).toBe(2024)
      expect(ZERO_DATE.getMonth()).toBe(3) // 0-indexed, so 3 = April
      expect(ZERO_DATE.getDate()).toBe(1)
    })

    it('MILLIS_IN_DAY is correct', () => {
      expect(MILLIS_IN_DAY).toBe(1000 * 60 * 60 * 24)
    })

    it('DAYS_FROM_ZERO_DATE_TO_TODAY is reasonable', () => {
      // Should be positive and less than a few years
      expect(DAYS_FROM_ZERO_DATE_TO_TODAY).toBeGreaterThan(0)
      expect(DAYS_FROM_ZERO_DATE_TO_TODAY).toBeLessThan(365 * 5)
    })
  })
})
