import { useState, useEffect } from 'react';
import { generateDailyPuzzle } from '../engine/generator';
import type { Puzzle } from '../types';

export function usePuzzle() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDailyPuzzle = () => {
    setLoading(true);
    // Utilizing exactly one unique seeded hash constraint determined exclusively by the localized system date
    const today = new Date().toLocaleDateString('en-CA');
    setTimeout(() => {
        try {
          const p = generateDailyPuzzle(today);
          p.date = today;
          setPuzzle(p);
        } catch (e: any) {
          setError(e.message || 'Error generating puzzle');
        } finally {
          setLoading(false);
        }
    }, 50);
  };

  useEffect(() => {
    loadDailyPuzzle();
  }, []);

  return { puzzle, loading, error, refreshPuzzle: loadDailyPuzzle };
}
