import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    // Use happy-dom for a faster, lighter DOM environment
    environment: 'happy-dom',

    // Setup file to run before tests
    setupFiles: ['./src/__tests__/setup.ts'],

    // Global test utilities (no need to import describe, it, expect in every file)
    globals: true,

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/types.ts',
        'src/main.tsx',
        'vite.config.ts',
        'vitest.config.ts',
      ],
    },

    // Path aliases
    alias: {
      'src': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
      'utils': path.resolve(__dirname, './src/utils'),
    },
  },
})
