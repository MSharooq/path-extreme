import { useState, useEffect } from 'react';

export function useStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('patches_plus_streak');
    if (stored) setStreak(parseInt(stored, 10));
  }, []);

  const incrementStreak = (today: string) => {
    const lastSolved = localStorage.getItem('patches_plus_last_solved');
    if (lastSolved !== today) {
      const yesterday = new Date(new Date(today).getTime() - 86400000).toISOString().split('T')[0];
      let newStreak = 1;
      if (lastSolved === yesterday) {
         newStreak = streak + 1;
      }
      setStreak(newStreak);
      localStorage.setItem('patches_plus_streak', newStreak.toString());
      localStorage.setItem('patches_plus_last_solved', today);
    }
  };

  return { streak, incrementStreak };
}
