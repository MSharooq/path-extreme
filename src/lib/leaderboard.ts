import { supabase } from '../lib/supabase';

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  puzzle_date: string;
  time_seconds: number;
  moves: number;
  display_name: string;
  country_code: string | null;
  composite_score: number;
  date_rank: number;
}

export async function submitScore(
  userId: string,
  puzzleDate: string,
  timeSeconds: number,
  moves: number
) {
  const { data, error } = await supabase
    .from('scores')
    .insert({
      user_id: userId,
      puzzle_date: puzzleDate,
      time_seconds: timeSeconds,
      moves: moves,
    })
    .select()
    .single();

  if (error) {
    // 23505 is the PostgreSQL error code for unique_violation
    // This happens if the user has already submitted a score for this date.
    if (error.code === '23505') {
      return null;
    }
    console.error('Error submitting score:', error);
    throw error;
  }
  return data;
}

export async function fetchLeaderboard(puzzleDate: string): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('puzzle_date', puzzleDate)
    .order('composite_score', { ascending: true })
    .limit(50);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
  return data || [];
}

// Map country code to a flag emoji
export function countryCodeToFlag(code: string | null): string {
  if (!code || code.length !== 2) return '🌍';
  const codePoints = [...code.toUpperCase()].map(
    (c) => 0x1F1E6 - 65 + c.charCodeAt(0)
  );
  return String.fromCodePoint(...codePoints);
}

// Detect user's country via a free geo-ip API
export async function detectCountry(): Promise<string | null> {
  try {
    const res = await fetch('https://ipapi.co/country/');
    if (res.ok) {
      const code = await res.text();
      return code.trim().toUpperCase().slice(0, 2);
    }
  } catch {
    // silently fail
  }
  return null;
}

export interface PublicProfile {
  id: string;
  display_name: string;
  country_code: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  world_rank: number | null;
  total_puzzles_solved: number;
  best_score: number | null;
  updated_at: string;
}

export async function fetchPublicProfile(userId: string): Promise<PublicProfile | null> {
  const { data, error } = await supabase.rpc('get_public_profile', {
    target_user_id: userId,
  });
  if (error) {
    console.error('Error fetching public profile:', error);
    return null;
  }
  return data?.[0] ?? null;
}
