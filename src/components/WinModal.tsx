import { useState } from 'react';
import { TrophyIcon } from './icons';

interface WinProps {
  dateStr: string;
  timeLapsed: number;
  moves: number;
  streak: number;
  onReset: () => void;
  onClose: () => void;
  onLeaderboard?: () => void;
}

export function WinModal({ dateStr, timeLapsed, moves, streak, onReset, onClose, onLeaderboard }: WinProps) {
  const [copied, setCopied] = useState(false);
  const dateObj = new Date(dateStr);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  
  const mins = Math.floor(timeLapsed / 60);
  const secs = timeLapsed % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  // Use the name "Patches" in the share block as it is requested
  const defaultShare = `PatchExtreme — ${formattedDate}\n✅ Solved in ${timeStr}\n🎯 Moves: ${moves}\n🔥 Streak: ${streak}`;

  const handleShare = () => {
    navigator.clipboard.writeText(defaultShare).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-xs w-full shadow-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-emerald-100">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#057642" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-linkedin-text)] text-center tracking-tight">Daily Puzzle Solved!</h2>
          <p className="text-sm text-[var(--color-linkedin-text-muted)] font-medium mt-1">{formattedDate}</p>
        </div>

        <div className="bg-[var(--color-linkedin-bg)] rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[var(--color-linkedin-text-muted)]">Time</span>
            <span className="font-semibold text-[var(--color-linkedin-text)]">{timeStr}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[var(--color-linkedin-text-muted)]">Moves</span>
            <span className="font-semibold text-[var(--color-linkedin-text)]">{moves}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--color-linkedin-text-muted)]">Streak</span>
            <span className="font-semibold text-orange-600 flex items-center gap-1">{streak} <span className="text-sm">🔥</span></span>
          </div>
        </div>

        <button 
          onClick={handleShare}
          className="w-full py-2.5 mb-2 rounded-full text-white font-semibold text-base transition-colors bg-[var(--color-linkedin-blue)] hover:bg-[#004182]"
        >
          {copied ? 'Copied!' : 'Share'}
        </button>

        {onLeaderboard && (
          <button
            onClick={() => { onClose(); onLeaderboard(); }}
            className="w-full py-2.5 mb-2 rounded-full text-amber-700 border-2 border-amber-200 font-bold text-base transition-all hover:bg-amber-50 active:scale-95 flex items-center justify-center gap-2"
          >
            <TrophyIcon className="w-5 h-5 text-amber-600" />
            View Leaderboard
          </button>
        )}

        <button 
          onClick={() => { onReset(); onClose(); }}
          className="w-full py-2.5 rounded-full text-[var(--color-linkedin-blue)] border-2 border-[var(--color-linkedin-blue)] font-semibold text-base transition-all hover:bg-[#0A66C20A] active:scale-95"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
