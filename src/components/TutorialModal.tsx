import React, { useState, useEffect } from 'react';
import { PieceShape } from './PieceShape';
import { TrophyIcon, StarIcon, WorldIcon } from './icons';

interface TutorialModalProps {
  onClose: () => void;
}

const TutorialGrid = ({ cells, activeRange = [], hatched = false, anchor = null }: { 
  cells: [number, number][], 
  activeRange?: number[], 
  hatched?: boolean,
  anchor?: { r: number, c: number, label: string } | null
}) => {
  return (
    <div className="grid grid-cols-5 gap-1 bg-gray-100 p-2 rounded-lg border border-gray-200 w-40 h-40 mx-auto transition-all shadow-inner">
      {Array.from({ length: 25 }).map((_, i) => {
        const r = Math.floor(i / 5);
        const c = i % 5;
        const isActive = cells.some(cell => cell[0] === r && cell[1] === c);
        const isCurrentlyPainting = activeRange.length > 0 && i >= activeRange[0] && i <= activeRange[1];
        const isAnchor = anchor && anchor.r === r && anchor.c === c;

        return (
          <div 
            key={i} 
            className={`
              w-full h-full rounded-[2px] transition-all duration-300
              ${isActive || isCurrentlyPainting ? 'bg-[var(--color-linkedin-blue)] shadow-sm' : 'bg-white'}
              ${hatched && (isActive || isCurrentlyPainting) ? 'opacity-80' : ''}
              flex items-center justify-center relative overflow-hidden
            `}
            style={{
              backgroundImage: hatched && (isActive || isCurrentlyPainting) 
                ? 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 4px)' 
                : 'none'
            }}
          >
            {isAnchor && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white z-10 bg-[var(--color-linkedin-blue)] px-1 rounded-sm shadow-sm scale-75 whitespace-nowrap">
                  {anchor.label}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export function TutorialModal({ onClose }: TutorialModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationStep(s => (s + 1) % 10);
    }, 800);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const slides = [
    {
      title: "Welcome to PatchExtreme",
      description: "A daily logic game where you solve spatial puzzles by fitting specific shapes into a grid. It's like a mix of Sudoku and Tetris!",
      content: (
        <div className="flex flex-col items-center py-6">
          <img 
            src="/maskable-icon.png" 
            alt="PatchExtreme Logo" 
            className="w-20 h-20 rounded-2xl shadow-xl mb-6 animate-bounce"
          />
          <div className="flex gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>
                <StarIcon className="w-5 h-5 text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Reading Anchor Clues",
      description: "Each colored cell contains an 'Anchor Clue' (e.g., 'R 2x3'). This tells you the shape type (Rectangle) and its target dimensions.",
      content: (
        <div className="py-4">
          <TutorialGrid 
            cells={[]} 
            anchor={{ r: 2, c: 2, label: 'R 2x3' }} 
          />
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold uppercase">R = Rectangle</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold uppercase">L = L-Shape</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold uppercase">T = T-Shape</span>
          </div>
        </div>
      )
    },
    {
      title: "Click and Drag to Paint",
      description: "Start painting by clicking and dragging from an anchor cell. You can release and branch out again from any painted cells.",
      content: (
        <div className="py-4">
          <TutorialGrid 
            cells={[]} 
            activeRange={animationStep < 6 ? [12, 12 + animationStep * 1] : [12, 18]} 
            anchor={{ r: 2, c: 2, label: '...' }}
          />
          <div className="mt-4 flex items-center justify-center gap-2 text-gray-400">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                <path d="M15 11l-3 3-3-3m3 3V10"/>
             </svg>
             <span className="text-xs font-bold uppercase tracking-widest">Dragging...</span>
          </div>
        </div>
      )
    },
    {
      title: "Locking & Hatching",
      description: "Once a shape exactly matches its target on the grid, it will automatically lock and display a 'hatch' pattern. You can't undo locked shapes!",
      content: (
        <div className="py-4">
          <TutorialGrid 
            cells={animationStep > 5 ? [[1,1], [1,2], [2,1], [2,2], [3,1], [3,2]] : [[1,1], [1,2], [2,1], [2,2]]} 
            hatched={animationStep > 5}
            anchor={{ r: 1, c: 1, label: 'R 3x2' }}
          />
          {animationStep > 5 && (
            <div className="mt-4 text-center text-emerald-600 font-bold text-sm animate-in fade-in zoom-in slide-in-from-top-2">
              ✨ Locked! ✨
            </div>
          )}
        </div>
      )
    },
    {
      title: "Meet the Shapes",
      description: "Master these five patterns to conquer the daily puzzle. Each has unique rules for its values.",
      content: (
        <div className="py-2 max-h-48 overflow-y-auto pr-2 space-y-4">
          {[
            { n: 'Rectangle', s: 'rectangle', v: [3, 2], d: 'Width × Height', c: 'var(--color-piece-0)' },
            { n: 'L-Shape', s: 'L', v: [3, 3], d: 'Right × Top Arms', c: 'var(--color-piece-2)' },
            { n: 'T-Shape', s: 'T', v: [3, 3], d: 'Base × Stem', c: 'var(--color-piece-4)' },
            { n: 'Z-Shape', s: 'Z', v: [3], d: 'Step Length', c: 'var(--color-piece-1)' },
            { n: 'Plus (+)', s: 'plus', v: [2], d: 'Arm Radius', c: 'var(--color-piece-3)' }
          ].map((sh, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center scale-90 shadow-sm shrink-0">
                <PieceShape shape={sh.s as any} values={sh.v} color={sh.c} />
              </div>
              <div>
                <div className="text-[13px] font-bold text-gray-800 uppercase tracking-tight leading-none mb-1">{sh.n}</div>
                <div className="text-[11px] text-gray-500 font-medium leading-tight">{sh.d}</div>
              </div>
            </div>
          ))}
        </div>
      )
    }
  ];

  const isLastSlide = currentSlide === slides.length - 1;

  const next = () => {
    if (isLastSlide) onClose();
    else setCurrentSlide(s => s + 1);
  };

  const back = () => {
    setCurrentSlide(s => Math.max(0, s - 1));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* Progress Bar */}
        <div className="flex h-1.5 w-full bg-gray-100">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 transition-all duration-500 ${i <= currentSlide ? 'bg-[var(--color-linkedin-blue)]' : ''}`}
            />
          ))}
        </div>

        <div className="p-8 flex-1 flex flex-col">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight tracking-tight mb-3">
              {slides[currentSlide].title}
            </h2>
            <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
              {slides[currentSlide].description}
            </p>

            <div className="min-h-[160px] flex items-center justify-center">
              {slides[currentSlide].content}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button 
              onClick={next}
              className="w-full py-3.5 bg-[var(--color-linkedin-blue)] hover:bg-[#004182] text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95"
            >
              {isLastSlide ? "Let's Play!" : "Continue"}
            </button>
            
            <div className="flex justify-between items-center px-1">
              <button 
                onClick={back}
                disabled={currentSlide === 0}
                className="text-sm font-bold text-gray-400 hover:text-gray-600 disabled:opacity-0 transition-all uppercase tracking-widest"
              >
                Back
              </button>
              <button 
                onClick={onClose}
                className="text-sm font-bold text-gray-300 hover:text-red-400 transition-all uppercase tracking-widest"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
