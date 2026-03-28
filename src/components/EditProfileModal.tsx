import React, { useState } from 'react';
import type { Profile } from '../hooks/useAuth';

interface EditProfileModalProps {
  profile: Profile;
  onSave: (fields: { linkedin_url?: string | null; github_url?: string | null; portfolio_url?: string | null; country_code?: string | null }) => Promise<void>;
  onClose: () => void;
}

const COMMON_COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'IN', name: 'India' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'BR', name: 'Brazil' },
  { code: 'JP', name: 'Japan' },
  { code: 'AE', name: 'UAE' },
  { code: 'SG', name: 'Singapore' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'PH', name: 'Philippines' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
];

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#0A66C2]">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-800">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-600">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

export function EditProfileModal({ profile, onSave, onClose }: EditProfileModalProps) {
  const [linkedin, setLinkedin] = useState(profile.linkedin_url ?? '');
  const [github, setGithub] = useState(profile.github_url ?? '');
  const [portfolio, setPortfolio] = useState(profile.portfolio_url ?? '');
  const [country, setCountry] = useState(profile.country_code ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({
        linkedin_url: linkedin.trim() || null,
        github_url: github.trim() || null,
        portfolio_url: portfolio.trim() || null,
        country_code: country.trim() || null,
      });
      onClose();
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-300 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Edit Profile</h2>
              <p className="text-sm text-gray-500 mt-0.5">Add your social links (all optional)</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Display name (read-only here since it's set via the profile modal) */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0A66C2] rounded-lg flex items-center justify-center text-white text-sm font-bold">
              {(profile.display_name ?? 'U')[0].toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Display Name</p>
              <p className="text-sm font-bold text-gray-800">{profile.display_name}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <LinkedInIcon />
              </div>
              <input
                type="url"
                value={linkedin}
                onChange={e => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/yourname"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A66C2]/30 focus:border-[#0A66C2] outline-none text-sm font-medium transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <GitHubIcon />
              </div>
              <input
                type="url"
                value={github}
                onChange={e => setGithub(e.target.value)}
                placeholder="https://github.com/yourname"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-300 focus:border-gray-400 outline-none text-sm font-medium transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <GlobeIcon />
              </div>
              <input
                type="url"
                value={portfolio}
                onChange={e => setPortfolio(e.target.value)}
                placeholder="https://yourportfolio.dev"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-200 focus:border-violet-400 outline-none text-sm font-medium transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Country</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  {country ? (
                    <img
                      src={`https://flagcdn.com/20x15/${country.toLowerCase()}.png`}
                      width="20"
                      height="15"
                      alt={country}
                      className="rounded-[2px]"
                    />
                  ) : (
                    <span className="text-lg">🌍</span>
                  )}
                </div>
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-[#0A66C2] outline-none text-sm font-bold transition-all appearance-none"
                >
                  <option value="">Select a country...</option>
                  {COMMON_COUNTRIES.filter(c => c.code !== country).concat(COMMON_COUNTRIES.find(c => c.code === country) ? [] : [{ code: country, name: country }]).filter(c => c.code).sort((a,b) => a.name.localeCompare(b.name)).map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                  <option value="--">Other / Custom code...</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
              {country === '--' && (
                <input
                  type="text"
                  placeholder="Enter 2-letter ISO code (e.g. BR, JP)"
                  maxLength={2}
                  className="w-full mt-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono uppercase focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  onBlur={e => {
                    const val = e.target.value.toUpperCase();
                    if (val.length === 2) setCountry(val);
                  }}
                />
              )}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-[#0A66C2] text-white font-bold hover:bg-[#004182] disabled:opacity-60 transition-all flex items-center justify-center"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
