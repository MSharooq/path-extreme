import React, { useState } from 'react';

interface ProfileModalProps {
  onSave: (displayName: string) => Promise<void>;
  loading?: boolean;
}

export function ProfileModal({ onSave, loading }: ProfileModalProps) {
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (displayName.length < 3 || displayName.length > 20) {
      setError('Display name must be between 3 and 20 characters.');
      return;
    }

    try {
      await onSave(displayName);
    } catch (err: any) {
      if (err.message && err.message.includes('unique')) {
        setError('This display name is already taken. Please try another one.');
      } else {
        setError('Failed to update display name. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-[var(--color-linkedin-blue)] rounded-xl text-white flex items-center justify-center font-bold text-3xl mb-4 shadow-lg">
              in
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-linkedin-text)] text-center">Welcome to PatchExtreme!</h2>
            <p className="text-[var(--color-linkedin-text-muted)] text-center mt-2 leading-relaxed">
              Before you start competing on the leaderboard, please choose a unique display name.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label 
                htmlFor="display-name" 
                className="block text-sm font-bold text-[var(--color-linkedin-text)] ml-1"
              >
                Choose your display name
              </label>
              <input
                id="display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ex. PuzzleMaster"
                className="w-full px-4 py-3 bg-gray-50 border border-[var(--color-linkedin-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-linkedin-blue)] focus:border-transparent transition-all outline-none font-medium"
                disabled={loading}
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-sm font-semibold ml-1 animate-in slide-in-from-top-1">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !displayName.trim()}
              className="w-full bg-[var(--color-linkedin-blue)] text-white font-bold py-3.5 rounded-xl shadow-lg hover:bg-[#004182] transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden active:scale-95"
            >
              <span className={loading ? 'opacity-0' : 'opacity-100 transition-opacity'}>
                Set Display Name
              </span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </form>
          
          <p className="text-center text-[11px] text-[var(--color-linkedin-text-muted)] mt-6 font-medium">
            By choosing a display name, you agree to our terms of service and leaderboard guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
