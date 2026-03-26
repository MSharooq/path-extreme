export interface DifficultyParams {
  irregularPct: number;
  minPieces: number;
  maxPieces: number;
  allowPlusZ: boolean;
  spreadOutPieces: boolean; // boolean indicating if irregular pieces should be placed away from walls
}

export function getDifficultyParams(dayOfWeek: number): DifficultyParams {
  // 0 = Monday, 6 = Sunday
  switch (dayOfWeek) {
    case 0: // Monday
      return { irregularPct: 0.40, minPieces: 8, maxPieces: 10, allowPlusZ: false, spreadOutPieces: false };
    case 1: // Tuesday
      return { irregularPct: 0.43, minPieces: 9, maxPieces: 11, allowPlusZ: false, spreadOutPieces: false };
    case 2: // Wednesday
      return { irregularPct: 0.47, minPieces: 10, maxPieces: 12, allowPlusZ: true, spreadOutPieces: false };
    case 3: // Thursday
      return { irregularPct: 0.50, minPieces: 11, maxPieces: 13, allowPlusZ: true, spreadOutPieces: false };
    case 4: // Friday
      return { irregularPct: 0.53, minPieces: 12, maxPieces: 14, allowPlusZ: true, spreadOutPieces: true };
    case 5: // Saturday
      return { irregularPct: 0.57, minPieces: 13, maxPieces: 15, allowPlusZ: true, spreadOutPieces: true };
    case 6: // Sunday
    default:
      return { irregularPct: 0.60, minPieces: 14, maxPieces: 16, allowPlusZ: true, spreadOutPieces: true };
  }
}
