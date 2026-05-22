import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/api';
import { User, Mail, Briefcase, Calendar, Save, CheckCircle2, ShieldAlert, AlertCircle } from 'lucide-react';

export default function Profile() {
  const { currentUser, getIdToken, updateProfileDetails } = useAuth();
  
  const [displayName, setDisplayName] = useState('');
  const [domainPreference, setDomainPreference] = useState('DSA');
  const [profileData, setProfileData] = useState(null);
  
  // Loading & Action states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const token = await getIdToken();
      const data = await getUserProfile(token);
      
      setProfileData(data);
      setDisplayName(data.displayName || '');
      setDomainPreference(data.domainPreference || 'DSA');
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Could not fetch your profile settings from the database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      return setError('Name cannot be empty.');
    }

    try {
      setSaving(true);
      setError('');
      setMessage('');
      
      const token = await getIdToken();
      
      // Update both database and React AuthContext state
      const updated = await updateUserProfile(token, { displayName, domainPreference });
      await updateProfileDetails(displayName, domainPreference);
      
      setProfileData(updated);
      setMessage('Profile settings successfully saved!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Could not save profile updates to the database.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-brand-primary/20 border-t-brand-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 min-h-[calc(100vh-73px)] relative z-10 animate-fade-in">
      
      {/* Background glow spot */}
      <div className="absolute top-1/4 left-1/4 h-80 w-80 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full glass-card rounded-2xl border border-brand-border p-8 md:p-10 shadow-2xl relative">
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-primary via-indigo-400 to-brand-secondary" />

        {/* Profile Title deck */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border/60 pb-6 mb-8 mt-2">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black font-display text-brand-textMain">
                Profile Settings
              </h2>
              <p className="text-xs text-brand-textMuted mt-0.5">
                Update details and set your preferred career domains
              </p>
            </div>
          </div>
          {profileData?.uid === 'mock-user-123' && (
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider py-1.5 px-3 rounded-full bg-brand-accent/15 border border-brand-accent/30 text-brand-accent w-max">
              <ShieldAlert className="h-3.5 w-3.5" />
              Demo Account
            </div>
          )}
        </div>

        {/* Success Banner */}
        {message && (
          <div className="flex items-center gap-2.5 bg-brand-secondary/15 border border-brand-secondary/30 rounded-xl p-4 text-brand-secondary text-sm mb-6 animate-fade-in font-semibold">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="flex items-start gap-2.5 bg-brand-danger/10 border border-brand-danger/20 rounded-xl p-4 text-brand-danger text-sm mb-6 animate-fade-in font-semibold">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main settings options */}
          <div className="md:col-span-2 flex flex-col gap-6">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-textMuted">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-textMuted" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl glass-input font-medium text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-textMuted">
                Target Interview Domain
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-textMuted" />
                <select
                  value={domainPreference}
                  onChange={(e) => setDomainPreference(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl glass-input appearance-none bg-brand-card font-semibold text-sm cursor-pointer"
                >
                  <option value="DSA">Data Structures & Algorithms</option>
                  <option value="System Design">System Design</option>
                  <option value="Frontend">Frontend Development</option>
                  <option value="Backend">Backend Development</option>
                  <option value="Behavioural">Behavioural & Leadership</option>
                  <option value="HR">HR & Cultural Alignment</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="glow-btn-primary flex items-center justify-center gap-2 text-white font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-md w-full md:w-max md:px-8 mt-4"
            >
              {saving ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="h-4.5 w-4.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>

          </div>

          {/* User detail specs panel */}
          <div className="glass-card rounded-2xl border border-brand-border p-6 shadow-md flex flex-col gap-5 h-max bg-brand-border/5">
            <h3 className="text-sm uppercase font-black tracking-widest text-brand-textMuted">
              Account Specs
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Mail className="h-4.5 w-4.5 text-brand-primary shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-brand-textMuted">Email Address</span>
                  <span className="text-xs font-semibold text-brand-textMain mt-0.5 break-all">
                    {profileData?.email}
                  </span>
                </div>
              </div>

              {profileData?.createdAt && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-4.5 w-4.5 text-brand-secondary shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-textMuted">Member Since</span>
                    <span className="text-xs font-semibold text-brand-textMain mt-0.5">
                      {new Date(profileData.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
