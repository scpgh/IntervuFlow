import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSessionDetails } from '../services/api';
import ScoreGauge from '../components/ScoreGauge';
import { Play, Sparkles, Check, ChevronDown, ChevronUp, ArrowLeft, Award, ThumbsUp, AlertCircle, HelpCircle } from 'lucide-react';

export default function FeedbackDetail() {
  const { id: sessionId } = useParams();
  const { getIdToken } = useAuth();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Collapse/Expand state for each question card
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        setError('');
        const token = await getIdToken();
        const data = await getSessionDetails(token, sessionId);
        
        if (data.status !== 'completed') {
          navigate(`/interview/${sessionId}`, { replace: true });
          return;
        }

        setSession(data);
        
        // Auto-expand the first question card on load
        setExpandedCards({ 0: true });
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError('Failed to retrieve feedback data from the server.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [sessionId]);

  const toggleCard = (index) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getScoreDescription = (score) => {
    if (score >= 8.5) return { label: 'Exceptional Response', color: 'text-brand-secondary' };
    if (score >= 7.0) return { label: 'Strong Response', color: 'text-brand-secondary/80' };
    if (score >= 5.0) return { label: 'Satisfactory Performance', color: 'text-brand-accent' };
    return { label: 'Requires Improvement', color: 'text-brand-danger' };
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-brand-primary/20 border-t-brand-primary animate-spin" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 glass-card border border-brand-danger/20 rounded-2xl text-center">
        <AlertCircle className="h-12 w-12 text-brand-danger mx-auto mb-4" />
        <h3 className="text-lg font-bold text-brand-textMain">Feedback Load Error</h3>
        <p className="text-xs text-brand-textMuted mt-2 mb-6">{error || 'Session failed to load'}</p>
        <button onClick={() => navigate('/')} className="glow-btn-primary text-white font-bold py-2.5 px-6 rounded-lg text-sm">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 min-h-[calc(100vh-73px)] relative z-10 animate-fade-in">
      
      {/* Background glow sparks */}
      <div className="absolute top-10 left-10 h-80 w-80 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation Headers */}
      <div className="flex items-center gap-2 mb-6">
        <Link to="/" className="flex items-center gap-1 text-xs font-bold text-brand-textMuted hover:text-brand-textMain transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
      </div>

      {/* Main Aggregates Banner */}
      <div className="glass-card rounded-2xl border border-brand-border p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 mb-10 shadow-xl relative overflow-hidden bg-gradient-to-br from-brand-card to-emerald-950/15">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary" />

        <div className="shrink-0">
          <ScoreGauge score={session.overallScore} size={150} strokeWidth={10} />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <span className="text-[10px] tracking-widest font-black uppercase py-0.5 px-2 bg-brand-primary/10 border border-brand-primary/20 rounded text-brand-primary">
              {session.domain}
            </span>
            <span className="text-[10px] tracking-widest font-black uppercase py-0.5 px-2 bg-brand-border/40 border border-brand-border rounded text-brand-textMuted">
              {session.difficulty}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-brand-textMain tracking-tight mt-3">
            AI Evaluation Report
          </h1>
          <p className="text-sm text-brand-textMuted mt-1 leading-relaxed max-w-xl">
            Gemini 2.5 Flash has completed a comprehensive analysis of your answers. Below is your detailed structural breakdown, including scoring marks and model correction guides.
          </p>
        </div>

        <div className="shrink-0 flex flex-col gap-2.5 w-full md:w-auto">
          <button
            onClick={() => navigate('/setup')}
            className="glow-btn-primary flex items-center justify-center gap-2 text-white font-bold text-sm py-3 px-6 rounded-xl transition-all shadow-md"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Practice Again</span>
          </button>
        </div>
      </div>

      {/* Feedback Main Details Block */}
      {session.type === 'chat' ? (
        <div className="flex flex-col gap-8">
          
          {/* Executive Summary Card */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-brand-border bg-brand-card/25 shadow-md">
            <h2 className="text-lg font-bold font-display text-brand-textMain mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-primary animate-pulse" />
              <span>AI Coaching Verdict</span>
            </h2>
            <p className="text-sm text-brand-textMuted leading-relaxed font-semibold select-text">
              {session.chatFeedback?.summary || 'Transcript scoring compilation has completed successfully.'}
            </p>
          </div>

          {/* Strengths and Improvements grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strengths */}
            <div className="glass-card p-6 rounded-2xl border border-brand-border flex flex-col gap-4">
              <div className="flex items-center gap-2 text-brand-secondary border-b border-brand-border pb-3">
                <ThumbsUp className="h-5 w-5" />
                <h3 className="text-xs uppercase font-extrabold tracking-wider">Key Communication Strengths</h3>
              </div>
              <ul className="flex flex-col gap-3">
                {session.chatFeedback?.strengths && session.chatFeedback.strengths.length > 0 ? (
                  session.chatFeedback.strengths.map((str, sIdx) => (
                    <li key={sIdx} className="flex gap-2.5 text-xs text-brand-textMuted leading-relaxed font-semibold">
                      <span className="h-4.5 w-4.5 rounded-full bg-brand-secondary/15 flex items-center justify-center text-brand-secondary shrink-0 mt-0.5">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{str}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-brand-textMuted italic">No core strengths logged. Keep communication descriptive!</li>
                )}
              </ul>
            </div>

            {/* Improvements */}
            <div className="glass-card p-6 rounded-2xl border border-brand-border flex flex-col gap-4">
              <div className="flex items-center gap-2 text-brand-accent border-b border-brand-border pb-3">
                <AlertCircle className="h-5 w-5" />
                <h3 className="text-xs uppercase font-extrabold tracking-wider">Targeted Revisions</h3>
              </div>
              <ul className="flex flex-col gap-3">
                {session.chatFeedback?.improvements && session.chatFeedback.improvements.length > 0 ? (
                  session.chatFeedback.improvements.map((imp, iIdx) => (
                    <li key={iIdx} className="flex gap-2.5 text-xs text-brand-textMuted leading-relaxed font-semibold">
                      <span className="h-4.5 w-4.5 rounded-full bg-brand-accent/15 flex items-center justify-center text-brand-accent shrink-0 mt-0.5">
                        <Sparkles className="h-3 w-3" />
                      </span>
                      <span>{imp}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-brand-textMuted italic">No immediate improvements needed. Outstanding answers!</li>
                )}
              </ul>
            </div>

          </div>

          {/* Interactive Collapsible Transcript Viewer */}
          <div className="glass-card rounded-2xl border border-brand-border overflow-hidden">
            <div className="p-5 md:p-6 bg-brand-border/10 border-b border-brand-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-brand-textMain">Conversational Meeting Transcript</h3>
                <p className="text-xs text-brand-textMuted mt-0.5">Review the timeline of questions and your submitted responses.</p>
              </div>
              <span className="text-xs font-black uppercase tracking-wider py-0.5 px-2 bg-brand-secondary/15 border border-brand-secondary/20 rounded text-brand-secondary shrink-0">
                {session.chatLog?.length || 0} Events
              </span>
            </div>

            <div className="p-5 md:p-6 flex flex-col gap-4 max-h-[450px] overflow-y-auto bg-brand-bg/20">
              {session.chatLog?.map((msg, mIdx) => {
                const isAI = msg.sender === 'ai';
                return (
                  <div key={msg.id || mIdx} className={`flex flex-col gap-1.5 max-w-[85%] ${isAI ? 'self-start' : 'self-end items-end'}`}>
                    <span className="text-[10px] font-bold text-brand-textMuted uppercase px-1">
                      {isAI ? 'AI Interviewer' : 'Your Answer'}
                    </span>
                    <div className={`p-4 rounded-xl border text-xs leading-relaxed select-text ${
                      isAI 
                        ? 'bg-brand-card/90 border-brand-border text-brand-textMain' 
                        : 'bg-brand-primary text-white border-brand-primary/20 font-semibold'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold font-display text-brand-textMain border-b border-brand-border pb-3 mb-1">
            Detailed Question Breakdown
          </h2>

          {session.questions.map((q, idx) => {
            const isExpanded = !!expandedCards[idx];
            const scoreDesc = getScoreDescription(q.score);

            return (
              <div 
                key={idx} 
                className={`glass-card rounded-2xl border transition-all ${
                  isExpanded ? 'border-brand-primary/30 shadow-lg' : 'border-brand-border shadow-sm'
                }`}
              >
                
                {/* Header Toggle */}
                <div 
                  onClick={() => toggleCard(idx)}
                  className="p-5 md:p-6 flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-9 w-9 rounded-lg bg-brand-border/30 border border-brand-border/60 flex items-center justify-center text-brand-textMain font-black text-xs font-display shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-sm md:text-base font-bold text-brand-textMain leading-relaxed select-text pr-4">
                        {q.question}
                      </h3>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-xs font-black uppercase ${scoreDesc.color}`}>
                          {q.score} / 10 • {scoreDesc.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="text-brand-textMuted hover:text-brand-textMain transition-colors shrink-0">
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                </div>

                {/* Nested Content Panel */}
                {isExpanded && (
                  <div className="border-t border-brand-border/60 p-5 md:p-6 flex flex-col gap-6 bg-brand-bg/30">
                    
                    {/* User Answer Panel */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-textMuted">Your Submitted Response</span>
                      <div className="p-4 rounded-xl border border-brand-border bg-brand-bg/60 text-sm leading-relaxed text-brand-textMain font-normal whitespace-pre-wrap select-text">
                        {q.answer ? q.answer : <em className="text-brand-textMuted">No answer was submitted for this question.</em>}
                      </div>
                    </div>

                    {/* Strengths & Improvements Splits */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Strengths (Green) */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-1.5 text-brand-secondary">
                          <ThumbsUp className="h-4.5 w-4.5" />
                          <h4 className="text-xs uppercase font-extrabold tracking-wider">Strengths</h4>
                        </div>
                        
                        <ul className="flex flex-col gap-2.5">
                          {q.strengths && q.strengths.length > 0 ? (
                            q.strengths.map((str, sIdx) => (
                              <li key={sIdx} className="flex gap-2.5 text-xs text-brand-textMuted leading-relaxed font-semibold">
                                <span className="h-4 w-4 rounded-full bg-brand-secondary/15 flex items-center justify-center text-brand-secondary shrink-0 mt-0.5">
                                  <Check className="h-3 w-3" />
                                </span>
                                <span>{str}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-xs text-brand-textMuted italic">No core strengths detected in answer length.</li>
                          )}
                        </ul>
                      </div>

                      {/* Areas for improvement (Amber) */}
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-1.5 text-brand-accent">
                          <AlertCircle className="h-4.5 w-4.5" />
                          <h4 className="text-xs uppercase font-extrabold tracking-wider">Areas to Improve</h4>
                        </div>

                        <ul className="flex flex-col gap-2.5">
                          {q.improvements && q.improvements.length > 0 ? (
                            q.improvements.map((imp, iIdx) => (
                              <li key={iIdx} className="flex gap-2.5 text-xs text-brand-textMuted leading-relaxed font-semibold">
                                <span className="h-4 w-4 rounded-full bg-brand-accent/15 flex items-center justify-center text-brand-accent shrink-0 mt-0.5">
                                  <Sparkles className="h-3 w-3" />
                                </span>
                                <span>{imp}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-xs text-brand-textMuted italic">No pressing improvements required. Excellent depth!</li>
                          )}
                        </ul>
                      </div>

                    </div>

                    {/* AI Model Advice panel */}
                    {q.tip && (
                      <div className="flex flex-col gap-3 border-t border-brand-border/60 pt-5">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-primary flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-brand-primary" />
                          <span>AI Advisory / Perfect STAR Model Answer</span>
                        </span>
                        <div className="text-sm font-semibold leading-relaxed text-brand-textMain bg-brand-primary/5 border border-brand-primary/30 rounded-xl p-4 shadow-glow-primary/10 select-text">
                          {q.tip}
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
