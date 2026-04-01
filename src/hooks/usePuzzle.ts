import { useState, useEffect } from 'react';
import type { Puzzle } from '../types';
import { supabase } from '../lib/supabase';

export function usePuzzle() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDailyPuzzle = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch today's puzzle based on server-side UTC time
      const { data, error: fetchError } = await supabase
        .rpc('get_today_puzzle')
        .single();

      if (fetchError || !data) {
        throw new Error(fetchError?.message || 'Daily puzzle not found for today. Please check back later!');
      }

      const puzzleData = data as any;

      setPuzzle({
        date: puzzleData.date,
        dayOfWeek: puzzleData.day_of_week,
        pieces: puzzleData.pieces,
        grid: Array.from({length:8}, ()=>Array(8).fill(null)),
        solution: [] // Solution is verified on submission if needed
      });
    } catch (e: any) {
      console.error('Error loading puzzle:', e);
      setError(e.message || 'Error loading puzzle');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDailyPuzzle();
  }, []);

  return { puzzle, loading, error, refreshPuzzle: loadDailyPuzzle };
}
