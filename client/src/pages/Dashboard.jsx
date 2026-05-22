import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSessions, getAnalytics } from '../services/api';
import { Play, Calendar, Star, Compass, Award, BarChart3, ChevronRight, RefreshCw, AlertCircle, History } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, getIdToken } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = await getIdToken();
      
      const [sessionsData, analyticsData] = await Promise.all([
        getSessions(token),
        getAnalytics(token)
      ]);
      
      setSessions(sessionsData);
      setStats(analyticsData);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Could not connect to the backend server. Please verify the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getScoreBadge = (score) => {
    if (score >= 7.5) return 'text-brand-secondary bg-brand-secondary/10 border-brand-secondary/20';
    if (score >= 5.0) return 'text-brand-accent bg-brand-accent/10 border-brand-accent/20';
    return 'text-brand-danger bg-brand-danger/10 border-brand-danger/20';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 min-h-[calc(100vh-73px)] relative z-10 animate-fade-in">
      
      {/* Background radial accent glow */}
      <div className="absolute top-0 right-10 h-96 w-96 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-brand-textMain tracking-tight">
            Console
          </h1>
          <p className="text-sm text-brand-textMuted mt-1">
            Welcome back, <span className="text-brand-primary font-semibold">{currentUser?.displayName || 'Developer'}</span>! Track your metrics and start practicing.
          </p>
        </div>
        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="flex items-center gap-2 border border-brand-border hover:border-brand-borderHover text-brand-textMuted hover:text-brand-textMain px-4 py-2 rounded-xl text-sm transition-all"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Console</span>
        </button>
      </div>

      {/* Backend connection error notification */}
      {error && (
        <div className="flex items-start gap-3 bg-brand-danger/10 border border-brand-danger/20 rounded-xl p-5 text-brand-danger text-sm mb-8">
          <AlertCircle className="h-5.5 w-5.5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-base mb-1">Server Connection Offline</h4>
            <p className="text-brand-textMuted leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {loading ? (
          // Skeleton loaders
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-28 rounded-xl glass-card border border-brand-border animate-pulse p-6">
              <div className="h-4 bg-brand-border/40 rounded w-1/3 mb-4" />
              <div className="h-8 bg-brand-border/40 rounded w-1/2" />
            </div>
          ))
        ) : (
          <>
            <div className="glass-card-interactive rounded-xl p-6 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-brand-textMuted">Average Rating</span>
                <h3 className="text-3xl font-black font-display text-brand-textMain mt-1">
                  {stats ? (stats.overallAverage > 0 ? `${stats.overallAverage}/10` : 'N/A') : 'N/A'}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shadow-glow-primary">
                <Star className="h-6 w-6 fill-brand-primary/20" />
              </div>
            </div>

            <div className="glass-card-interactive rounded-xl p-6 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-brand-textMuted">Completed Sessions</span>
                <h3 className="text-3xl font-black font-display text-brand-textMain mt-1">
                  {stats?.totalSessions || 0}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center text-brand-secondary shadow-glow-secondary">
                <BarChart3 className="h-6 w-6" />
              </div>
            </div>

            <div className="glass-card-interactive rounded-xl p-6 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-brand-textMuted">Single Best Rating</span>
                <h3 className="text-3xl font-black font-display text-brand-textMain mt-1">
                  {stats ? (stats.bestScore > 0 ? `${stats.bestScore}/10` : 'N/A') : 'N/A'}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                <Award className="h-6 w-6" />
              </div>
            </div>

            <div className="glass-card-interactive rounded-xl p-6 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-brand-textMuted">Strongest Field</span>
                <h3 className="text-lg font-black font-display text-brand-textMain mt-2.5 truncate max-w-[150px]">
                  {stats?.domainAverages && stats.domainAverages.length > 0 
                    ? [...stats.domainAverages].sort((a,b) => b.averageScore - a.averageScore)[0].domain
                    : 'N/A'}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center text-brand-secondary">
                <Compass className="h-6 w-6" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Panel grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Session Log */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center gap-2.5 border-b border-brand-border pb-4">
            <History className="h-5.5 w-5.5 text-brand-primary" />
            <h2 className="text-xl font-bold font-display text-brand-textMain">
              Recent Practice History
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col gap-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-brand-card/40 border border-brand-border/40 animate-pulse" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center flex flex-col items-center justify-center border border-brand-border">
              <Calendar className="h-10 w-10 text-brand-textMuted mb-3" />
              <h4 className="text-base font-bold text-brand-textMain">No sessions recorded yet</h4>
              <p className="text-xs text-brand-textMuted mt-1 mb-5">Start an AI mock session to begin tracking performance stats.</p>
              <Link to="/setup" className="glow-btn-primary flex items-center gap-2 text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-md">
                <Play className="h-4 w-4 fill-white" />
                <span>Launch First Mock Session</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {sessions.slice(0, 5).map((session) => (
                <div 
                  key={session.id} 
                  className="glass-card rounded-xl p-5 flex items-center justify-between border border-brand-border hover:border-brand-borderHover transition-all cursor-pointer group"
                  onClick={() => navigate(session.status === 'completed' ? `/feedback/${session.id}` : `/interview/${session.id}`)}
                >
                  <div className="flex items-center gap-4">
                    {/* Domain Initial Tag */}
                    <div className="h-11 w-11 rounded-lg bg-brand-border/30 border border-brand-border/60 flex items-center justify-center text-brand-textMain font-black text-xs font-display">
                      {session.domain ? session.domain.split(' ').map(w => w.charAt(0)).join('').substring(0, 2).toUpperCase() : 'AI'}
                    </div>
                    
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-brand-textMain group-hover:text-brand-primary transition-colors">
                          {session.domain}
                        </span>
                        <span className="text-[10px] tracking-wider uppercase font-extrabold px-1.5 py-0.5 rounded-md bg-brand-border/50 text-brand-textMuted border border-brand-border">
                          {session.difficulty}
                        </span>
                      </div>
                      
                      <span className="text-xs text-brand-textMuted mt-1">
                        {session.completedAt ? new Date(session.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'In Progress'}
                      </span>
                    </div>
                  </div>

                  {/* Score badge / status */}
                  <div className="flex items-center gap-3">
                    {session.status === 'completed' ? (
                      <span className={`text-sm font-extrabold px-2.5 py-1 rounded-lg border ${getScoreBadge(session.overallScore)}`}>
                        {session.overallScore.toFixed(1)} / 10
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-brand-accent bg-brand-accent/10 border border-brand-accent/20 px-2.5 py-1 rounded-lg animate-pulse">
                        In Progress
                      </span>
                    )}
                    <ChevronRight className="h-4.5 w-4.5 text-brand-textMuted group-hover:text-brand-textMain transition-colors" />
                  </div>

                </div>
              ))}
              
              {sessions.length > 5 && (
                <Link to="/analytics" className="text-sm font-bold text-brand-primary hover:text-brand-primaryHover flex items-center gap-1 mt-2 w-max self-end group">
                  <span>View All Sessions</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Call to action & domain panel */}
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-2xl border border-brand-border p-6 shadow-xl relative overflow-hidden bg-gradient-to-br from-brand-card to-emerald-950/20">
            {/* Glowing top line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary" />
            
            <h3 className="text-lg font-bold font-display text-brand-textMain">
              Practice Station
            </h3>
            <p className="text-xs text-brand-textMuted mt-1.5 leading-relaxed">
              Launch an AI-guided simulation session tailored to your engineering or behavioral domain. Practice structured response strategies to wow real-world hiring managers.
            </p>

            <button
              onClick={() => navigate('/setup')}
              className="w-full glow-btn-primary flex items-center justify-center gap-2 text-white font-bold text-sm py-3 rounded-xl mt-6 transition-all"
            >
              <Play className="h-4.5 w-4.5 fill-white" />
              <span>Launch Mock Interview</span>
            </button>
          </div>

          {/* Quick Domain Guides */}
          <div className="glass-card rounded-2xl border border-brand-border p-6 shadow-md">
            <h4 className="text-sm uppercase font-bold tracking-widest text-brand-textMuted mb-4">
              Supported Domains
            </h4>
            
            <div className="grid grid-cols-2 gap-2 text-center">
              {['DSA', 'System Design', 'Frontend', 'Backend', 'Behavioural', 'HR'].map((dom) => (
                <div 
                  key={dom}
                  className="py-2.5 px-2 rounded-xl bg-brand-border/10 border border-brand-border/40 text-xs font-semibold text-brand-textMain hover:border-brand-primary/30 transition-colors"
                >
                  {dom}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
