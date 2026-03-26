import React from 'react';

const FlameIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"></path></svg>;

export function TopBar({ streak, dateStr, timeLapsed, solved, onReset }: { streak: number, dateStr: string, timeLapsed: number, solved: boolean, onReset: () => void }) {
  const dateObj = new Date(dateStr);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  const mins = Math.floor(timeLapsed / 60);
  const secs = timeLapsed % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <div className="flex justify-between items-center w-full px-4 sm:px-6 py-3 bg-white border-b border-[var(--color-linkedin-border)] sticky top-0 z-10 shadow-sm transition-all duration-300">
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
        <div className="flex items-center gap-1.5 text-[var(--color-linkedin-text-muted)] font-semibold text-sm">
          <span className="bg-[#FFF4E5] text-orange-700 px-2 py-0.5 rounded shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] border border-orange-200 flex items-center gap-1.5">
            {streak} <FlameIcon />
          </span>
        </div>
      </div>
    </div>
  );
}
