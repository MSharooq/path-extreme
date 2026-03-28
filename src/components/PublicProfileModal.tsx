import React, { useEffect, useState } from 'react';
import { fetchPublicProfile, type PublicProfile } from '../lib/leaderboard';

function FlagImage({ code }: { code: string }) {
  return (
    <img
      src={`https://flagcdn.com/24x18/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/48x36/${code.toLowerCase()}.png 2x`}
      width="24"
      height="18"
      alt={code}
      title={code}
      className="rounded-[2px] object-cover shadow-sm"
    />
  );
}

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const TrophyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
  </svg>
);

const PuzzleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

interface PublicProfileModalProps {
  userId: string;
  onClose: () => void;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function ensureHttps(url: string): string {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}

export function PublicProfileModal({ userId, onClose }: PublicProfileModalProps) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicProfile(userId)
      .then(setProfile)
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0A66C2] rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm font-medium">Loading profile...</p>
          </div>
        ) : !profile ? (
          <div className="text-center py-20">
            <p className="text-gray-500 font-medium">Profile not found.</p>
          </div>
        ) : (
          <>
            {/* Hero Banner */}
            <div className="h-24 bg-gradient-to-br from-[#0A66C2] via-indigo-600 to-violet-600 relative">
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}
              />
            </div>

            {/* Avatar */}
            <div className="relative px-6 pb-1">
              <div className="absolute -top-10 left-6">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-extrabold">
                    {getInitials(profile.display_name)}
                  </div>
                )}
              </div>
            </div>

            {/* Name & Location */}
            <div className="pt-14 px-6 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 leading-tight">{profile.display_name}</h2>
                  {profile.country_code && (
                    <div className="flex items-center gap-2 mt-1">
                      <FlagImage code={profile.country_code} />
                      <span className="text-sm text-gray-500 font-medium">{profile.country_code}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Row */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                    <TrophyIcon />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-amber-700 leading-tight">
                      {profile.world_rank != null ? `#${profile.world_rank}` : '—'}
                    </div>
                    <div className="text-[11px] text-amber-600 font-semibold">World Rank</div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <PuzzleIcon />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-blue-700 leading-tight">
                      {profile.total_puzzles_solved}
                    </div>
                    <div className="text-[11px] text-blue-600 font-semibold">Puzzles Solved</div>
                  </div>
                </div>
              </div>

              {profile.best_score != null && (
                <div className="mt-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">Best Score</span>
                  <span className="font-extrabold text-gray-800">{profile.best_score} <span className="text-xs font-normal text-gray-400">pts</span></span>
                </div>
              )}

              {/* Social Links */}
              {(profile.linkedin_url || profile.github_url || profile.portfolio_url) && (
                <div className="mt-5 flex flex-col gap-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Links</p>

                  {profile.linkedin_url && (
                    <a
                      href={ensureHttps(profile.linkedin_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 bg-[#0A66C2]/5 hover:bg-[#0A66C2]/10 border border-[#0A66C2]/20 rounded-xl transition-all group"
                    >
                      <span className="text-[#0A66C2]"><LinkedInIcon /></span>
                      <span className="text-sm font-semibold text-[#0A66C2] truncate group-hover:underline">{profile.linkedin_url.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
                    </a>
                  )}

                  {profile.github_url && (
                    <a
                      href={ensureHttps(profile.github_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 bg-gray-900/5 hover:bg-gray-900/10 border border-gray-200 rounded-xl transition-all group"
                    >
                      <span className="text-gray-800"><GitHubIcon /></span>
                      <span className="text-sm font-semibold text-gray-800 truncate group-hover:underline">{profile.github_url.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
                    </a>
                  )}

                  {profile.portfolio_url && (
                    <a
                      href={ensureHttps(profile.portfolio_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 bg-violet-50 hover:bg-violet-100 border border-violet-100 rounded-xl transition-all group"
                    >
                      <span className="text-violet-600"><GlobeIcon /></span>
                      <span className="text-sm font-semibold text-violet-700 truncate group-hover:underline">{profile.portfolio_url.replace(/^https?:\/\//, '')}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
