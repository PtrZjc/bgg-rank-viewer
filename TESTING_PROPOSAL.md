# Testing Proposal for BGG Rank Viewer

## Overview
This document proposes a testing strategy for the BGG Rank Viewer application, designed for someone new to frontend testing.

## Table of Contents
1. [Understanding Frontend Testing](#understanding-frontend-testing)
2. [Recommended Testing Tools](#recommended-testing-tools)
3. [Types of Tests to Implement](#types-of-tests-to-implement)
4. [Proposed Test Structure](#proposed-test-structure)
5. [Example Tests](#example-tests)
6. [Implementation Plan](#implementation-plan)
7. [Running Tests](#running-tests)

---

## Understanding Frontend Testing

Frontend tests verify that your application works correctly. There are three main types:

### 1. **Unit Tests**
- Test individual functions or utilities in isolation
- Fast and simple
- Example: Testing a function that formats dates

### 2. **Component Tests**
- Test React components in isolation
- Verify rendering and user interactions
- Example: Testing if a button click updates state

### 3. **Integration Tests**
- Test how multiple components work together
- More realistic but slower
- Example: Testing the complete chart with controls

### 4. **End-to-End (E2E) Tests** _(Optional, not in initial proposal)_
- Test the entire application in a real browser
- Most realistic but slowest and most complex
- We'll skip these initially as they're more advanced

---

## Recommended Testing Tools

### Core Testing Stack

#### **Vitest** - Test Runner
- **Why**: Built specifically for Vite projects, extremely fast
- **What it does**: Runs your tests, provides assertions, mocking
- **Similar to**: Jest (but faster and better integrated with Vite)

#### **React Testing Library** - Component Testing
- **Why**: Industry standard, focuses on testing like a user would interact
- **What it does**: Renders components, queries elements, simulates interactions
- **Philosophy**: Test behavior, not implementation details

#### **@testing-library/user-event** - User Interaction
- **Why**: Simulates realistic user interactions
- **What it does**: Simulates clicks, typing, keyboard navigation

#### **happy-dom** - DOM Environment
- **Why**: Lightweight, faster than jsdom
- **What it does**: Provides a fake browser environment for tests

---

## Types of Tests to Implement

### Priority 1: High-Value Tests (Start Here)

#### 1. **Utility Functions**
```typescript
// src/utils/dateUtils.test.ts
// Test date formatting, CSV parsing helpers
```

#### 2. **Custom Hooks**
```typescript
// src/components/Game/useGameData.test.ts
// Test data fetching logic
```

#### 3. **Simple Components**
```typescript
// src/components/Game/DateRange/DateRangeSlider.test.tsx
// Test slider rendering and interactions
```

### Priority 2: Integration Tests

#### 4. **Complex Components**
```typescript
// src/components/Game/GameChart/GameChart.test.tsx
// Test chart rendering with mock data
```

#### 5. **Store Logic**
```typescript
// src/components/Game/DateRange/store.test.ts
// Test Zustand store state management
```

### Priority 3: Advanced Tests

#### 6. **Full Application Flow**
```typescript
// src/App.test.tsx
// Test complete user workflows
```

---

## Proposed Test Structure

```
src/
├── __tests__/                    # Global test utilities
│   ├── setup.ts                  # Test setup file
│   ├── utils.tsx                 # Test helper functions
│   └── mocks/                    # Shared mocks
│       ├── chartjs.ts            # Mock Chart.js
│       └── csvData.ts            # Mock CSV data
│
├── components/
│   └── Game/
│       ├── GameChart/
│       │   ├── GameChart.tsx
│       │   └── GameChart.test.tsx     # Test next to component
│       ├── DateRange/
│       │   ├── DateRangeControls.tsx
│       │   ├── DateRangeControls.test.tsx
│       │   ├── DateRangeSlider.tsx
│       │   ├── DateRangeSlider.test.tsx
│       │   ├── store.ts
│       │   └── store.test.ts          # Test next to store
│       ├── useGameData.ts
│       ├── useGameData.test.ts        # Test next to hook
│       └── useGameDataStore.test.ts
│
└── utils/
    └── dateUtils.ts
    └── dateUtils.test.ts              # Test next to utility

# Configuration files (in root)
├── vitest.config.ts                   # Vitest configuration
└── package.json                       # Add test scripts
```

**Philosophy**: Keep tests next to the code they test (colocated testing).

---

## Example Tests

### Example 1: Testing a Utility Function

```typescript
// src/utils/dateUtils.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate } from './dateUtils'

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-04-01')
      expect(formatDate(date)).toBe('Apr 1, 2024')
    })

    it('handles invalid dates', () => {
      expect(formatDate(null)).toBe('')
    })
  })
})
```

**What this tests**: A simple function with clear inputs/outputs.

---

### Example 2: Testing a React Component

```typescript
// src/components/Game/DateRange/DateRangeSlider.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DateRangeSlider } from './DateRangeSlider'

describe('DateRangeSlider', () => {
  it('renders slider with correct min and max values', () => {
    render(<DateRangeSlider min={0} max={100} />)

    const slider = screen.getByRole('slider')
    expect(slider).toBeInTheDocument()
  })

  it('displays current values', () => {
    render(<DateRangeSlider min={0} max={100} value={[20, 80]} />)

    expect(screen.getByText('20')).toBeInTheDocument()
    expect(screen.getByText('80')).toBeInTheDocument()
  })
})
```

**What this tests**: Component renders correctly with different props.

---

### Example 3: Testing User Interactions

```typescript
// src/components/Game/DateRange/DateRangeControls.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DateRangeControls } from './DateRangeControls'

describe('DateRangeControls', () => {
  it('calls onChange when slider value changes', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(<DateRangeControls onChange={handleChange} />)

    const slider = screen.getByRole('slider')
    await user.click(slider)

    expect(handleChange).toHaveBeenCalled()
  })
})
```

**What this tests**: User interactions trigger correct callbacks.

---

### Example 4: Testing a Zustand Store

```typescript
// src/components/Game/DateRange/store.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useDateStore } from './store'

describe('useDateStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { reset } = useDateStore.getState()
    reset()
  })

  it('initializes with default values', () => {
    const state = useDateStore.getState()
    expect(state.startIndex).toBe(0)
    expect(state.endIndex).toBeGreaterThan(0)
  })

  it('updates date range correctly', () => {
    const { setDateRange } = useDateStore.getState()

    setDateRange(10, 50)

    const state = useDateStore.getState()
    expect(state.startIndex).toBe(10)
    expect(state.endIndex).toBe(50)
  })
})
```

**What this tests**: State management works correctly.

---

### Example 5: Testing Custom Hooks

```typescript
// src/components/Game/useGameData.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useGameData } from './useGameData'

// Mock Papa Parse
vi.mock('papaparse', () => ({
  default: {
    parse: vi.fn((file, config) => {
      config.complete([
        { rank: 1, name: 'Game 1', id: '123' }
      ])
    })
  }
}))

describe('useGameData', () => {
  it('loads data successfully', async () => {
    const { result } = renderHook(() => useGameData())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.games).toHaveLength(1)
    expect(result.current.games[0].name).toBe('Game 1')
  })

  it('handles loading state', () => {
    const { result } = renderHook(() => useGameData())
    expect(result.current.loading).toBe(true)
  })
})
```

**What this tests**: Custom hook logic, including async data loading.

---

### Example 6: Testing Chart Component

```typescript
// src/components/Game/GameChart/GameChart.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { GameChart } from './GameChart'

// Mock Chart.js
vi.mock('react-chartjs-2', () => ({
  Line: vi.fn(() => <div data-testid="mock-chart">Chart</div>)
}))

describe('GameChart', () => {
  const mockData = {
    labels: ['2024-04-01', '2024-04-02'],
    datasets: [
      {
        label: 'Game 1',
        data: [1, 2]
      }
    ]
  }

  it('renders chart with data', () => {
    const { getByTestId } = render(<GameChart data={mockData} />)
    expect(getByTestId('mock-chart')).toBeInTheDocument()
  })

  it('displays loading state when no data', () => {
    const { getByText } = render(<GameChart data={null} />)
    expect(getByText(/loading/i)).toBeInTheDocument()
  })
})
```

**What this tests**: Chart component with mocked Chart.js library.

---

## Implementation Plan

### Phase 1: Setup (1-2 hours)

1. **Install dependencies**:
   ```bash
   npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom happy-dom
   ```

2. **Create configuration files**:
   - `vitest.config.ts`
   - `src/__tests__/setup.ts`

3. **Add test scripts to `package.json`**:
   ```json
   {
     "scripts": {
       "test": "vitest",
       "test:ui": "vitest --ui",
       "test:coverage": "vitest --coverage"
     }
   }
   ```

### Phase 2: Write Basic Tests (2-3 hours)

1. Start with utility functions (if any exist)
2. Test simple components (DateRangeSlider)
3. Test stores (useDateStore, useGameDataStore)

### Phase 3: Component Tests (3-4 hours)

1. Test DateRangeControls
2. Test useGameData hook
3. Test GameChart (with mocks)

### Phase 4: Integration Tests (2-3 hours)

1. Test App component with full workflow
2. Test data loading and chart updates together

### Phase 5: Coverage & Refinement (1-2 hours)

1. Run coverage report
2. Fill in gaps
3. Add edge case tests

**Total Estimated Time**: 9-14 hours

---

## Running Tests

### Basic Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-run on file changes)
npm test -- --watch

# Run tests with coverage report
npm run test:coverage

# Run tests with UI (visual interface)
npm run test:ui

# Run specific test file
npm test DateRangeSlider.test.tsx

# Run tests matching a pattern
npm test -- --grep "date range"
```

### Understanding Test Output

```
✓ src/components/Game/DateRange/DateRangeSlider.test.tsx (2)
  ✓ DateRangeSlider (2)
    ✓ renders slider with correct min and max values
    ✓ displays current values

Test Files  1 passed (1)
     Tests  2 passed (2)
  Start at  10:30:45
  Duration  234ms
```

- ✓ = Test passed
- ✗ = Test failed
- Number in parentheses = test count

---

## Best Practices

### 1. **Test Behavior, Not Implementation**
❌ Bad: `expect(component.state.count).toBe(5)`
✅ Good: `expect(screen.getByText('Count: 5')).toBeInTheDocument()`

### 2. **Use Descriptive Test Names**
❌ Bad: `it('works', () => ...)`
✅ Good: `it('displays error message when data fails to load', () => ...)`

### 3. **Arrange, Act, Assert Pattern**
```typescript
it('updates count on button click', async () => {
  // Arrange: Set up test
  const user = userEvent.setup()
  render(<Counter />)

  // Act: Perform action
  await user.click(screen.getByRole('button', { name: /increment/i }))

  // Assert: Verify result
  expect(screen.getByText('Count: 1')).toBeInTheDocument()
})
```

### 4. **Keep Tests Independent**
- Each test should work on its own
- Don't rely on test execution order
- Reset state between tests

### 5. **Mock External Dependencies**
- Mock API calls (fetch)
- Mock heavy libraries (Chart.js)
- Mock file system operations

### 6. **Aim for 70-80% Coverage**
- 100% coverage isn't necessary
- Focus on critical paths
- Don't test trivial code

---

## What NOT to Test

1. **Third-party libraries** - They have their own tests
   - Don't test Chart.js, React, Zustand internals

2. **Styling** - Tests shouldn't verify CSS
   - Don't test if colors match exactly
   - Don't test exact pixel positions

3. **Implementation details**
   - Don't test internal state directly
   - Don't test private methods

4. **Obvious code**
   - Simple getters/setters
   - Trivial type definitions

---

## Troubleshooting Common Issues

### Issue: "Cannot find module '@testing-library/react'"
**Solution**: Install dependencies: `npm install -D @testing-library/react`

### Issue: "ReferenceError: document is not defined"
**Solution**: Make sure `happy-dom` is configured in `vitest.config.ts`

### Issue: "Cannot read property 'getContext' of null" (Chart.js)
**Solution**: Mock Chart.js in tests (see Example 6)

### Issue: Tests are slow
**Solution**:
- Mock heavy dependencies
- Use `happy-dom` instead of `jsdom`
- Run tests in parallel (Vitest does this by default)

### Issue: "Error: Not implemented: HTMLCanvasElement.prototype.getContext"
**Solution**: Mock the canvas element or the Chart component

---

## Next Steps

1. **Review this proposal** - Make sure you understand each section
2. **Set up the testing environment** - Follow Phase 1 of Implementation Plan
3. **Write your first test** - Start with something simple (utility function)
4. **Iterate** - Add more tests gradually
5. **Ask questions** - If you get stuck, refer to this guide

---

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Vitest + React Guide](https://vitest.dev/guide/ui.html)

---

## Summary

This testing strategy prioritizes:
- ✅ **Simplicity** - Start with easy tests, build up complexity
- ✅ **Practicality** - Focus on tests that provide real value
- ✅ **Maintainability** - Tests should be easy to understand and update
- ✅ **Developer Experience** - Fast feedback, clear error messages

Start small, test the most critical parts first, and expand coverage over time. You don't need 100% coverage on day one!
