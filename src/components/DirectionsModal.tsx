import React from 'react';

export function DirectionsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <h2 className="text-xl font-bold text-[var(--color-linkedin-text)] mb-4">How to Play</h2>
        
        <div className="space-y-4 text-sm text-[var(--color-linkedin-text-muted)] leading-relaxed">
          <p>
            <strong className="text-[var(--color-linkedin-text)] block mb-1">1. Find an Anchor</strong>
            Look for clue cells natively on the grid (e.g. 'L 2x3' or '+ 2').
          </p>
          <p>
            <strong className="text-[var(--color-linkedin-text)] block mb-1">2. Drag to Build</strong>
            Click and drag <strong>from</strong> the anchor cell towards empty space. The piece will automatically stretch and orient in your drag direction.
          </p>
          <p>
            <strong className="text-[var(--color-linkedin-text)] block mb-1">3. Lock it in</strong>
            Release your mouse/finger to place the piece. If it is exactly in the correct solution spot, it will <strong>permanently lock</strong> into place!
          </p>
          <p>
            <strong className="text-[var(--color-linkedin-text)] block mb-1">4. Fill the grid</strong>
            Securely lock all pieces into the 8x8 grid with no overlaps to win the daily puzzle. Use the 'Hint' button if you get stuck!
          </p>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-6 py-2.5 rounded-full text-white font-semibold text-base transition-all transform active:scale-95 bg-[var(--color-linkedin-blue)] hover:bg-[#004182] shadow-md hover:shadow-lg"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
