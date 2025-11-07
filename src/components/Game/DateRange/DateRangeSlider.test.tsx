import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DateRangeSlider } from './DateRangeSlider'
import {
  DAYS_FROM_ZERO_DATE_TO_TODAY,
  DAYS_FROM_ZERO_DATE_TO_ONE_YEAR_AGO,
} from './store'

// Mock the react-range-slider-input component
vi.mock('react-range-slider-input', () => ({
  default: ({ max, value, onInput }: any) => (
    <div data-testid="range-slider">
      <input
        data-testid="slider-input"
        type="range"
        min={0}
        max={max}
        value={value[0]}
        onChange={(e) => {
          onInput([parseInt(e.target.value), value[1]])
        }}
      />
      <input
        data-testid="slider-input-max"
        type="range"
        min={0}
        max={max}
        value={value[1]}
        onChange={(e) => {
          onInput([value[0], parseInt(e.target.value)])
        }}
      />
      <div data-testid="slider-values">
        {value[0]} - {value[1]}
      </div>
    </div>
  ),
}))

describe('DateRangeSlider', () => {
  let onRangeChangeMock: ReturnType<typeof vi.fn>
  let onDisplayRangeChangeMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    onRangeChangeMock = vi.fn()
    onDisplayRangeChangeMock = vi.fn()
  })

  it('renders the slider component', () => {
    render(
      <DateRangeSlider
        onRangeChange={onRangeChangeMock}
        onDisplayRangeChange={onDisplayRangeChangeMock}
      />
    )

    expect(screen.getByTestId('range-slider')).toBeInTheDocument()
  })

  it('initializes with default range (one year ago to today)', () => {
    render(
      <DateRangeSlider
        onRangeChange={onRangeChangeMock}
        onDisplayRangeChange={onDisplayRangeChangeMock}
      />
    )

    const sliderValues = screen.getByTestId('slider-values')
    expect(sliderValues.textContent).toBe(
      `${DAYS_FROM_ZERO_DATE_TO_ONE_YEAR_AGO} - ${DAYS_FROM_ZERO_DATE_TO_TODAY}`
    )
  })

  it('calls onDisplayRangeChange on mount', async () => {
    render(
      <DateRangeSlider
        onRangeChange={onRangeChangeMock}
        onDisplayRangeChange={onDisplayRangeChangeMock}
      />
    )

    await waitFor(() => {
      expect(onDisplayRangeChangeMock).toHaveBeenCalledWith(
        DAYS_FROM_ZERO_DATE_TO_ONE_YEAR_AGO,
        DAYS_FROM_ZERO_DATE_TO_TODAY
      )
    })
  })

  it('calls onRangeChange on mount when not dragging', async () => {
    render(
      <DateRangeSlider
        onRangeChange={onRangeChangeMock}
        onDisplayRangeChange={onDisplayRangeChangeMock}
      />
    )

    await waitFor(() => {
      expect(onRangeChangeMock).toHaveBeenCalledWith(
        DAYS_FROM_ZERO_DATE_TO_ONE_YEAR_AGO,
        DAYS_FROM_ZERO_DATE_TO_TODAY
      )
    })
  })

  it('updates slider values when user interacts', async () => {
    render(
      <DateRangeSlider
        onRangeChange={onRangeChangeMock}
        onDisplayRangeChange={onDisplayRangeChangeMock}
      />
    )

    const minSlider = screen.getByTestId('slider-input')

    // Change the min value to 100
    fireEvent.change(minSlider, { target: { value: '100' } })

    await waitFor(() => {
      const sliderValues = screen.getByTestId('slider-values')
      expect(sliderValues.textContent).toContain('100')
    })
  })

  it('calls onDisplayRangeChange immediately when value changes', async () => {
    render(
      <DateRangeSlider
        onRangeChange={onRangeChangeMock}
        onDisplayRangeChange={onDisplayRangeChangeMock}
      />
    )

    const minSlider = screen.getByTestId('slider-input')

    // Clear previous calls
    onDisplayRangeChangeMock.mockClear()
    onRangeChangeMock.mockClear()

    // Change the value
    fireEvent.change(minSlider, { target: { value: '150' } })

    await waitFor(() => {
      expect(onDisplayRangeChangeMock).toHaveBeenCalledWith(
        150,
        DAYS_FROM_ZERO_DATE_TO_TODAY
      )
    })
  })

  it('does not call onRangeChange while dragging', async () => {
    const { container } = render(
      <DateRangeSlider
        onRangeChange={onRangeChangeMock}
        onDisplayRangeChange={onDisplayRangeChangeMock}
      />
    )

    // Clear initial calls
    onRangeChangeMock.mockClear()
    onDisplayRangeChangeMock.mockClear()

    const sliderContainer = container.firstChild as HTMLElement
    const minSlider = screen.getByTestId('slider-input')

    // Start dragging
    fireEvent.mouseDown(sliderContainer)

    // Change value while dragging
    fireEvent.change(minSlider, { target: { value: '200' } })

    await waitFor(() => {
      // Display range should be called
      expect(onDisplayRangeChangeMock).toHaveBeenCalled()
      // But onRangeChange should NOT be called while dragging
      expect(onRangeChangeMock).not.toHaveBeenCalled()
    })
  })

  it('calls onRangeChange after dragging ends', async () => {
    const { container } = render(
      <DateRangeSlider
        onRangeChange={onRangeChangeMock}
        onDisplayRangeChange={onDisplayRangeChangeMock}
      />
    )

    const sliderContainer = container.firstChild as HTMLElement
    const minSlider = screen.getByTestId('slider-input')

    // Clear initial calls
    onRangeChangeMock.mockClear()

    // Start dragging
    fireEvent.mouseDown(sliderContainer)

    // Change value while dragging
    fireEvent.change(minSlider, { target: { value: '250' } })

    // End dragging
    fireEvent.mouseUp(sliderContainer)

    await waitFor(() => {
      // Now onRangeChange should be called with the new value
      expect(onRangeChangeMock).toHaveBeenCalledWith(
        250,
        DAYS_FROM_ZERO_DATE_TO_TODAY
      )
    })
  })

  it('supports touch events for mobile', async () => {
    const { container } = render(
      <DateRangeSlider
        onRangeChange={onRangeChangeMock}
        onDisplayRangeChange={onDisplayRangeChangeMock}
      />
    )

    const sliderContainer = container.firstChild as HTMLElement
    const minSlider = screen.getByTestId('slider-input')

    // Clear initial calls
    onRangeChangeMock.mockClear()

    // Start touch
    fireEvent.touchStart(sliderContainer)

    // Change value while touching
    fireEvent.change(minSlider, { target: { value: '300' } })

    // Touch should prevent onRangeChange
    await waitFor(() => {
      expect(onRangeChangeMock).not.toHaveBeenCalled()
    })

    // End touch
    fireEvent.touchEnd(sliderContainer)

    // Now it should call onRangeChange
    await waitFor(() => {
      expect(onRangeChangeMock).toHaveBeenCalledWith(
        300,
        DAYS_FROM_ZERO_DATE_TO_TODAY
      )
    })
  })

  it('updates max value independently', async () => {
    render(
      <DateRangeSlider
        onRangeChange={onRangeChangeMock}
        onDisplayRangeChange={onDisplayRangeChangeMock}
      />
    )

    const maxSlider = screen.getByTestId('slider-input-max')

    // Change the max value
    fireEvent.change(maxSlider, { target: { value: '400' } })

    await waitFor(() => {
      const sliderValues = screen.getByTestId('slider-values')
      expect(sliderValues.textContent).toContain('400')
    })

    await waitFor(() => {
      expect(onDisplayRangeChangeMock).toHaveBeenCalledWith(
        DAYS_FROM_ZERO_DATE_TO_ONE_YEAR_AGO,
        400
      )
    })
  })
})
