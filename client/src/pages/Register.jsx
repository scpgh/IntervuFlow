import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Briefcase, Chrome, AlertCircle, ArrowRight, UserPlus } from 'lucide-react';

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [domainPreference, setDomainPreference] = useState('DSA');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return setError('Please fill out all fields.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    try {
      setError('');
      setLoading(true);
      await register(name, email, password, domainPreference);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      console.error('Google Sign-in error:', err);
      setError('Google Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] flex items-center justify-center px-4 py-12 select-none overflow-hidden">
      
      {/* Background glowing particles */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 bg-brand-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md glass-card rounded-2xl border border-brand-border p-8 md:p-10 shadow-2xl relative z-10 animate-slide-up">
        
        {/* Title Deck */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold font-display text-brand-textMain tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-brand-textMuted mt-2">
            Unlock AI-powered interview coaching
          </p>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="flex items-start gap-2.5 bg-brand-danger/10 border border-brand-danger/20 rounded-xl p-4 text-brand-danger text-sm mb-6 animate-fade-in">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-textMuted" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-textMuted" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-textMuted" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-brand-textMuted uppercase tracking-wider">
              Focus Career Domain
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-textMuted" />
              <select
                value={domainPreference}
                onChange={(e) => setDomainPreference(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass-input appearance-none bg-brand-card"
              >
                <option value="DSA">Data Structures & Algorithms</option>
                <option value="System Design">System Design</option>
                <option value="Frontend">Frontend Development</option>
                <option value="Backend">Backend Development</option>
                <option value="Behavioural">Behavioural & Leadership</option>
                <option value="HR">Human Resources & Culture</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glow-btn-primary flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl mt-2 transition-all"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign Up</span>
                <UserPlus className="h-4.5 w-4.5" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-5">
          <div className="h-px bg-brand-border flex-1" />
          <span className="text-xs text-brand-textMuted uppercase font-bold tracking-wider">Or</span>
          <div className="h-px bg-brand-border flex-1" />
        </div>

        {/* SSO Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-brand-border hover:border-brand-borderHover hover:bg-brand-border/10 rounded-xl py-3 text-sm font-semibold transition-all"
        >
          <Chrome className="h-5 w-5 text-red-500 fill-red-500" />
          <span>Register with Google</span>
        </button>

        {/* Login Link */}
        <div className="text-center mt-6">
          <span className="text-sm text-brand-textMuted">Already have an account? </span>
          <Link to="/login" className="text-sm font-bold text-brand-primary hover:text-brand-primaryHover flex items-center justify-center gap-1 mt-1.5 group w-max mx-auto">
            <span>Access Your Dashboard</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
