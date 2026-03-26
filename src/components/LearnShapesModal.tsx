import React from 'react';
import { PieceShape } from './PieceShape';
import type { ShapeType } from '../types';

export function LearnShapesModal({ onClose }: { onClose: () => void }) {
  const shapes: { name: string, shape: ShapeType, values: number[], desc: string, color: string }[] = [
    { name: 'Rectangle', shape: 'rectangle', values: [3, 2], desc: 'Defined by Width × Height. Forms a solid dense block. Example: 3×2.', color: 'var(--color-piece-0)' },
    { name: 'L-Shape', shape: 'L', values: [3, 3], desc: 'Defined by Right-Arm × Top-Arm lengths. Forms a symmetrical or asymmetrical "L". Example: 3×3.', color: 'var(--color-piece-2)' },
    { name: 'T-Shape', shape: 'T', values: [3, 3], desc: 'Defined by Top-Bar Width × Stem Height. Forms a balanced "T". Example: 3×3.', color: 'var(--color-piece-4)' },
    { name: 'Z-Shape', shape: 'Z', values: [3], desc: 'Defined by step length N. Forms stepped parallel staircase bars. Example: Z 3.', color: 'var(--color-piece-1)' },
    { name: 'Plus (+)', shape: 'plus', values: [2], desc: 'Defined by arm radius N. Forms a symmetric intersecting cross. Example: + 2.', color: 'var(--color-piece-3)' }
  ];

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="mb-6 border-b border-gray-100 pb-4">
           <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-linkedin-text)] tracking-tight">Learn the Shapes</h2>
           <p className="text-sm text-[var(--color-linkedin-text-muted)] mt-1 font-medium">A visual guide to reading anchor clues.</p>
        </div>
        
        <div className="overflow-y-auto pr-2 space-y-6 mb-2">
           {shapes.map((s, i) => (
              <div key={i} className="flex gap-4 items-center">
                 <div className="w-16 h-16 shrink-0 bg-gray-50 border border-[var(--color-linkedin-grid-border)] rounded-xl flex items-center justify-center shadow-sm">
                    <PieceShape shape={s.shape} values={s.values} color={s.color} />
                 </div>
                 <div>
                    <h3 className="font-bold text-[var(--color-linkedin-text)] text-[15px] sm:text-base leading-none">{s.name}</h3>
                    <p className="text-[13px] text-[var(--color-linkedin-text-muted)] leading-relaxed mt-1.5">{s.desc}</p>
                 </div>
              </div>
           ))}
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-full text-white font-bold text-[15px] transition-all transform active:scale-95 bg-[var(--color-linkedin-blue)] hover:bg-[#004182] shadow-md hover:shadow-lg shrink-0"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
