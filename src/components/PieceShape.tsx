import React from 'react';
import type { ShapeType } from '../types';
import { getOrientations } from '../engine/shapes';

export function PieceShape({ shape, values, color, oriIdx = 0 }: { shape: ShapeType, values: number[], color: string, oriIdx?: number }) {
  const orientations = getOrientations(shape, values);
  const cells = orientations[oriIdx] || orientations[0];
  
  if (!cells || cells.length === 0) return null;

  const maxR = Math.max(...cells.map(c => c[0])) + 1;
  const maxC = Math.max(...cells.map(c => c[1])) + 1;

  const grid = Array.from({length: maxR}, () => Array(maxC).fill(false));
  cells.forEach(([r, c]) => grid[r][c] = true);

  return (
    <div 
      className="inline-grid gap-[1px]" 
      style={{
        gridTemplateColumns: `repeat(${maxC}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${maxR}, minmax(0, 1fr))`
      }}
    >
      {grid.map((row, r) => 
        row.map((active, c) => (
          <div 
            key={`${r}-${c}`} 
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] transition-colors shadow-sm`}
            style={{ backgroundColor: active ? color : 'transparent' }}
          />
        ))
      )}
    </div>
  );
}
