export type ShapeType = 'rectangle' | 'L' | 'T' | 'Z' | 'plus';
export type CellPos = [number, number]; // [row, col]

export interface Piece {
  id: string;
  shape: ShapeType;
  values: number[];           // 1 or 2 values depending on shape
  cells: [number, number][];  // all [row, col] cells in current orientation
  anchorCell: [number, number]; // the clue anchor cell on the grid
  color: string;
  placed: boolean;
  currentOrientation: number;
}

export interface Puzzle {
  date: string;               // YYYY-MM-DD
  dayOfWeek: number;          // 0=Monday, 6=Sunday
  grid: (string | null)[][];  // 8x8, each cell holds piece id or null
  pieces: Piece[];
  solution: (string | null)[][]; // the correct grid layout
}

export interface GameState {
  puzzle: Puzzle | null;
  currentGrid: (string | null)[][];
  solved: boolean;
  startTime: number;
  moves: number;
  streak: number;
}
