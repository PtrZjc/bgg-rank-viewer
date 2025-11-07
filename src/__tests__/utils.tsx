import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

/**
 * Custom render function that wraps components with common providers
 * Extend this as needed when you add providers (e.g., Router, Theme)
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  // For now, just use the standard render
  // When you add providers (like React Router), wrap them here
  return render(ui, { ...options })
}

/**
 * Re-export everything from React Testing Library
 */
export * from '@testing-library/react'

/**
 * Override the default render with our custom one
 */
export { renderWithProviders as render }
