import { expect, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Suppress expected console errors and warnings in test environment
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  // Suppress Chart.js canvas-related errors
  // These are expected because Chart.js requires full canvas support which
  // happy-dom doesn't provide, but our tests verify the component logic works
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Failed to create chart') ||
       args[0].includes("can't acquire context") ||
       args[0].includes('ownerDocument') ||
       args[0].includes('Error occurred in the <ForwardRef(ChartComponent)>'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  // Suppress React act() warnings
  // Our tests use waitFor which properly handles async state updates,
  // but React still complains about updates from useEffect hooks
  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('not wrapped in act(...)')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterEach(() => {
  cleanup();
});
