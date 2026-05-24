import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, LogOut, LayoutDashboard, BarChart2, User, ShieldAlert, Sun, Moon, FileText, Sparkles, LogIn } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout, isMock } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err.message);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Analyzer', path: '/resume-analysis', icon: FileText },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-brand-border/70 bg-brand-bgLight/75 px-4 py-3 backdrop-blur-2xl dark:bg-brand-bg/72 md:px-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Identity */}
        <Link to="/" className="group flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-primary/25 bg-black/5 text-brand-primary shadow-glow-primary transition-all duration-300 group-hover:scale-105 dark:bg-white/5">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-2xl font-bold text-brand-textMain">
              Intervu<span className="text-brand-primary">Flow</span>
            </span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.28em] text-brand-textMuted">
              Interview Intelligence
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        {currentUser && (
          <div className="hidden items-center gap-1 rounded-full border border-brand-border bg-white/45 p-1 shadow-glass backdrop-blur-xl dark:bg-white/5 md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    isActive(link.path)
                      ? 'border border-brand-primary/20 bg-brand-primary text-black shadow-glow-primary'
                      : 'text-brand-textMuted hover:bg-brand-primary/10 hover:text-brand-textMain'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}

        {/* User Actions & Toggle Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-border bg-black/5 text-brand-textMuted transition-all hover:border-brand-primary/35 hover:text-brand-primary dark:bg-white/5"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-brand-accent animate-pulse-slow" />
            ) : (
              <Moon className="h-5 w-5 text-brand-primary" />
            )}
          </button>

          {currentUser ? (
            <div className="hidden items-center gap-3 md:flex">
              {isMock && (
                <div className="flex items-center gap-1 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-primary">
                  <ShieldAlert className="h-3 w-3" />
                  Demo Mode
                </div>
              )}
              <Link 
                to="/profile" 
                className={`flex items-center gap-3 rounded-full border py-1.5 pl-2 pr-4 transition-all ${
                  isActive('/profile')
                    ? 'border-brand-primary/35 bg-brand-primary/10 text-brand-primary'
                    : 'border-brand-border bg-black/5 text-brand-textMain hover:border-brand-primary/30 hover:bg-brand-primary/5 dark:bg-white/5'
                }`}
                title="View Profile Settings"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-primary/30 bg-brand-primary/15 text-xs font-bold uppercase text-brand-primary">
                  {currentUser.displayName ? currentUser.displayName.charAt(0) : 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold">
                    {currentUser.displayName || 'Developer'}
                  </span>
                  <span className="text-[10px] text-brand-textMuted leading-none">
                    {currentUser.email}
                  </span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-border text-brand-textMuted transition-all hover:border-brand-danger/30 hover:bg-brand-danger/10 hover:text-brand-danger"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 md:flex">
              <Link to="/login" className="flex items-center gap-2 rounded-full border border-brand-border bg-black/5 px-5 py-2.5 text-sm font-semibold text-brand-textMain transition-all hover:border-brand-primary/30 hover:bg-brand-primary/10 dark:bg-white/5">
                <LogIn className="h-4 w-4" />
                Sign in
              </Link>
              <Link to="/register" className="glow-btn-primary rounded-full px-5 py-2.5 text-sm font-bold">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Navigation Toggle */}
          {currentUser ? (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-border text-brand-textMuted transition-all hover:bg-brand-primary/10 hover:text-brand-textMain md:hidden"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          ) : (
            <Link to="/register" className="glow-btn-primary rounded-full px-4 py-2.5 text-xs font-bold md:hidden">
              Start
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && currentUser && (
        <div className="glass-card absolute left-0 right-0 top-[73px] flex w-full animate-fade-in flex-col gap-4 border-b border-brand-border px-6 py-4 shadow-2xl md:hidden">
          {isMock && (
            <div className="flex w-max items-center gap-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">
              <ShieldAlert className="h-5 w-5" />
              Developer Demo Mode
            </div>
          )}
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-base font-medium transition-all ${
                  isActive(link.path)
                    ? 'border border-brand-primary/20 bg-brand-primary/10 text-brand-primary'
                    : 'text-brand-textMuted hover:text-brand-textMain hover:bg-brand-border/30'
                }`}
              >
                <Icon className="h-5 w-5" />
                {link.name}
              </Link>
            );
          })}
          
          <div className="h-px bg-brand-border my-1" />
          
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 transition-all ${
              isActive('/profile')
                ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                : 'border-brand-border bg-transparent dark:bg-brand-bg/50 hover:border-brand-primary/30 hover:bg-brand-primary/5'
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-primary/30 bg-brand-primary/20 font-bold uppercase text-brand-primary">
              {currentUser.displayName ? currentUser.displayName.charAt(0) : 'U'}
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-semibold text-brand-textMain">
                {currentUser.displayName || 'Developer'}
              </span>
              <span className="text-xs text-brand-textMuted leading-none mt-0.5">
                {currentUser.email}
              </span>
            </div>
            <User className="h-5 w-5 text-brand-textMuted" />
          </Link>

          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="mt-1 flex items-center justify-center gap-2 rounded-xl border border-brand-danger/20 bg-brand-danger/10 px-4 py-2.5 text-sm font-bold text-brand-danger transition-all hover:bg-brand-danger/25"
          >
            <LogOut className="h-5 w-5" />
            Logout Account
          </button>
        </div>
      )}
    </nav>
  );
}
