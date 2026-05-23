import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, LogOut, LayoutDashboard, BarChart2, User, Award, ShieldAlert, Sun, Moon, FileText } from 'lucide-react';

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
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Resume Analyzer', path: '/resume-analysis', icon: FileText },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass-card border-b border-brand-border py-4 px-6 md:px-12 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Identity */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <svg 
            className="h-8.5 w-8.5 text-brand-primary group-hover:text-brand-secondary transition-colors duration-300 transform group-hover:scale-105" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M4 12C4 7.58172 7.58172 4 12 4C14.5 4 16.5 5.5 18 7.5M20 12C20 16.4183 16.4183 20 12 20C9.5 20 7.5 18.5 6 16.5" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            <path 
              d="M12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              fill="currentColor" 
              fillOpacity="0.15" 
            />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
          <span className="text-xl font-extrabold font-display tracking-tight text-brand-textMain">
            Intervu<span className="text-brand-primary">Flow</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        {currentUser && (
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 text-sm font-medium tracking-wide transition-colors py-2 px-3 rounded-md ${
                    isActive(link.path)
                      ? 'text-brand-primary bg-brand-primary/10 border border-brand-primary/20'
                      : 'text-brand-textMuted hover:text-brand-textMain hover:bg-brand-border/20'
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
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center h-9 w-9 rounded-lg border border-brand-border bg-transparent text-brand-textMuted hover:text-brand-primary hover:border-brand-primary/30 transition-all"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <Sun className="h-4.5 w-4.5 text-brand-accent animate-pulse-slow" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-brand-primary" />
            )}
          </button>

          {currentUser ? (
            <div className="hidden md:flex items-center gap-4">
              {isMock && (
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider py-1 px-2 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent">
                  <ShieldAlert className="h-3 w-3" />
                  Demo Mode
                </div>
              )}
              <Link 
                to="/profile" 
                className={`flex items-center gap-3 py-1.5 px-3 rounded-lg border transition-all ${
                  isActive('/profile')
                    ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                    : 'border-brand-border bg-transparent dark:bg-brand-bg/50 hover:border-brand-primary/30 hover:bg-brand-primary/5 text-brand-textMain'
                }`}
                title="View Profile Settings"
              >
                <div className="h-7 w-7 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-xs uppercase border border-brand-primary/30">
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
                className="flex items-center justify-center h-9 w-9 rounded-lg border border-brand-border text-brand-textMuted hover:text-brand-danger hover:border-brand-danger/30 hover:bg-brand-danger/10 transition-all"
                title="Logout"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-semibold text-brand-textMuted hover:text-brand-textMain transition-colors">
                Log In
              </Link>
              <Link to="/register" className="glow-btn-primary text-sm font-bold text-white py-2 px-4 rounded-lg">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Navigation Toggle */}
          {currentUser && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-brand-border text-brand-textMuted hover:text-brand-textMain hover:bg-brand-border/30 transition-all"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && currentUser && (
        <div className="md:hidden w-full absolute top-[73px] left-0 right-0 glass-card border-b border-brand-border py-4 px-6 flex flex-col gap-4 animate-fade-in shadow-2xl">
          {isMock && (
            <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest py-1.5 px-3 rounded-md bg-brand-accent/10 border border-brand-accent/20 text-brand-accent w-max">
              <ShieldAlert className="h-4.5 w-4.5" />
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
                className={`flex items-center gap-3 text-base font-medium transition-all py-2.5 px-4 rounded-lg ${
                  isActive(link.path)
                    ? 'text-brand-primary bg-brand-primary/10 border border-brand-primary/20'
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
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border transition-all ${
              isActive('/profile')
                ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                : 'border-brand-border bg-transparent dark:bg-brand-bg/50 hover:border-brand-primary/30 hover:bg-brand-primary/5'
            }`}
          >
            <div className="h-9 w-9 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold uppercase border border-brand-primary/30">
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
            <User className="h-4.5 w-4.5 text-brand-textMuted" />
          </Link>

          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="flex items-center justify-center gap-2 text-sm font-bold text-brand-danger bg-brand-danger/10 border border-brand-danger/20 py-2.5 px-4 rounded-lg hover:bg-brand-danger/25 transition-all mt-1"
          >
            <LogOut className="h-4.5 w-4.5" />
            Logout Account
          </button>
        </div>
      )}
    </nav>
  );
}
