import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { Grid } from './components/Grid';
import { WinModal } from './components/WinModal';
import { LearnShapesModal } from './components/LearnShapesModal';
import { ProfileModal } from './components/ProfileModal';
import { LoginScreen } from './components/LoginScreen';
import { LeaderboardModal } from './components/LeaderboardModal';
import { EditProfileModal } from './components/EditProfileModal';
import { PublicProfileModal } from './components/PublicProfileModal';
import { TutorialModal } from './components/TutorialModal';
import { WorldRankModal } from './components/WorldRankModal';
import { usePuzzle } from './hooks/usePuzzle';
import { useGameState } from './hooks/useGameState';
import { useStreak } from './hooks/useStreak';
import { useAuth } from './hooks/useAuth';
import { submitScore } from './lib/leaderboard';

const ClockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const ResetIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>;
const UndoIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>;
const HintIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>;
const BookIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>;
const ShapesIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;

function App() {
  const { puzzle, loading, error } = usePuzzle();
  const { streak, incrementStreak } = useStreak();
  const { user, profile, updateDisplayName, updateProfile, loading: authLoading } = useAuth();
  const [isGuest, setIsGuest] = useState(() => {
    return sessionStorage.getItem('patch_extreme_guest') === 'true';
  });
  const [showWin, setShowWin] = useState(false);
  const [showLearnShapes, setShowLearnShapes] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [viewProfileId, setViewProfileId] = useState<string | null>(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [showWorldRank, setShowWorldRank] = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => {
    return !localStorage.getItem('patch_extreme_tutorial_seen');
  });

  const handleWin = async () => {
    if (puzzle) incrementStreak(puzzle.date);
    setShowWin(true);
    // Submit score for logged-in users
    if (user && !isGuest && timeLapsed > 0) {
      try {
        await submitScore(user.id, puzzle!.date, timeLapsed, moves);
      } catch (e) {
        console.error('Failed to submit score', e);
      }
    }
  };

  const {
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
  } = useGameState(puzzle, handleWin, showTutorial || showLearnShapes);

  useEffect(() => {
    const handleOpenWorldRank = () => setShowWorldRank(true);
    window.addEventListener('open-world-rank', handleOpenWorldRank);
    return () => window.removeEventListener('open-world-rank', handleOpenWorldRank);
  }, []);

  const handleSaveProfile = async (displayName: string) => {
    setUpdatingProfile(true);
    try {
      await updateDisplayName(displayName);
    } finally {
      setUpdatingProfile(false);
    }
  };

  // 1. First, check authentication status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-linkedin-bg)]">
         <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[var(--color-linkedin-blue)] rounded-full animate-spin"></div>
            <p className="text-[var(--color-linkedin-text-muted)] font-medium">
              Checking authentication...
            </p>
         </div>
      </div>
    );
  }

  // 2. If not authenticated and not a guest, show login screen immediately
  if (!user && !isGuest) {
    return (
      <LoginScreen 
        onGuest={() => {
          setIsGuest(true);
          sessionStorage.setItem('patch_extreme_guest', 'true');
        }} 
      />
    );
  }

  // 3. Now that we are authorized (User or Guest), check if puzzle is still loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-linkedin-bg)]">
         <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[var(--color-linkedin-blue)] rounded-full animate-spin"></div>
            <p className="text-[var(--color-linkedin-text-muted)] font-medium">
              Generating logic grid...
            </p>
         </div>
      </div>
    );
  }

  // 4. Handle errors if the puzzle failed to load
  if (error || !puzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-linkedin-bg)] p-4 text-center">
        <div className="bg-white p-6 rounded shadow border border-[var(--color-linkedin-border)] max-w-sm">
           <p className="text-red-600 font-bold mb-2">Error</p>
           <p className="text-[var(--color-linkedin-text-muted)] text-sm">{error || 'Could not load puzzle'}</p>
        </div>
      </div>
    );
  }

  const hintCooldownActive = Date.now() - lastHintTime < 25000 && lastHintTime !== 0;
  const hintSecondsLeft = Math.ceil((25000 - (Date.now() - lastHintTime)) / 1000);

  const mins = Math.floor(timeLapsed / 60);
  const secs = timeLapsed % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  // Show profile modal if logged in but no display name set
  const needsProfile = !!user && (!profile || !profile.display_name);

  return (
    <div className="min-h-screen bg-[var(--color-linkedin-bg)] flex flex-col font-sans">
      <TopBar 
         streak={streak} 
         dateStr={puzzle.date} 
         timeLapsed={timeLapsed} 
         solved={solved}
         onReset={resetGame}
         onSignInRequest={() => {
           setIsGuest(false);
           sessionStorage.removeItem('patch_extreme_guest');
         }}
         onLeaderboard={() => setShowLeaderboard(true)}
         onEditProfile={() => setShowEditProfile(true)}
         onViewMyProfile={() => {
            if (user) setViewProfileId(user.id);
         }}
      />
      
      <main className="flex-1 flex flex-col items-center py-6 px-4 md:py-12 relative overflow-y-auto w-full">
         <div className="w-full max-w-lg transform transition-all">
            <div className="flex justify-between items-center mb-5 transition-all px-1">
               <div className="bg-white border border-[var(--color-linkedin-border)] rounded-full px-4 py-1.5 text-sm md:text-base font-mono text-[var(--color-linkedin-text)] shadow-sm font-semibold flex items-center gap-2">
                 <ClockIcon /> {timeStr}
               </div>
               <button 
                  onClick={resetGame}
                  className="bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold px-4 py-1.5 rounded-full shadow-sm transition-all text-xs md:text-sm active:scale-95 flex items-center gap-1.5"
               >
                  <ResetIcon /> Reset Board
               </button>
            </div>

            <Grid 
               pieces={puzzle.pieces}
               drafts={drafts}
               lockedPieces={lockedPieces}
               onPaint={onPaint}
               onResetShape={onResetShape}
               onStrokeStart={pushHistory}
               onStrokeEnd={() => {}} 
            />

            <div className="mt-8 flex flex-col items-center select-none w-full border-t border-[var(--color-linkedin-border)] pt-6">
               <div className="flex justify-center w-full gap-3 sm:gap-6">
                  <button 
                     onClick={undo} 
                     disabled={history.length === 0 || solved} 
                     className="flex-1 max-w-[160px] py-2.5 bg-white border border-[var(--color-linkedin-border)] text-[var(--color-linkedin-text)] font-semibold rounded-xl shadow-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm flex justify-center items-center gap-1.5"
                  >
                     <UndoIcon /> Undo
                  </button>
                  <button 
                     onClick={applyHint} 
                     disabled={hintCooldownActive || solved} 
                     className="flex-1 max-w-[160px] py-2.5 bg-white border border-[var(--color-linkedin-border)] text-[var(--color-linkedin-blue)] font-bold rounded-xl shadow-sm hover:bg-[var(--color-linkedin-blue)] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm flex justify-center items-center gap-1.5 active:scale-95 hover:border-[var(--color-linkedin-blue)]"
                  >
                     <HintIcon /> Hint {hintCooldownActive && `(${hintSecondsLeft}s)`}
                  </button>
               </div>
               
               <div className="flex flex-col items-center w-full mt-4 gap-3">
                  <button 
                     onClick={() => setShowTutorial(true)}
                     className="w-full max-w-[344px] py-3 bg-white border border-[var(--color-linkedin-border)] text-[var(--color-linkedin-blue)] font-bold rounded-xl shadow-sm hover:bg-blue-50 transition-all text-[15px] flex justify-center items-center gap-2 active:scale-95 hover:border-blue-200"
                  >
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                     Replay Tutorial
                  </button>
                  <button 
                     onClick={() => setShowLearnShapes(true)} 
                     className="w-full max-w-[344px] py-3 bg-white border border-[var(--color-linkedin-border)] text-teal-700 font-bold rounded-xl shadow-sm hover:bg-teal-50 transition-all text-[15px] flex justify-center items-center gap-2 active:scale-95 hover:border-teal-200"
                  >
                     <ShapesIcon /> Learn the shapes
                  </button>
               </div>
            </div>

            <div className="mt-10 bg-white p-5 sm:p-6 rounded-xl border border-[var(--color-linkedin-border)] shadow-sm">
               <h3 className="font-bold text-lg mb-4 text-[var(--color-linkedin-text)] flex items-center gap-2 text-indigo-950 border-b border-gray-100 pb-3"><BookIcon /> How to Play</h3>
               <ul className="list-decimal pl-5 text-[14px] leading-relaxed space-y-3 text-[var(--color-linkedin-text-muted)] font-medium">
                  <li><strong className="text-[var(--color-linkedin-text)] block mb-0.5">Paint Blocks:</strong> Click and drag starting from an anchor clue cell (e.g. 'L 2x3') to paint contiguous blocks.</li>
                  <li><strong className="text-[var(--color-linkedin-text)] block mb-0.5">Multi-stroke Branching:</strong> You can release the mouse and drag again from your pre-painted cells to freely construct complex shapes.</li>
                  <li><strong className="text-[var(--color-linkedin-text)] block mb-0.5">Fixing Mistakes:</strong> Just click securely on an already drawn anchor to instantly clear and reset that specific shape!</li>
                  <li><strong className="text-[var(--color-linkedin-text)] block mb-0.5">Solutions & Locking:</strong> Once a painted shape exactly matches its puzzle solution orientation on the board, it will display hatching lines and lock permanently into the grid.</li>
               </ul>
            </div>
         </div>
      </main>

      {showWin && (
         <WinModal 
            dateStr={puzzle.date}
            timeLapsed={timeLapsed}
            moves={moves}
            streak={streak}
            onReset={resetGame}
            onClose={() => setShowWin(false)}
            onLeaderboard={() => setShowLeaderboard(true)}
         />
      )}

      {showLearnShapes && (
         <LearnShapesModal onClose={() => setShowLearnShapes(false)} />
      )}

      {showLeaderboard && puzzle && (
         <LeaderboardModal
           puzzleDate={puzzle.date}
           currentUserId={user?.id}
           onClose={() => setShowLeaderboard(false)}
         />
      )}

      {showEditProfile && profile && (
         <EditProfileModal 
            profile={profile} 
            onSave={updateProfile} 
            onClose={() => setShowEditProfile(false)} 
         />
      )}

      {viewProfileId && (
         <PublicProfileModal 
            userId={viewProfileId} 
            onClose={() => setViewProfileId(null)} 
         />
      )}

      {needsProfile && (
         <ProfileModal 
            onSave={handleSaveProfile} 
            loading={updatingProfile} 
         />
      )}

      {showTutorial && (
        <TutorialModal 
          onClose={() => {
            setShowTutorial(false);
            localStorage.setItem('patch_extreme_tutorial_seen', 'true');
          }} 
        />
      )}

      {showWorldRank && (
        <WorldRankModal 
          currentUserId={user?.id}
          onClose={() => setShowWorldRank(false)}
        />
      )}
    </div>
  );
}

export default App;
