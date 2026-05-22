import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSessionDetails, submitAnswers } from '../services/api';
import { ChevronLeft, ChevronRight, Send, AlertTriangle, Clock, HelpCircle, FileText, CheckCircle2, ShieldAlert, Mic, MicOff } from 'lucide-react';

const TIMER_SECONDS = 180; // 3 minutes per question

export default function InterviewRoom() {
  const { id: sessionId } = useParams();
  const { getIdToken } = useAuth();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Active state controllers
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);

  // Timer Ref
  const timerRef = useRef(null);

  // Speech Recognition State
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setAnswers((prev) => {
            const updated = [...prev];
            const currentText = updated[activeIndex] || '';
            updated[activeIndex] = currentText + (currentText.endsWith(' ') ? '' : ' ') + finalTranscript;
            return updated;
          });
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [activeIndex]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (err) {
          console.error("Microphone start error:", err);
        }
      } else {
        alert("Speech recognition is not supported in this browser.");
      }
    }
  };

  // Load Session details on mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        setError('');
        const token = await getIdToken();
        const data = await getSessionDetails(token, sessionId);
        
        if (data.status === 'completed') {
          navigate(`/feedback/${sessionId}`, { replace: true });
          return;
        }

        setSession(data);
        // Initialize local answers array matching the question set size
        setAnswers(Array(data.questions.length).fill(''));
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Failed to retrieve the active interview session. Please verify details.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  // Manage Per-Question Countdowns
  useEffect(() => {
    if (loading || submitting || !session) return;

    // Reset countdown timer when active index changes
    setTimeLeft(TIMER_SECONDS);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0; // Timer expired
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeIndex, loading, session, submitting]);

  const handleAnswerChange = (text) => {
    const updated = [...answers];
    updated[activeIndex] = text;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (activeIndex < session.questions.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    const unansweredCount = answers.filter(ans => ans.trim() === '').length;
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(`You have ${unansweredCount} unanswered questions. Are you sure you want to finish the session?`);
      if (!confirmSubmit) return;
    }

    try {
      setSubmitting(true);
      setError('');
      if (timerRef.current) clearInterval(timerRef.current);

      const token = await getIdToken();
      await submitAnswers(token, { sessionId, answers });
      
      navigate(`/feedback/${sessionId}`, { replace: true });
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Failed to submit and evaluate your responses. Please verify your backend server connection.');
      setSubmitting(false);
    }
  };

  const getTimerColor = () => {
    if (timeLeft < 30) return 'text-brand-danger border-brand-danger/35 bg-brand-danger/10 animate-pulse';
    if (timeLeft < 60) return 'text-brand-accent border-brand-accent/35 bg-brand-accent/10';
    return 'text-brand-primary border-brand-primary/20 bg-brand-primary/5';
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  // Helper guidelines text per domain
  const getDomainTip = (domain) => {
    const dom = (domain || '').toLowerCase();
    if (dom.includes('dsa')) {
      return "Detail your algorithm: describe memory layout, complexity (Big O) trade-offs, edge-cases, and variable scopes.";
    }
    if (dom.includes('design')) {
      return "Outline core architecture: explain databases, load balancers, caching partitions, scaling issues, and performance bottlenecks.";
    }
    if (dom.includes('behavioural') || dom.includes('hr')) {
      return "Structure your story: apply the STAR method (Situation, Task, Action, Result) showcasing leadership, growth, or conflict resolution.";
    }
    return "Provide a detailed explanation. Outline key definitions, cite concrete libraries, and list performance configurations.";
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-brand-primary/20 border-t-brand-primary animate-spin" />
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex flex-col items-center justify-center px-4">
        <div className="text-center flex flex-col items-center justify-center glass-card p-10 md:p-12 rounded-2xl max-w-md w-full border border-brand-border animate-pulse-slow">
          <div className="relative h-16 w-16 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-brand-secondary/20 border-t-brand-secondary animate-spin" />
            <CheckCircle2 className="h-6 w-6 text-brand-secondary animate-bounce" />
          </div>
          <h3 className="text-xl font-bold font-display text-brand-textMain">Analyzing Answers</h3>
          <p className="text-xs text-brand-textMuted max-w-[280px] mt-3 leading-relaxed font-semibold">
            Gemini 2.5 Flash is grading each answer, compiling strengths, improvements, and model tips...
          </p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 glass-card border border-brand-danger/20 rounded-2xl text-center">
        <AlertTriangle className="h-12 w-12 text-brand-danger mx-auto mb-4" />
        <h3 className="text-lg font-bold text-brand-textMain">Evaluation Error</h3>
        <p className="text-xs text-brand-textMuted mt-2 mb-6">{error || 'Session failed to load'}</p>
        <button onClick={() => navigate('/')} className="glow-btn-primary text-white font-bold py-2.5 px-6 rounded-lg text-sm">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const currentQuestionObj = session.questions[activeIndex];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 min-h-[calc(100vh-73px)] grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 animate-fade-in">
      
      {/* Question Card Panel */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        
        {/* Step / Index Progress */}
        <div className="flex items-center justify-between border-b border-brand-border pb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-primary" />
            <span className="text-xs font-black tracking-widest text-brand-textMuted uppercase">
              Question {activeIndex + 1} of {session.questions.length}
            </span>
          </div>
          
          {/* Tag specs */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-wider font-extrabold uppercase py-0.5 px-2 bg-brand-border/40 border border-brand-border rounded text-brand-textMuted">
              {session.domain}
            </span>
            <span className="text-[10px] tracking-wider font-extrabold uppercase py-0.5 px-2 bg-brand-primary/10 border border-brand-primary/20 rounded text-brand-primary">
              {session.difficulty}
            </span>
          </div>
        </div>

        {/* Live Question Box */}
        <div className="glass-card rounded-2xl border border-brand-border p-6 shadow-xl relative min-h-[120px] flex items-center bg-gradient-to-tr from-brand-card to-indigo-950/10">
          <p className="text-lg md:text-xl font-bold font-display text-brand-textMain leading-relaxed select-text">
            {currentQuestionObj?.question}
          </p>
        </div>

        {/* Text Response input console */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-textMuted">
                Your Written Response
              </label>
              <button
                onClick={toggleRecording}
                disabled={submitting}
                className={`p-1.5 rounded-full border transition-all ${
                  isRecording 
                    ? 'bg-brand-danger/20 border-brand-danger/40 text-brand-danger shadow-glow-danger animate-pulse-slow'
                    : 'bg-brand-card border-brand-border text-brand-textMuted hover:text-brand-primary hover:border-brand-primary/50'
                }`}
                title={isRecording ? "Stop Recording" : "Start Voice Recording"}
              >
                {isRecording ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </button>
              {isRecording && <span className="text-[10px] font-bold text-brand-danger tracking-wider uppercase animate-pulse">Recording...</span>}
            </div>
            <span className="text-xs font-semibold text-brand-textMuted">
              {(answers[activeIndex] || '').split(/\s+/).filter(Boolean).length} Words • {(answers[activeIndex] || '').length} Characters
            </span>
          </div>

          <textarea
            value={answers[activeIndex]}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your structured solution or response here..."
            className="w-full h-72 rounded-2xl glass-input p-5 text-sm md:text-base font-normal leading-relaxed resize-none"
            disabled={submitting}
          />
        </div>

        {/* Console Footers (Navigation keys) */}
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="flex items-center gap-1.5 py-3 px-5 rounded-xl border border-brand-border hover:border-brand-borderHover hover:bg-brand-border/20 text-brand-textMuted hover:text-brand-textMain text-sm font-bold transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
            <span>Previous Q</span>
          </button>

          {activeIndex === session.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="glow-btn-secondary flex items-center gap-2 text-white font-extrabold py-3 px-6 rounded-xl text-sm transition-all"
            >
              <span>Submit & Grade</span>
              <Send className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 py-3 px-5 rounded-xl border border-brand-primary/20 bg-brand-primary/5 hover:bg-brand-primary/15 text-brand-primary text-sm font-extrabold transition-all"
            >
              <span>Next Question</span>
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          )}
        </div>

      </div>

      {/* Side Console widgets */}
      <div className="flex flex-col gap-6">
        
        {/* Countdown Timer Widget */}
        <div className="glass-card rounded-2xl border border-brand-border p-6 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-11 w-11 rounded-xl border flex items-center justify-center transition-colors duration-500 ${getTimerColor()}`}>
              <Clock className="h-5.5 w-5.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase font-extrabold tracking-wider text-brand-textMuted leading-none">Time Remaining</span>
              <span className={`text-xl font-black font-display mt-1.5 transition-colors ${timeLeft < 30 ? 'text-brand-danger' : 'text-brand-textMain'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          {timeLeft === 0 && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-danger bg-brand-danger/10 border border-brand-danger/20 py-1 px-2.5 rounded-full animate-bounce">
              Expired
            </span>
          )}
        </div>

        {/* Suggestion Guides */}
        <div className="glass-card rounded-2xl border border-brand-border p-6 shadow-md">
          <h4 className="text-xs uppercase font-black tracking-widest text-brand-textMuted mb-3 flex items-center gap-1.5">
            <HelpCircle className="h-4.5 w-4.5 text-brand-primary" />
            <span>AI Coach Tips</span>
          </h4>
          <p className="text-xs text-brand-textMuted leading-relaxed font-semibold">
            {getDomainTip(session.domain)}
          </p>
        </div>

        {/* Stepper Progress Indicator Grid */}
        <div className="glass-card rounded-2xl border border-brand-border p-6 shadow-md">
          <h4 className="text-xs uppercase font-black tracking-widest text-brand-textMuted mb-4">
            Practice Set Stepper
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {answers.map((ans, i) => {
              const isFilled = ans.trim() !== '';
              const isActive = activeIndex === i;
              
              let circleColor = 'border-brand-border bg-brand-border/10 text-brand-textMuted hover:border-brand-borderHover';
              if (isFilled) circleColor = 'border-brand-secondary/30 bg-brand-secondary/5 text-brand-secondary';
              if (isActive) circleColor = 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-glow-primary';

              return (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-9 w-9 rounded-lg border text-xs font-black transition-all flex items-center justify-center ${circleColor}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
