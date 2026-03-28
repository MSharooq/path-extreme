import { useState, useEffect } from 'react';
import type { Puzzle } from '../types';
import { type CellPos, isValidShape } from '../engine/shapes';

export function useGameState(puzzle: Puzzle | null, onWin: () => void, isPaused: boolean = false) {
  const [drafts, setDrafts] = useState<Record<string, CellPos[]>>({});
  const [history, setHistory] = useState<Record<string, CellPos[]>[]>([]);
  const [lockedPieces, setLockedPieces] = useState<Set<string>>(new Set());
  
  const [solved, setSolved] = useState(false);
  const [moves, setMoves] = useState(0);
  const [timeLapsed, setTimeLapsed] = useState(0);
  const [lastHintTime, setLastHintTime] = useState(0);

  useEffect(() => {
    if (puzzle) {
      setDrafts({});
      setHistory([]);
      setLockedPieces(new Set());
      setSolved(false);
      setMoves(0);
      setTimeLapsed(0);
      setLastHintTime(0);
      
      const stored = localStorage.getItem(`patches_plus_solved_${puzzle.date}`);
      if (stored) {
        setSolved(true);
        const solvedDrafts: Record<string, CellPos[]> = {};
        puzzle.pieces.forEach(p => solvedDrafts[p.id] = p.cells);
        setDrafts(solvedDrafts);
        setLockedPieces(new Set(puzzle.pieces.map(p => p.id)));
      }
    }
  }, [puzzle]);

  useEffect(() => {
    if (!puzzle || solved || isPaused) return;
    const interval = setInterval(() => {
      setTimeLapsed(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [puzzle, solved, isPaused]);

  useEffect(() => {
     if (!puzzle || solved) return;
     let newlyLocked = false;
     const nextLocked = new Set(lockedPieces);

     for (const piece of puzzle.pieces) {
         if (nextLocked.has(piece.id)) continue;
         const d = drafts[piece.id] || [];
         
         if (isValidShape(d, piece.shape, piece.values, piece.anchorCell)) {
             const sol = piece.cells;
             if (d.length === sol.length && d.every(c => sol.some(sc => sc[0]===c[0] && sc[1]===c[1]))) {
                 nextLocked.add(piece.id);
                 newlyLocked = true;
             }
         }
     }
     
     if (newlyLocked) {
         setLockedPieces(nextLocked);
     }
     
     if (nextLocked.size === puzzle.pieces.length) {
         setSolved(true);
         localStorage.setItem(`patches_plus_solved_${puzzle.date}`, 'true');
         onWin();
     }
  }, [drafts, lockedPieces, puzzle, solved, onWin]);

  const onPaint = (pieceId: string, r: number, c: number) => {
     if (lockedPieces.has(pieceId)) return;
     setDrafts(prev => {
         const current = prev[pieceId] || [];
         if (current.some(cell => cell[0] === r && cell[1] === c)) return prev; 
         
         const newDrafts = { ...prev };
         for (const id of Object.keys(newDrafts)) {
             if (id === pieceId) continue;
             if (lockedPieces.has(id)) {
                 if (newDrafts[id].some(cell => cell[0] === r && cell[1] === c)) return prev; 
             }
             newDrafts[id] = newDrafts[id].filter(cell => cell[0] !== r || cell[1] !== c);
         }
         
         newDrafts[pieceId] = [...current, [r, c]];
         return newDrafts;
     });
  };

  const onResetShape = (pieceId: string) => {
      if (lockedPieces.has(pieceId)) return;
      pushHistory();
      setDrafts(prev => {
          const next = { ...prev };
          delete next[pieceId];
          return next;
      });
  };

  const pushHistory = () => {
      setHistory(prev => [...prev, drafts]);
      setMoves(m => m + 1);
  };

  const undo = () => {
      if (history.length > 0) {
          const last = history[history.length - 1];
          setDrafts(last);
          setHistory(prev => prev.slice(0, -1));
          setMoves(m => m + 1);
      }
  };

  const applyHint = () => {
    if (!puzzle || solved) return;
    if (Date.now() - lastHintTime < 25000 && lastHintTime !== 0) return;
    
    const unlocked = puzzle.pieces.find(p => !lockedPieces.has(p.id));
    if (unlocked) {
        pushHistory();
        const next = { ...drafts };
        for (const [r, c] of unlocked.cells) {
            for (const id of Object.keys(next)) {
                if (lockedPieces.has(id)) continue;
                next[id] = next[id].filter(cell => cell[0] !== r || cell[1] !== c);
            }
        }
        next[unlocked.id] = unlocked.cells;
        setDrafts(next);
        setLockedPieces(prev => new Set(prev).add(unlocked.id));
        setLastHintTime(Date.now());
        setMoves(m => m + 1);
    }
  };

  const resetGame = () => {
    if (!puzzle) return;
    localStorage.removeItem(`patches_plus_solved_${puzzle.date}`);
    setDrafts({});
    setHistory([]);
    setLockedPieces(new Set());
    setSolved(false);
    setMoves(0);
    setTimeLapsed(0);
    setLastHintTime(0);
  };

  return {
    drafts,
    lockedPieces,
    history,
    onPaint,
    onResetShape,
    pushHistory,
    undo,
    applyHint,
    resetGame,
    solved,
    moves,
    timeLapsed,
    lastHintTime
  };
}
