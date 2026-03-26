import React from 'react';
import type { Piece } from '../types';
import { PieceShape } from './PieceShape';

interface ClueItemProps {
  piece: Piece;
  isPlaced: boolean;
  isActive: boolean;
  onSelect: (id: string) => void;
  orientationIdx: number;
}

export function ClueItem({ piece, isPlaced, isActive, onSelect, orientationIdx }: ClueItemProps) {
  const displayName = piece.shape === 'plus' ? 'Plus' : piece.shape === 'rectangle' ? 'Rectangle' : `${piece.shape.toUpperCase()}`;
  const valuesText = piece.values.join(' × ');

  return (
    <div 
      onClick={() => onSelect(piece.id)}
      className={`
        p-3 rounded-md transition-all duration-200 cursor-pointer select-none flex items-center gap-3 transform
        ${isPlaced ? 'opacity-40 grayscale pointer-events-none scale-95' : 'hover:scale-[1.02]'}
        ${isActive ? 'bg-[var(--color-linkedin-bg)] shadow-[inset_0_0_0_2px_var(--color-linkedin-blue)] scale-[1.02]' : 'bg-white border border-[var(--color-linkedin-border)] hover:bg-gray-50 hover:shadow-sm'}
      `}
    >
      <div className="w-12 h-12 flex items-center justify-center shrink-0 transition-transform duration-300">
         <PieceShape 
            shape={piece.shape} 
            values={piece.values} 
            color={piece.color} 
            oriIdx={orientationIdx} 
         />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-[var(--color-linkedin-text)] capitalize truncate leading-tight transition-colors">
          {displayName}
        </h3>
        <p className="text-[11px] text-[var(--color-linkedin-text-muted)] mt-1 font-mono bg-slate-100 border border-slate-200 inline-block px-1.5 py-0.5 rounded shadow-sm">
           {valuesText}
        </p>
      </div>
      {isPlaced && (
         <div className="shrink-0 text-green-700 font-bold text-lg mr-2 animate-in zoom-in duration-300">
            ✓
         </div>
      )}
    </div>
  );
}
