import React, { useRef, useEffect } from 'react';
import { Cell } from './Cell';
import type { Piece } from '../types';
import { type CellPos } from '../engine/shapes';

interface GridProps {
  pieces: Piece[];
  drafts: Record<string, CellPos[]>;
  lockedPieces: Set<string>;
  onPaint: (pieceId: string, r: number, c: number) => void;
  onResetShape: (pieceId: string) => void;
  onStrokeStart: () => void;
  onStrokeEnd: () => void;
}

export function Grid({ pieces, drafts, lockedPieces, onPaint, onResetShape, onStrokeStart, onStrokeEnd }: GridProps) {
  const dragRef = useRef<{ pieceId: string, startR: number, startC: number, paintedCount: number, isDraftEmpty: boolean } | null>(null);

  const gridMap = Array.from({length:8}, ()=>Array<{pieceId: string, color: string, locked: boolean}|null>(8).fill(null));
  
  pieces.forEach(p => {
    const d = drafts[p.id] || [];
    const isLocked = lockedPieces.has(p.id);
    d.forEach(([r, c]) => {
      if(r>=0 && r<8 && c>=0 && c<8) gridMap[r][c] = { pieceId: p.id, color: p.color, locked: isLocked };
    });
  });

  const handlePointerDown = (r: number, c: number) => {
     onStrokeStart();
     
     const anchorPiece = pieces.find(p => p.anchorCell[0] === r && p.anchorCell[1] === c);
     if (anchorPiece && !lockedPieces.has(anchorPiece.id)) {
         const currentDraft = drafts[anchorPiece.id] || [];
         dragRef.current = { pieceId: anchorPiece.id, startR: r, startC: c, paintedCount: 0, isDraftEmpty: currentDraft.length === 0 };
         onPaint(anchorPiece.id, r, c);
         return;
     }
     
     const existing = gridMap[r][c];
     if (existing && !existing.locked) {
         dragRef.current = { pieceId: existing.pieceId, startR: r, startC: c, paintedCount: 0, isDraftEmpty: false };
         onPaint(existing.pieceId, r, c);
         return; 
     }
  };

  const handlePointerEnter = (r: number, c: number) => {
     if (!dragRef.current) return;
     if (dragRef.current.pieceId) {
         dragRef.current.paintedCount++;
         onPaint(dragRef.current.pieceId, r, c);
     }
  };

  const handlePointerUp = () => {
     if (dragRef.current) {
         if (dragRef.current.paintedCount === 0 && !dragRef.current.isDraftEmpty) {
             const targetPiece = pieces.find(p => p.id === dragRef.current!.pieceId);
             if (targetPiece && targetPiece.anchorCell[0] === dragRef.current.startR && targetPiece.anchorCell[1] === dragRef.current.startC) {
                 onResetShape(dragRef.current.pieceId);
             }
         }
         dragRef.current = null;
         onStrokeEnd();
     }
  };

  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, [pieces]);

  const cells = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const placed = gridMap[r][c];
      
      const anchorPiece = pieces.find(p => p.anchorCell[0] === r && p.anchorCell[1] === c);
      const anchorData = anchorPiece ? { shape: anchorPiece.shape, values: anchorPiece.values, color: anchorPiece.color } : null;

      let hideTop = false, hideRight = false, hideBottom = false, hideLeft = false;
      if (placed) {
          hideTop = r > 0 && gridMap[r-1][c]?.pieceId === placed.pieceId;
          hideRight = c < 7 && gridMap[r][c+1]?.pieceId === placed.pieceId;
          hideBottom = r < 7 && gridMap[r+1][c]?.pieceId === placed.pieceId;
          hideLeft = c > 0 && gridMap[r][c-1]?.pieceId === placed.pieceId;
      }

      cells.push(
        <Cell 
          key={`${r}-${c}`} r={r} c={c}
          color={placed ? placed.color : null}
          anchorData={anchorData}
          isLocked={placed ? placed.locked : false}
          hideTop={hideTop} hideRight={hideRight} hideBottom={hideBottom} hideLeft={hideLeft}
          onEnter={(er, ec) => handlePointerEnter(er, ec)}
          onDown={handlePointerDown}
        />
      );
    }
  }

  return (
    <div 
       className="w-full max-w-lg mx-auto bg-white border-t-2 border-l-2 border-dotted border-[var(--color-linkedin-grid-border)] rounded-xl overflow-hidden grid grid-cols-8 grid-rows-8 outline-none select-none touch-none aspect-square shadow-xl ring-1 ring-black/5"
       onPointerLeave={handlePointerUp}
       onPointerMove={(e) => {
         if (e.pointerType === 'touch' && dragRef.current) {
             const el = document.elementFromPoint(e.clientX, e.clientY);
             if (el) {
                 const cellR = el.getAttribute('data-r');
                 const cellC = el.getAttribute('data-c');
                 if (cellR !== null && cellC !== null) {
                     handlePointerEnter(parseInt(cellR), parseInt(cellC));
                 }
             }
         }
       }}
    >
      {cells}
    </div>
  );
}
