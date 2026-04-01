import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  display_name: string | null;
  country_code: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  updated_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthChange(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session);
    });

    async function handleAuthChange(session: Session | null) {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    }

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data || null);
      
      // Auto-save country or avatar if not set
      if (data) {
        if (!data.country_code) {
          saveCountry(userId);
        }
        
        // Also capture avatar from auth metadata if available and not yet in profile
        const metadataAvatar = session?.user.user_metadata.avatar_url;
        if (metadataAvatar && !data.avatar_url) {
          saveAvatar(userId, metadataAvatar);
        }
      }
    }
  }

  async function saveAvatar(userId: string, avatarUrl: string) {
    try {
      const { data } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', userId)
        .select()
        .single();
      if (data) setProfile(data);
    } catch { /* silently fail */ }
  }

  async function saveCountry(userId: string) {
    try {
      const res = await fetch('https://ipapi.co/country/');
      if (res.ok) {
        const code = (await res.text()).trim().toUpperCase().slice(0, 2);
        if (code.length === 2) {
          const { data } = await supabase
            .from('profiles')
            .update({ country_code: code })
            .eq('id', userId)
            .select()
            .single();
          if (data) setProfile(data);
        }
      }
    } catch { /* silently fail */ }
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        // Ensure persistence is handled by Supabase default (localStorage)
      }
    });
    if (error) console.error('Error signing in with Google:', error);
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('patches_plus_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      sessionStorage.removeItem('patch_extreme_guest');
    }
  }

  async function updateDisplayName(name: string) {
    if (!user) return;
    
    let query;
    if (profile) {
      query = supabase
        .from('profiles')
        .update({ 
          display_name: name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
    } else {
      query = supabase
        .from('profiles')
        .insert({ 
          id: user.id, 
          display_name: name,
          updated_at: new Date().toISOString()
        });
    }

    const { data, error } = await query.select().single();

    if (error) throw error;
    else { setProfile(data); return data; }
  }

  async function updateProfile(fields: {
    linkedin_url?: string | null;
    github_url?: string | null;
    portfolio_url?: string | null;
    country_code?: string | null;
  }) {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();
    if (error) throw error;
    else { setProfile(data); return data; }
  }

  async function signInWithEmail(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      }
    });
    if (error) {
      console.error('Error signing in with Email:', error);
      throw error;
    }
  }

  return {
    user,
    session,
    profile,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signOut,
    updateDisplayName,
    updateProfile,
    refreshProfile: () => user && fetchProfile(user.id)
  };
}
