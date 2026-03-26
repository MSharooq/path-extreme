import type { ShapeType } from '../types';

export type CellPos = [number, number]; // [row, col]

// Normalize cells to align the top-leftmost cell to (0,0) bounds
export function normalizeCells(cells: CellPos[]): CellPos[] {
  const minRow = Math.min(...cells.map(c => c[0]));
  const minCol = Math.min(...cells.map(c => c[1]));
  return cells.map(([r, c]) => [r - minRow, c - minCol]);
}

// Rotate cells 90 degrees clockwise within their bounding box
export function rotateCells(cells: CellPos[], boundingH: number): CellPos[] {
  return cells.map(([r, c]) => [c, boundingH - 1 - r]);
}

export function getOrientations(shape: ShapeType, values: number[]): CellPos[][] {
  let baseCells: CellPos[] = [];
  let w = 0, h = 0;
  let orientationsCount = 1;

  if (shape === 'rectangle') {
    w = values[0];
    h = values[1];
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        baseCells.push([r, c]);
      }
    }
    orientationsCount = w === h ? 1 : 2;
  } else if (shape === 'L') {
    w = values[0];
    h = values[1];
    for (let r = 0; r < h; r++) baseCells.push([r, 0]);
    for (let c = 1; c < w; c++) baseCells.push([h - 1, c]);
    orientationsCount = 4;
  } else if (shape === 'T') {
    w = values[0];
    h = values[1];
    const centerCol = Math.floor(w / 2);
    for (let c = 0; c < w; c++) baseCells.push([0, c]);
    for (let r = 1; r < h; r++) baseCells.push([r, centerCol]);
    orientationsCount = 4;
  } else if (shape === 'Z') {
    const n = values[0];
    w = 2 * n - 1;
    h = 2;
    for (let c = 0; c < n; c++) baseCells.push([0, c]);
    for (let c = n - 1; c < 2 * n - 1; c++) baseCells.push([1, c]);
    orientationsCount = 2;
  } else if (shape === 'plus') {
    const n = values[0];
    w = 2 * n - 1;
    h = 2 * n - 1;
    const center = n - 1;
    baseCells.push([center, center]);
    for (let i = 1; i < n; i++) {
      baseCells.push([center - i, center]); // up
      baseCells.push([center + i, center]); // down
      baseCells.push([center, center - i]); // left
      baseCells.push([center, center + i]); // right
    }
    orientationsCount = 1;
  }

  const result: CellPos[][] = [normalizeCells(baseCells)];
  let currentCells = baseCells;
  let currH = h;
  let currW = w;
  for (let i = 1; i < orientationsCount; i++) {
    currentCells = rotateCells(currentCells, currH);
    result.push(normalizeCells(currentCells));
    [currW, currH] = [currH, currW];
  }

  const uniqueStrs = new Set<string>();
  const finalResult: CellPos[][] = [];
  for (const layout of result) {
    layout.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
    const str = JSON.stringify(layout);
    if (!uniqueStrs.has(str)) {
      uniqueStrs.add(str);
      finalResult.push(layout);
    }
  }

  return finalResult;
}

export function isValidShape(drawnCells: CellPos[], shape: ShapeType, values: number[], anchor: CellPos): boolean {
   if (drawnCells.length === 0) return false;
   if (!drawnCells.some(c => c[0] === anchor[0] && c[1] === anchor[1])) return false;

   const oris = getOrientations(shape, values);
   if (drawnCells.length !== oris[0].length) return false;
   
   const normalizedDrawn = normalizeCells(drawnCells).sort((a,b) => a[0] - b[0] || a[1] - b[1]);
   const drawnStr = JSON.stringify(normalizedDrawn);
   
   return oris.some(ori => {
       const sortedOri = [...ori].sort((a,b) => a[0] - b[0] || a[1] - b[1]);
       return JSON.stringify(sortedOri) === drawnStr;
   });
}
