import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { App } from '../../App';

// Sample CSV data for testing
const mockCsv = `rank;id;name;link
1;224517;Brass: Birmingham;/boardgame/224517/brass-birmingham
2;161936;Pandemic Legacy: Season 1;/boardgame/161936/pandemic-legacy-season-1
3;174430;Gloomhaven;/boardgame/174430/gloomhaven
4;342942;Ark Nova;/boardgame/342942/ark-nova
5;233078;Twilight Imperium: Fourth Edition;/boardgame/233078/twilight-imperium-fourth-edition
6;316554;Dune: Imperium;/boardgame/316554/dune-imperium
7;167791;Terraforming Mars;/boardgame/167791/terraforming-mars
8;115746;War of the Ring: Second Edition;/boardgame/115746/war-of-the-ring-second-edition
9;187645;Star Wars: Rebellion;/boardgame/187645/star-wars-rebellion
10;291457;Gloomhaven: Jaws of the Lion;/boardgame/291457/gloomhaven-jaws-of-the-lion`;

// Create mock fetch
beforeEach(() => {
  // Mock fetch to return our test CSV data
  global.fetch = vi.fn((url: string) => {
    const path = url.toString();

    // For CSV files, return a promise that resolves to a mock response
    if (path.includes('.csv')) {
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve(mockCsv),
      } as Response);
    }

    return Promise.reject(new Error('Not found'));
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('GameChart Integration Test', () => {
  it('should render the chart component and display data without errors', async () => {
    render(<App />);

    // Wait for loading to finish and data to appear
    await waitFor(
      () => {
        expect(screen.queryByText(/Loading data/i)).not.toBeInTheDocument();
      },
      { timeout: 10000 }
    );

    // Verify no error message is displayed
    expect(screen.queryByText(/Error:/i)).not.toBeInTheDocument();

    // Verify no "No data available" message
    expect(screen.queryByText(/No data available/i)).not.toBeInTheDocument();
  });

  it('should display game names from the data', async () => {
    render(<App />);

    // Wait for loading to finish
    await waitFor(
      () => {
        expect(screen.queryByText(/Loading data/i)).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // Verify that game names are rendered
    // These games should appear in the test data
    await waitFor(() => {
      expect(screen.getByText(/Brass: Birmingham/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Pandemic Legacy: Season 1/i)).toBeInTheDocument();
    expect(screen.getByText('Ark Nova')).toBeInTheDocument();

    // Gloomhaven appears in multiple games, so use getAllByText
    const gloomhavenElements = screen.getAllByText(/Gloomhaven/i);
    expect(gloomhavenElements.length).toBeGreaterThan(0);
  });

  it('should render the chart title', () => {
    render(<App />);

    expect(screen.getByText('BGG Game Rankings Over Time')).toBeInTheDocument();
  });

  it('should not show "No data available" message', async () => {
    render(<App />);

    // Wait for loading to finish
    await waitFor(
      () => {
        expect(screen.queryByText(/Loading data/i)).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // Verify no "No data available" message
    expect(screen.queryByText(/No data available/i)).not.toBeInTheDocument();
  });

  it('should display multiple games in the chart', async () => {
    render(<App />);

    // Wait for loading to finish
    await waitFor(
      () => {
        expect(screen.queryByText(/Loading data/i)).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    // Verify that multiple game links are rendered
    const gameLinks = document.querySelectorAll('a[href*="boardgamegeek.com"]');
    expect(gameLinks.length).toBeGreaterThan(0);
  });
});
