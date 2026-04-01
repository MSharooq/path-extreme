import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" className="mr-3">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

interface LoginScreenProps {
  onGuest: () => void;
}

export function LoginScreen({ onGuest }: LoginScreenProps) {
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setError(null);
    try {
      await signInWithEmail(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send login link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-start items-center min-h-[100dvh] p-4 py-8 sm:p-6 bg-[#f3f2f0] overflow-y-auto">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md my-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-500 animate-in fade-in zoom-in-95 duration-700">
        {/* Header */}
        <div className="p-8 pb-6 text-center border-b border-gray-50 bg-gradient-to-b from-blue-50/50 to-white">
          <img 
            src="/maskable-icon.png" 
            alt="PatchExtreme Logo" 
            className="w-12 h-12 rounded-lg shadow-md mb-4 mx-auto transition-all"
          />
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Welcome to PatchExtreme</h1>
          <p className="text-gray-500 font-medium mb-8">The daily logic game for strategic thinkers.</p>
        </div>

        <div className="p-8 space-y-6">
          {sent ? (
            <div className="text-center py-6 animate-in slide-in-from-bottom-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email!</h2>
              <p className="text-gray-600 mb-6">We've sent a magic login link to <br/><span className="font-bold text-gray-800">{email}</span></p>
              <button 
                onClick={() => setSent(false)}
                className="text-blue-600 font-bold hover:underline"
              >
                Try a different email
              </button>
            </div>
          ) : (
            <>
              {/* Google Button */}
              <button
                onClick={() => signInWithGoogle()}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 py-3 rounded-full text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm font-bold uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Email Address</label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all font-medium text-gray-800"
                    />
                  </div>
                </div>
                {error && <p className="text-red-500 text-xs font-bold ml-1">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-md active:scale-[0.98] disabled:opacity-70 flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <MailIcon />
                      Send Magic Link
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="pt-6 border-t border-gray-100">
            <button
              onClick={onGuest}
              className="w-full py-3 px-4 bg-white border-2 border-dashed border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
            >
              Play as Guest
            </button>
            <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                  <strong>Guest Disclaimer:</strong> Your name and score won't appear on the global leaderboard, and other players won't be able to discover your profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
