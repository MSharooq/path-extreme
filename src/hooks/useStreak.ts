import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useStreak(user?: User | null) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (user) {
      const storedStreak = user.user_metadata?.streak;
      if (typeof storedStreak === 'number') {
        setStreak(storedStreak);
      } else {
        const storedLocal = localStorage.getItem('patches_plus_streak');
        setStreak(storedLocal ? parseInt(storedLocal, 10) : 0);
      }
    } else {
      const storedLocal = localStorage.getItem('patches_plus_streak');
      setStreak(storedLocal ? parseInt(storedLocal, 10) : 0);
    }
  }, [user]);

  const incrementStreak = async (today: string) => {
    let lastSolved: string | null = null;
    let currentStreak = streak;

    if (user) {
      lastSolved = user.user_metadata?.last_solved || localStorage.getItem('patches_plus_last_solved');
      currentStreak = user.user_metadata?.streak ?? streak;
    } else {
      lastSolved = localStorage.getItem('patches_plus_last_solved');
    }

    if (lastSolved !== today) {
      const yesterday = new Date(new Date(today).getTime() - 86400000).toISOString().split('T')[0];
      let newStreak = 1;
      
      if (lastSolved === yesterday) {
         newStreak = currentStreak + 1;
      }
      
      setStreak(newStreak);

      if (user) {
        try {
          await supabase.auth.updateUser({
            data: { streak: newStreak, last_solved: today }
          });
        } catch (e) {
          console.error("Failed to sync streak to DB", e);
        }
      }
      
      localStorage.setItem('patches_plus_streak', newStreak.toString());
      localStorage.setItem('patches_plus_last_solved', today);
    }
  };

  return { streak, incrementStreak };
}
