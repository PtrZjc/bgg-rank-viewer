# Test Utilities and Mocks

This directory contains shared testing utilities, setup files, and mocks used across all tests.

## Directory Structure

```
__tests__/
├── README.md           # This file
├── setup.ts            # Global test setup (runs before all tests)
├── utils.tsx           # Reusable test utilities and custom render functions
└── mocks/              # Shared mock implementations
    ├── chartjs.ts      # Chart.js mocks
    └── csvData.ts      # Mock CSV data for testing
```

## Files Overview

### setup.ts

Global test configuration that runs before all tests. It includes:
- Jest-DOM matchers (toBeInTheDocument, etc.)
- Canvas/Chart.js mocks
- Window API mocks (matchMedia, IntersectionObserver)
- Automatic cleanup after each test

**You don't need to import this file** - it's automatically loaded via `vitest.config.ts`.

### utils.tsx

Custom render utilities for testing React components.

**Usage:**
```typescript
// Instead of importing from '@testing-library/react'
import { render, screen } from '@testing-library/react'

// Import from utils to get custom providers
import { render, screen } from 'src/__tests__/utils'
```

The custom `render` function can be extended to wrap components with providers (like Router, Theme, etc.).

### mocks/chartjs.ts

Mocks for Chart.js components to avoid canvas rendering in tests.

**Usage:**
```typescript
import { vi } from 'vitest'
import { mockLineChart } from 'src/__tests__/mocks/chartjs'

// At the top of your test file
vi.mock('react-chartjs-2', () => ({
  Line: mockLineChart,
}))

// Now you can test components that use Chart.js
```

### mocks/csvData.ts

Mock data generators for testing CSV parsing and game data loading.

**Usage:**
```typescript
import {
  mockGameData,
  mockGameDataParsed,
  mockHistoricalData,
  convertToCSV,
  createMockFetchResponse
} from 'src/__tests__/mocks/csvData'

// Use in tests
const csvString = convertToCSV(mockGameData)
const response = createMockFetchResponse(csvString)
```

## Adding New Mocks

When you need to mock a new library or API:

1. **Create a new file** in `mocks/` directory
2. **Export mock functions** or mock data
3. **Document the usage** in comments
4. **Import and use** in your tests

Example:

```typescript
// mocks/myLibrary.ts
import { vi } from 'vitest'

export const mockMyLibraryFunction = vi.fn(() => 'mocked value')

/**
 * Mock for MyLibrary
 * Usage:
 *   vi.mock('my-library', () => ({
 *     myFunction: mockMyLibraryFunction,
 *   }))
 */
```

## Common Patterns

### Testing with Zustand Stores

```typescript
import { beforeEach } from 'vitest'
import { useMyStore } from './store'

describe('MyComponent', () => {
  beforeEach(() => {
    // Reset store before each test
    const { reset } = useMyStore.getState()
    reset()
  })

  it('uses store data', () => {
    // Test with fresh store state
  })
})
```

### Testing Async Data Loading

```typescript
import { renderHook, waitFor } from '@testing-library/react'

it('loads data', async () => {
  const { result } = renderHook(() => useMyHook())

  await waitFor(() => {
    expect(result.current.loading).toBe(false)
  })

  expect(result.current.data).toBeDefined()
})
```

### Testing User Interactions

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

it('handles click', async () => {
  const user = userEvent.setup()
  render(<MyButton />)

  await user.click(screen.getByRole('button'))

  expect(screen.getByText('Clicked!')).toBeInTheDocument()
})
```

## Best Practices

1. **Keep mocks simple** - Only mock what's necessary
2. **Document usage** - Add comments showing how to use mocks
3. **Reset state** - Clean up between tests to avoid interference
4. **Use TypeScript** - Type your mocks for better developer experience
5. **Share common mocks** - Don't duplicate mocks across test files

## Need Help?

- See [TESTING_PROPOSAL.md](../../TESTING_PROPOSAL.md) for comprehensive testing guide
- See [SETUP_TESTING.md](../../SETUP_TESTING.md) for setup instructions
- Check existing test files for examples
