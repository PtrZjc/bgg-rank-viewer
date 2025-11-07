# Testing Setup Guide

This guide will walk you through setting up testing for the BGG Rank Viewer project.

## Prerequisites

Make sure you have Node.js and npm installed. This project already has these.

## Step 1: Install Testing Dependencies

Run the following command to install all required testing libraries:

```bash
npm install -D vitest @vitest/ui @testing-library/react @testing-library/user-event @testing-library/jest-dom happy-dom
```

### What each package does:

- **vitest**: Fast test runner built for Vite
- **@vitest/ui**: Visual UI for viewing test results in browser
- **@testing-library/react**: Tools for testing React components
- **@testing-library/user-event**: Simulates user interactions
- **@testing-library/jest-dom**: Provides helpful matchers like `toBeInTheDocument()`
- **happy-dom**: Lightweight DOM environment for tests

## Step 2: Add Test Scripts to package.json

Add the following scripts to your `package.json` file under the `"scripts"` section:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

### What each script does:

- `npm test`: Run tests in watch mode (re-runs on file changes)
- `npm run test:ui`: Open visual test interface in browser
- `npm run test:run`: Run tests once and exit
- `npm run test:coverage`: Run tests and generate coverage report

## Step 3: Verify Setup

The following files have already been created for you:

### Configuration Files:
- ✅ `vitest.config.ts` - Vitest configuration
- ✅ `src/__tests__/setup.ts` - Test setup and global mocks
- ✅ `src/__tests__/utils.tsx` - Test utilities

### Mock Files:
- ✅ `src/__tests__/mocks/chartjs.ts` - Chart.js mocks
- ✅ `src/__tests__/mocks/csvData.ts` - Mock CSV data

### Example Tests:
- ✅ `src/components/Game/DateRange/store.test.ts` - Store tests
- ✅ `src/components/Game/useGameDataStore.test.ts` - Game data store tests
- ✅ `src/components/Game/DateRange/DateRangeSlider.test.tsx` - Component tests

## Step 4: Run Your First Tests

After installing dependencies (Step 1) and adding scripts (Step 2), run:

```bash
npm test
```

You should see output like:

```
✓ src/components/Game/DateRange/store.test.ts (12)
✓ src/components/Game/useGameDataStore.test.ts (10)
✓ src/components/Game/DateRange/DateRangeSlider.test.tsx (8)

Test Files  3 passed (3)
     Tests  30 passed (30)
```

## Step 5: Explore Test UI (Optional)

For a better testing experience, run:

```bash
npm run test:ui
```

This opens a browser interface where you can:
- See all your tests organized by file
- Click to run specific tests
- View detailed error messages
- See code coverage

## Troubleshooting

### Issue: "Cannot find module 'vitest'"

**Solution**: Make sure you ran `npm install -D vitest ...` correctly. Try:
```bash
rm -rf node_modules package-lock.json
npm install
npm install -D vitest @vitest/ui @testing-library/react @testing-library/user-event @testing-library/jest-dom happy-dom
```

### Issue: Tests fail with "document is not defined"

**Solution**: Make sure `vitest.config.ts` has `environment: 'happy-dom'` set.

### Issue: Tests fail with Canvas/Chart.js errors

**Solution**: The setup file (`src/__tests__/setup.ts`) already includes mocks for Canvas. If you still have issues, check that the setup file is being loaded in `vitest.config.ts`.

### Issue: TypeScript errors in test files

**Solution**: Make sure your `tsconfig.json` includes test files. You may need to add:
```json
{
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.test.ts", "src/**/*.test.tsx"]
}
```

## Next Steps

Now that testing is set up, you can:

1. **Run the example tests** to see how they work
2. **Read TESTING_PROPOSAL.md** for detailed explanations of testing concepts
3. **Write your first test** - Start with something simple
4. **Add more tests** - Follow the examples provided

## Quick Reference

### Running Tests

```bash
# Watch mode (recommended for development)
npm test

# Run once and exit
npm run test:run

# Visual UI
npm run test:ui

# With coverage
npm run test:coverage

# Run specific test file
npm test store.test

# Run tests matching a pattern
npm test -- --grep "date range"
```

### Writing a Simple Test

```typescript
import { describe, it, expect } from 'vitest'

describe('My Feature', () => {
  it('does something', () => {
    const result = 2 + 2
    expect(result).toBe(4)
  })
})
```

### Common Matchers

```typescript
// Equality
expect(value).toBe(4)                    // ===
expect(value).toEqual({ a: 1 })          // deep equality

// Truthiness
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()
expect(value).toBeUndefined()

// Numbers
expect(value).toBeGreaterThan(3)
expect(value).toBeLessThan(5)

// Strings
expect(string).toContain('substring')
expect(string).toMatch(/pattern/)

// Arrays
expect(array).toContain(item)
expect(array).toHaveLength(3)

// DOM (from @testing-library/jest-dom)
expect(element).toBeInTheDocument()
expect(element).toHaveTextContent('text')
expect(element).toBeVisible()
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Ready to start testing!** 🧪

For detailed information about testing strategies and best practices, see [TESTING_PROPOSAL.md](./TESTING_PROPOSAL.md).
