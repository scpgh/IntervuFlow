import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAnalytics } from '../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart2, Award, Calendar, RefreshCw, AlertTriangle, Lightbulb } from 'lucide-react';

export default function Analytics() {
  const { getIdToken } = useAuth();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');
      const token = await getIdToken();
      const analyticsData = await getAnalytics(token);
      setData(analyticsData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Could not retrieve performance records from the database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  // Custom tooltips matching our glass-card aesthetics
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card border border-brand-border p-3.5 rounded-xl shadow-xl backdrop-blur-md">
          <p className="text-xs font-bold text-brand-textMuted mb-1">{label}</p>
          <p className="text-sm font-extrabold text-brand-primary">
            Score: <span className="text-brand-textMain">{payload[0].value.toFixed(1)} / 10</span>
          </p>
          {payload[0].payload.domain && (
            <p className="text-[10px] uppercase tracking-wider font-bold text-brand-textMuted mt-0.5">
              Domain: {payload[0].payload.domain}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const getDomainAdvisory = () => {
    if (!data?.domainAverages || data.domainAverages.length === 0) return null;
    
    const sorted = [...data.domainAverages].sort((a,b) => a.averageScore - b.averageScore);
    const weakest = sorted[0];
    const strongest = sorted[sorted.length - 1];

    return {
      weakest: weakest.domain,
      strongest: strongest.domain,
      delta: (strongest.averageScore - weakest.averageScore).toFixed(1)
    };
  };

  const advisory = getDomainAdvisory();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-brand-primary/20 border-t-brand-primary animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 glass-card border border-brand-danger/20 rounded-2xl text-center animate-slide-up">
        <AlertTriangle className="h-12 w-12 text-brand-danger mx-auto mb-4" />
        <h3 className="text-lg font-bold text-brand-textMain">Analytics Offline</h3>
        <p className="text-xs text-brand-textMuted mt-2 mb-6">{error || 'Session failed to compile'}</p>
        <button onClick={fetchAnalyticsData} className="glow-btn-primary text-white font-bold py-2.5 px-6 rounded-lg text-sm">
          Try Reloading
        </button>
      </div>
    );
  }

  // Graceful state check for empty logs
  const isHistoryEmpty = !data.scoreHistory || data.scoreHistory.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 min-h-[calc(100vh-73px)] relative z-10 animate-fade-in">
      
      {/* Background glowing particles */}
      <div className="absolute top-1/4 right-1/4 h-80 w-80 bg-brand-secondary/5 rounded-full blur-[110px] pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-brand-border pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-brand-textMain tracking-tight">
            Performance Board
          </h1>
          <p className="text-sm text-brand-textMuted mt-1">
            Analyze your progress curves and identify core areas to optimize
          </p>
        </div>
        <button
          onClick={fetchAnalyticsData}
          className="flex items-center gap-2 border border-brand-border hover:border-brand-borderHover text-brand-textMuted hover:text-brand-textMain px-4 py-2 rounded-xl text-sm transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Sync Board</span>
        </button>
      </div>

      {isHistoryEmpty ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-brand-border flex flex-col items-center justify-center max-w-xl mx-auto mt-10">
          <BarChart2 className="h-12 w-12 text-brand-textMuted mb-4" />
          <h3 className="text-lg font-bold text-brand-textMain">No analytics data recorded</h3>
          <p className="text-xs text-brand-textMuted mt-2 max-w-xs leading-relaxed">
            Practice history is currently empty. Complete at least one mock interview practice session to unlock analytical statistics.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          
          {/* Top Performance Stat Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 flex items-center gap-5 border border-brand-border">
              <div className="h-12 w-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-wider text-brand-textMuted">Sessions Evaluated</span>
                <span className="text-2xl font-black font-display text-brand-textMain mt-1">
                  {data.totalSessions}
                </span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 flex items-center gap-5 border border-brand-border">
              <div className="h-12 w-12 rounded-xl bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center text-brand-secondary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-wider text-brand-textMuted">Overall Average Rating</span>
                <span className="text-2xl font-black font-display text-brand-textMain mt-1">
                  {data.overallAverage} <span className="text-xs text-brand-textMuted font-medium">/ 10</span>
                </span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 flex items-center gap-5 border border-brand-border">
              <div className="h-12 w-12 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                <Award className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-wider text-brand-textMuted">Peak Practice Score</span>
                <span className="text-2xl font-black font-display text-brand-textMain mt-1">
                  {data.bestScore} <span className="text-xs text-brand-textMuted font-medium">/ 10</span>
                </span>
              </div>
            </div>
          </div>

          {/* Core Visualizer Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Chart 1: Line timeline score history */}
            <div className="glass-card rounded-2xl border border-brand-border p-6 shadow-md flex flex-col gap-4">
              <div>
                <h3 className="text-base font-bold font-display text-brand-textMain">Score Timeline Progress</h3>
                <p className="text-xs text-brand-textMuted mt-0.5">Rating scores over your last 10 practice sessions</p>
              </div>

              <div className="h-72 w-full mt-2 select-none">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.scoreHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9ca3af" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#9ca3af" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      domain={[0, 10]} 
                      ticks={[0, 2, 4, 6, 8, 10]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#4a7c5c" 
                      strokeWidth={3} 
                      activeDot={{ r: 6, fill: '#4a7c5c', stroke: '#09090b', strokeWidth: 2 }}
                      dot={{ r: 3.5, fill: '#09090b', stroke: '#4a7c5c', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Bar domain ratings comparison */}
            <div className="glass-card rounded-2xl border border-brand-border p-6 shadow-md flex flex-col gap-4">
              <div>
                <h3 className="text-base font-bold font-display text-brand-textMain">Average Rating Per Domain</h3>
                <p className="text-xs text-brand-textMuted mt-0.5">Comparative strength breakdown by topics</p>
              </div>

              <div className="h-72 w-full mt-2 select-none">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.domainAverages} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4a7c5c" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#4a7c5c" stopOpacity={0.15} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" />
                    <XAxis 
                      dataKey="domain" 
                      stroke="#9ca3af" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#9ca3af" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                      domain={[0, 10]}
                      ticks={[0, 2, 4, 6, 8, 10]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="averageScore" 
                      fill="url(#barGradient)" 
                      radius={[6, 6, 0, 0]}
                      maxBarSize={45}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* AI Advisory Panel */}
          {advisory && (
            <div className="glass-card rounded-2xl border border-brand-border p-6 shadow-md flex items-start gap-4 bg-gradient-to-tr from-brand-card to-emerald-950/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-brand-secondary" />
              <div className="h-10 w-10 rounded-xl bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center text-brand-secondary shrink-0">
                <Lightbulb className="h-5.5 w-5.5 animate-bounce" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black font-display text-brand-textMain">AI Career Coaching insights</h4>
                <p className="text-xs text-brand-textMuted mt-1 leading-relaxed max-w-4xl font-semibold">
                  You are performing exceptionally well in <strong className="text-brand-textMain font-bold">{advisory.strongest}</strong>! However, there is a performance gap of <strong className="text-brand-secondary font-extrabold">{advisory.delta} points</strong> compared to your skills in <strong className="text-brand-accent font-bold">{advisory.weakest}</strong>. We recommend configuring a few <strong className="text-brand-textMain font-bold">Medium or Hard mock sessions in {advisory.weakest}</strong> to level up before your next live tech round.
                </p>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
