import React, { useEffect, useState } from 'react';
import { fetchLeaderboard, type LeaderboardEntry } from '../lib/leaderboard';
import { PublicProfileModal } from './PublicProfileModal';
import { TrophyIcon, MedalIcon, StarIcon } from './icons';

function FlagImage({ code }: { code: string }) {
  return (
    <img
      src={`https://flagcdn.com/24x18/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/48x36/${code.toLowerCase()}.png 2x`}
      width="24"
      height="18"
      alt={code}
      title={code}
      className="rounded-[2px] object-cover shadow-sm flex-shrink-0"
    />
  );
}

interface LeaderboardModalProps {
  puzzleDate: string;
  currentUserId?: string;
  onClose: () => void;
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const getRankStyle = (rank: number) => {
  if (rank === 1) return { bg: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-700 border-amber-200', color: '#b45309' };
  if (rank === 2) return { bg: 'bg-slate-50 border-slate-200', badge: 'bg-slate-100 text-slate-700 border-slate-200', color: '#64748b' };
  if (rank === 3) return { bg: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-700 border-orange-200', color: '#c2410c' };
  return { bg: 'bg-white border-gray-100', badge: 'bg-gray-50 text-gray-500 border-gray-100', color: 'currentColor' };
};

export function LeaderboardModal({ puzzleDate, currentUserId, onClose }: LeaderboardModalProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const dateObj = new Date(puzzleDate);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  useEffect(() => {
    fetchLeaderboard(puzzleDate)
      .then(setEntries)
      .catch(() => setError('Could not load leaderboard.'))
      .finally(() => setLoading(false));
  }, [puzzleDate]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-br from-[#0A66C2] to-[#0950a8] text-white flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center gap-1.5 transition-all backdrop-blur-md active:scale-95 group"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            <span className="text-xs font-bold uppercase tracking-wider">Close</span>
          </button>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <TrophyIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Leaderboard</h2>
              <p className="text-blue-100 text-sm font-medium">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0A66C2] rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium text-sm">Loading rankings...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 font-bold">{error}</p>
            </div>
          )}

          {!loading && !error && entries.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                <StarIcon className="w-8 h-8 text-[#0A66C2]" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">No scores yet!</h3>
              <p className="text-gray-500 text-sm">Be the first to complete today's puzzle and claim the top spot.</p>
            </div>
          )}

          {!loading && !error && entries.length > 0 && (
            <div className="space-y-2">
              {entries.map((entry) => {
                const { bg, badge } = getRankStyle(entry.date_rank);
                const isCurrentUser = entry.user_id === currentUserId;

                return (
                  <div
                    key={entry.id}
                    onClick={() => setSelectedUserId(entry.user_id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${bg} ${isCurrentUser ? 'ring-2 ring-[#0A66C2] ring-offset-1' : ''} transition-all cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-[0.99]`}
                  >
                    {/* Rank */}
                    <div className={`w-9 h-9 flex-shrink-0 rounded-full border ${badge} flex items-center justify-center text-xs font-bold`}>
                      {entry.date_rank <= 3 ? (
                        <MedalIcon className="w-5 h-5" color={getRankStyle(entry.date_rank).color} />
                      ) : (
                        entry.date_rank
                      )}
                    </div>

                    {/* Avatar + Name */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900 text-sm truncate">
                          {entry.display_name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] bg-[#0A66C2] text-white px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">You</span>
                        )}
                        {entry.country_code && (
                          <FlagImage code={entry.country_code} />
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          {formatTime(entry.time_seconds)}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 font-medium">{entry.moves} moves</span>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-right flex-shrink-0 bg-white/50 px-3 py-1.5 rounded-lg border border-gray-100/50">
                      <div className="text-base font-bold text-[#0A66C2]">{entry.composite_score}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">pts</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
          <p className="text-center text-xs text-gray-400 font-medium">
            Tap any row to view profile &nbsp;·&nbsp; Score = Time (s) + Moves × 5
          </p>
        </div>
      </div>

      {/* Public Profile Overlay */}
      {selectedUserId && (
        <PublicProfileModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}
