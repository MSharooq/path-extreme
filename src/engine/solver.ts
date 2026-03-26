import { ShapeType } from '../types';
import { getOrientations, CellPos } from './shapes';

export interface Clue {
  id: string;
  shape: ShapeType;
  values: number[];
  anchorCell: CellPos;
}

export function canPlace(grid: number[][], cells: CellPos[], r: number, c: number): boolean {
  for (const [dr, dc] of cells) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) return false;
    if (grid[nr][nc] !== 0) return false;
  }
  return true;
}

export function countSolutions(clues: Clue[]): number {
  let solutions = 0;
  const grid = Array.from({ length: 8 }, () => Array(8).fill(0));
  
  const cluePlacements: { clueId: string, placements: {r: number, c: number, cells: CellPos[]}[] }[] = [];
  const emptyGrid = Array.from({ length: 8 }, () => Array(8).fill(0));

  for (const clue of clues) {
    const orientations = getOrientations(clue.shape, clue.values);
    const validMap = new Map<string, {r: number, c: number, cells: CellPos[]}>();
    
    for (const cells of orientations) {
      for (const [dr, dc] of cells) {
        const r = clue.anchorCell[0] - dr;
        const c = clue.anchorCell[1] - dc;
        
        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
          if (canPlace(emptyGrid, cells, r, c)) {
            // deduplicate identical valid placements
            const cellsSorted = cells.map(cell => [r + cell[0], c + cell[1]]).sort((a,b) => a[0]-b[0] || a[1]-b[1]);
            const key = JSON.stringify(cellsSorted);
            if (!validMap.has(key)) {
              validMap.set(key, { r, c, cells });
            }
          }
        }
      }
    }
    cluePlacements.push({ clueId: clue.id, placements: Array.from(validMap.values()) });
  }

  cluePlacements.sort((a, b) => a.placements.length - b.placements.length);
  if (cluePlacements.some(cp => cp.placements.length === 0)) return 0;

  function backtrack(clueIndex: number) {
    if (solutions >= 2) return;
    if (clueIndex === clues.length) {
      let count = 0;
      for (let r=0; r<8; r++) {
        for (let c=0; c<8; c++) {
          if (grid[r][c] !== 0) count++;
        }
      }
      if (count === 64) solutions++;
      return;
    }

    const currentClue = cluePlacements[clueIndex];
    for (const placement of currentClue.placements) {
      if (canPlace(grid, placement.cells, placement.r, placement.c)) {
        for (const [dr, dc] of placement.cells) grid[placement.r + dr][placement.c + dc] = 1;
        
        backtrack(clueIndex + 1);
        
        for (const [dr, dc] of placement.cells) grid[placement.r + dr][placement.c + dc] = 0;
      }
    }
  }

  backtrack(0);
  return solutions;
}
