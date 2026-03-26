import React from 'react';
import type { Piece } from '../types';
import { ClueItem } from './ClueItem';

interface CluePanelProps {
  pieces: Piece[];
  placements: { pieceId: string }[];
  activePieceId: string | null;
  orientations: Record<string, number>;
  onSelectPiece: (id: string) => void;
  onToggleOrientation: (id: string) => void;
}

export function CluePanel({ pieces, placements, activePieceId, orientations, onSelectPiece, onToggleOrientation }: CluePanelProps) {
  const handleSelect = (id: string) => {
    if (activePieceId === id) {
      onToggleOrientation(id);
    } else {
      onSelectPiece(id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-[var(--color-linkedin-border)]">
      <div className="p-4 sm:p-5 border-b border-[var(--color-linkedin-border)] bg-white z-10 sticky top-0">
        <h2 className="text-lg font-semibold text-[var(--color-linkedin-text)] m-0">Clues</h2>
        <p className="text-xs text-[var(--color-linkedin-text-muted)] mt-1">Select and place pieces. Tap active piece to rotate.</p>
      </div>
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-2 pb-32">
        {pieces.map(p => {
          const isPlaced = placements.some(pl => pl.pieceId === p.id);
          return (
            <ClueItem 
              key={p.id}
              piece={p}
              isPlaced={isPlaced}
              isActive={activePieceId === p.id}
              onSelect={handleSelect}
              orientationIdx={orientations[p.id] || 0}
            />
          );
        })}
      </div>
    </div>
  );
}
