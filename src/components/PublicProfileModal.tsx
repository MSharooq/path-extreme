import React, { useEffect, useState } from 'react';
import { fetchPublicProfile, type PublicProfile } from '../lib/leaderboard';
import { TrophyIcon, WorldIcon } from './icons';

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

// Icons are imported from ./icons

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
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-black/20 hover:bg-black/30 text-white rounded-full flex items-center gap-1.5 transition-all backdrop-blur-md active:scale-95 group"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider">Back</span>
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
            <div className="h-28 bg-[#0A66C2] relative">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Avatar */}
            <div className="relative px-6 pb-1">
              <div className="absolute -top-12 left-6">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl object-cover transition-transform hover:scale-[1.02]"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 text-3xl font-bold">
                    {getInitials(profile.display_name)}
                  </div>
                )}
              </div>
            </div>

            {/* Name & Location */}
            <div className="pt-16 px-6 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">{profile.display_name}</h2>
                  {profile.country_code && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <FlagImage code={profile.country_code} />
                      <span className="text-sm text-gray-500 font-semibold uppercase tracking-wider">{profile.country_code}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Row */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    const event = new CustomEvent('open-world-rank');
                    window.dispatchEvent(event);
                    onClose();
                  }}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2 transition-all hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] text-left group"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 shadow-sm group-hover:scale-110 transition-transform">
                    <WorldIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-700 leading-none">
                      {profile.world_rank != null ? `#${profile.world_rank}` : '—'}
                    </div>
                    <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">World Rank</div>
                  </div>
                </button>

                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex flex-col gap-2 transition-all hover:bg-blue-50">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                    <TrophyIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-700 leading-none">
                      {profile.total_puzzles_solved}
                    </div>
                    <div className="text-[11px] text-blue-600 font-bold uppercase tracking-wider mt-1">Solved</div>
                  </div>
                </div>
              </div>

              {profile.best_score != null && (
                <div className="mt-4 bg-gray-50/80 border border-gray-100 rounded-2xl px-5 py-3.5 flex items-center justify-between transition-all hover:bg-gray-50">
                  <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">Best Score</span>
                  <span className="text-lg font-bold text-gray-900 tracking-tight">{profile.best_score} <span className="text-xs font-semibold text-gray-400 ml-0.5 uppercase tracking-normal">pts</span></span>
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
