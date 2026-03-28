import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const FlameIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"></path></svg>;

const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

const LogOutIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;

export function TopBar({ streak, dateStr, timeLapsed, solved, onReset, onSignInRequest, onLeaderboard, onEditProfile, onViewMyProfile }: { 
  streak: number, 
  dateStr: string, 
  timeLapsed: number, 
  solved: boolean, 
  onReset: () => void,
  onSignInRequest: () => void,
  onLeaderboard: () => void,
  onEditProfile: () => void,
  onViewMyProfile: () => void
}) {
  const { user, profile, signInWithGoogle, signOut, loading: authLoading } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const dateObj = new Date(dateStr);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  const mins = Math.floor(timeLapsed / 60);
  const secs = timeLapsed % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="flex justify-between items-center w-full px-4 sm:px-6 py-3 bg-white border-b border-[var(--color-linkedin-border)] sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[var(--color-linkedin-blue)] rounded text-white flex items-center justify-center font-bold text-xl cursor-default shadow-sm transition-transform hover:scale-105">
          in
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight m-0 text-[var(--color-linkedin-text)] leading-none">
            PatchExtreme
          </h1>
          <div className="text-sm font-normal text-[var(--color-linkedin-text-muted)] mt-0.5">{formattedDate}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        {solved && (
          <button 
            onClick={onReset}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-extrabold text-[var(--color-linkedin-blue)] hover:bg-[#0A66C21A] transition-colors"
          >
            Reset Board
          </button>
        )}
        <div className="hidden sm:flex items-center gap-1.5 text-[var(--color-linkedin-text-muted)] font-semibold text-sm">
          <span className="bg-[var(--color-linkedin-bg)] px-2 py-0.5 rounded text-[var(--color-linkedin-text)] font-mono shadow-inner border border-[var(--color-linkedin-border)]">{timeStr}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[var(--color-linkedin-text-muted)] font-semibold text-sm mr-1">
          <span className="bg-[#FFF4E5] text-orange-700 px-2 py-0.5 rounded shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] border border-orange-200 flex items-center gap-1.5">
            {streak} <FlameIcon />
          </span>
        </div>

        <div className="h-8 w-px bg-[var(--color-linkedin-border)] mx-1 hidden sm:block"></div>

        {/* Leaderboard button */}
        <button
          onClick={onLeaderboard}
          title="Leaderboard"
          className="p-2 rounded-full hover:bg-[var(--color-linkedin-bg)] transition-colors text-amber-500 hover:text-amber-600"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
        </button>

        <div className="h-8 w-px bg-[var(--color-linkedin-border)] mx-1 hidden sm:block"></div>

        {!user ? (
          <button
            onClick={onSignInRequest}
            disabled={authLoading}
            className="bg-[var(--color-linkedin-blue)] text-white font-bold px-4 py-1.5 rounded-full shadow-sm hover:bg-[#004182] transition-all text-xs sm:text-sm active:scale-95 disabled:opacity-50"
          >
            {authLoading ? '...' : 'Sign In'}
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-1 hover:bg-[var(--color-linkedin-bg)] rounded-lg transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[var(--color-linkedin-blue)] border border-indigo-200 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                {user.user_metadata.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon />
                )}
              </div>
              <span className="hidden md:block font-bold text-sm text-[var(--color-linkedin-text)] max-w-[120px] truncate">
                {profile?.display_name || user.user_metadata.full_name || 'User'}
              </span>
            </button>

            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowDropdown(false)} 
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[var(--color-linkedin-border)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-[var(--color-linkedin-border)] bg-gray-50/50">
                    <p className="text-xs font-bold text-[var(--color-linkedin-text-muted)] uppercase tracking-wider mb-1">Signed in as</p>
                    <p className="text-sm font-bold text-[var(--color-linkedin-text)] truncate">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => { onViewMyProfile(); setShowDropdown(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      View My Profile
                    </button>
                    <button
                      onClick={() => { onEditProfile(); setShowDropdown(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit Profile
                    </button>
                    <div className="my-1 border-t border-gray-100" />
                    <button
                      onClick={() => {
                        signOut();
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                    >
                      <LogOutIcon /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
