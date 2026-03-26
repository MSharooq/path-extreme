import { Piece, Puzzle, ShapeType } from '../types';
import { createPRNG, dateToSeed, randomInt, shuffleArray } from './seed';
import { DifficultyParams, getDifficultyParams } from './difficulty';
import { CellPos, getOrientations } from './shapes';
import { Clue, canPlace, countSolutions } from './solver';

function generatePieceSet(prng: () => number, diff: DifficultyParams) {
  for (let attempt = 0; attempt < 5000; attempt++) {
    const pieces: any[] = [];
    let currentCells = 0;
    const count = randomInt(prng, diff.minPieces, diff.maxPieces);
    const targetIrregular = Math.round(count * diff.irregularPct);
    
    let irregularCount = 0;
    let valid = true;
    for (let i = 0; i < count; i++) {
        const isIrregular = irregularCount < targetIrregular;
        let shapeChoices = ['rectangle'];
        if (isIrregular) shapeChoices = diff.allowPlusZ ? ['L', 'T', 'Z', 'plus'] : ['L', 'T'];
        const shape = shapeChoices[Math.floor(prng() * shapeChoices.length)] as ShapeType;
        
        let w = 0, h = 0, n = 0, c = 0;
        let p: any = null;
        for(let j=0; j<50; j++) {
            if (shape === 'rectangle') {
                w = randomInt(prng, 1, 4);
                h = randomInt(prng, 1, 4);
                c = w * h;
                if (c >= 2 && c <= 12) { p = { shape, values: [w, h], cellsCount: c }; break; }
            } else if (shape === 'L') {
                w = randomInt(prng, 2, 4);
                h = randomInt(prng, 2, 4);
                c = w + h - 1;
                if (c >= 3 && c <= 7) { p = { shape, values: [w, h], cellsCount: c }; break; }
            } else if (shape === 'T') {
                w = 3;
                h = randomInt(prng, 2, 3);
                c = w + h - 1;
                if (c >= 4 && c <= 7) { p = { shape, values: [w, h], cellsCount: c }; break; }
            } else if (shape === 'Z') {
                n = randomInt(prng, 2, 4);
                c = 2 * n;
                if (c >= 4 && c <= 8) { p = { shape, values: [n], cellsCount: c }; break; }
            } else if (shape === 'plus') {
                n = randomInt(prng, 2, 3);
                c = 4 * (n - 1) + 1;
                if (c >= 5 && c <= 9) { p = { shape, values: [n], cellsCount: c }; break; }
            }
        }
        if (!p) { valid = false; break; }

        if (i === count - 1) { 
            const remaining = 64 - currentCells;
            if (shape === 'rectangle') {
               let found = false;
               for (w = 1; w <= 4; w++) {
                   if (remaining % w === 0 && (remaining/w) <= 4) {
                       p = { shape: 'rectangle', values: [w, remaining/w], cellsCount: remaining };
                       found = true;
                       break;
                   }
               }
               if(!found) { valid = false; break; }
            } else {
               if (p.cellsCount !== remaining) { valid = false; break; }
            }
        }

        pieces.push(p);
        currentCells += p.cellsCount;
        if (shape !== 'rectangle') irregularCount++;
        
        if (currentCells > 64) { valid = false; break; }
    }
    
    if (valid && currentCells === 64) {
        return pieces.map((p, idx) => ({ ...p, id: `p${idx}` }));
    }
  }
  return null;
}

interface PlacedPiece {
  id: string;
  shape: ShapeType;
  values: number[];
  cells: CellPos[];
}

function fillGrid(prng: () => number, pieces: any[]): PlacedPiece[] | null {
   const grid = Array.from({length: 8}, () => Array(8).fill(0));
   const result: PlacedPiece[] = [];
   const pieceOrientations = pieces.map(p => ({
       ...p, orientations: getOrientations(p.shape, p.values)
   }));
   const order = shuffleArray(Array.from({length: pieces.length}, (_, i) => i), prng);

   function backtrack(orderIdx: number): boolean {
       if (orderIdx === pieces.length) return true;
       
       const piece = pieceOrientations[order[orderIdx]];
       let emptyR = -1, emptyC = -1;
       outer: for (let r = 0; r < 8; r++) {
           for (let c = 0; c < 8; c++) {
               if (grid[r][c] === 0) { emptyR = r; emptyC = c; break outer; }
           }
       }
       if (emptyR === -1) return false;

       const oris = shuffleArray<CellPos[]>(piece.orientations, prng);
       for (const orCells of oris) {
           for (const [dr, dc] of orCells) {
               const r = emptyR - dr;
               const c = emptyC - dc;
               if (r >= 0 && r < 8 && c >= 0 && c < 8 && canPlace(grid, orCells, r, c)) {
                   const absCells: CellPos[] = [];
                   for (const [or_dr, or_dc] of orCells) {
                       grid[r + or_dr][c + or_dc] = 1;
                       absCells.push([r + or_dr, c + or_dc]);
                   }
                   result.push({ id: piece.id, shape: piece.shape, values: piece.values, cells: absCells });
                   if (backtrack(orderIdx + 1)) return true;
                   result.pop();
                   for (const [or_dr, or_dc] of orCells) grid[r + or_dr][c + or_dc] = 0;
               }
           }
       }
       return false;
   }

   return backtrack(0) ? result : null;
}

export function generateDailyPuzzle(dateStr: string): Puzzle {
  const seed = dateToSeed(dateStr);
  const prng = createPRNG(seed);
  const dateObj = new Date(dateStr);
  let dayOfWeek = dateObj.getDay() - 1;
  if (dayOfWeek < 0) dayOfWeek = 6;
  
  const diff = getDifficultyParams(dayOfWeek);
  const startTime = Date.now();

  while (Date.now() - startTime < 6000) {
      const pieces = generatePieceSet(prng, diff);
      if (!pieces) continue;
      
      const placedPieces = fillGrid(prng, pieces);
      if (!placedPieces) continue;

      let uniqueFound = false;
      let finalClues: Clue[] = [];

      for (let anchorAttempt = 0; anchorAttempt < 10; anchorAttempt++) {
          const clues: Clue[] = placedPieces.map(p => ({
              id: p.id,
              shape: p.shape,
              values: p.values,
              anchorCell: p.cells[Math.floor(prng() * p.cells.length)]
          }));

          if (countSolutions(clues) === 1) {
              uniqueFound = true;
              finalClues = clues;
              break;
          }
      }

      if (uniqueFound) {
          const solutionGrid = Array.from({length:8}, ()=>Array<string|null>(8).fill(null));
          for (const p of placedPieces) {
              for (const [r, c] of p.cells) solutionGrid[r][c] = p.id;
          }

          const puzzlePieces: Piece[] = placedPieces.map((p, idx) => {
              const clue = finalClues.find(c => c.id === p.id)!;
              return {
                  id: p.id,
                  shape: p.shape,
                  values: p.values,
                  cells: p.cells,
                  anchorCell: clue.anchorCell,
                  color: `var(--color-piece-${idx % 16})`,
                  placed: false,
                  currentOrientation: 0
              };
          });

          // Shuffle puzzle pieces so they aren't presented in order of backtracking solution
          const shuffledPieces = shuffleArray(puzzlePieces, prng);

          return {
              date: dateStr,
              dayOfWeek,
              grid: Array.from({length:8}, ()=>Array(8).fill(null)),
              pieces: shuffledPieces,
              solution: solutionGrid
          };
      }
  }

  // Fallback to a simpler, faster generation if strict uniqueness times out
  throw new Error("Failed to generate unique puzzle within timeout.");
}
