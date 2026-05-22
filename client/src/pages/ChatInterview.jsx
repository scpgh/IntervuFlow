import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSessionDetails, submitChatResponse, concludeChatSession } from '../services/api';
import { 
  Send, Sparkles, AlertCircle, ArrowLeft, MessageSquare, 
  HelpCircle, Bot, User, CheckCircle2, Award, Mic, MicOff
} from 'lucide-react';

export default function ChatInterview() {
  const { id: sessionId } = useParams();
  const { getIdToken } = useAuth();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [concluding, setConcluding] = useState(false);
  
  const chatEndRef = useRef(null);

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
          setInputText((prev) => prev + (prev.endsWith(' ') ? '' : ' ') + finalTranscript);
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
  }, []);

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
      } catch (err) {
        console.error('Error fetching session:', err);
        setError('Failed to retrieve active chat interview session. Please verify server connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  // Auto scroll to bottom of chat when transcript updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.chatLog, sending]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || sending || concluding) return;

    const answerText = inputText.trim();
    setInputText('');

    try {
      setSending(true);
      setError('');
      
      // Optimistically add user response to local state for instant rendering
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          chatLog: [
            ...(prev.chatLog || []),
            {
              id: `user-temp-${Date.now()}`,
              sender: 'user',
              text: answerText,
              timestamp: new Date().toISOString()
            }
          ]
        };
      });

      const token = await getIdToken();
      const updatedData = await submitChatResponse(token, { sessionId, answer: answerText });
      
      // Update with final data from server containing AI's response
      setSession((prev) => ({
        ...prev,
        chatLog: updatedData.chatLog,
        status: updatedData.status
      }));
    } catch (err) {
      console.error('Failed to submit chat response:', err);
      setError('Failed to submit answer. Please check Express server status.');
      
      // Rollback optimistic addition if server fails
      const token = await getIdToken();
      const refetched = await getSessionDetails(token, sessionId);
      setSession(refetched);
    } finally {
      setSending(false);
    }
  };

  const handleConclude = async () => {
    try {
      setConcluding(true);
      setError('');
      const token = await getIdToken();
      await concludeChatSession(token, sessionId);
      navigate(`/feedback/${sessionId}`, { replace: true });
    } catch (err) {
      console.error('Failed to conclude chat session:', err);
      setError('Failed to grade conversational session. Please retry.');
      setConcluding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
        <div className="relative h-12 w-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-brand-primary/20 border-t-brand-primary animate-spin" />
          <MessageSquare className="h-4.5 w-4.5 text-brand-primary animate-pulse" />
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 glass-card border border-brand-danger/20 rounded-2xl text-center">
        <AlertCircle className="h-12 w-12 text-brand-danger mx-auto mb-4" />
        <h3 className="text-lg font-bold text-brand-textMain">Connection Error</h3>
        <p className="text-xs text-brand-textMuted mt-2 mb-6">{error}</p>
        <button onClick={() => navigate('/')} className="glow-btn-primary text-white font-bold py-2.5 px-6 rounded-lg text-sm">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const chatLog = session?.chatLog || [];
  const userResponses = chatLog.filter(msg => msg.sender === 'user');
  const roundCount = userResponses.length;
  const maxRounds = 4;
  const isFinished = roundCount >= maxRounds;

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 w-full min-h-[calc(100vh-73px)] flex flex-col gap-5 relative z-10 animate-fade-in">
      
      {/* Background Neon Glowing spots */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 h-80 w-80 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 bg-brand-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Session Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4">
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to exit? Your progress in this chat session will not be graded until you conclude it.")) {
                navigate('/');
              }
            }}
            className="h-9 w-9 rounded-lg border border-brand-border flex items-center justify-center text-brand-textMuted hover:text-brand-textMain hover:bg-brand-border/20 transition-all shrink-0"
            title="Exit Session"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold font-display tracking-tight text-brand-textMain">
                Interactive <span className="text-brand-primary">AI Chat Practice</span>
              </h1>
              <span className="h-2 w-2 rounded-full bg-brand-secondary animate-pulse" />
            </div>
            
            <p className="text-[11px] text-brand-textMuted mt-0.5 leading-none font-medium">
              AI Interviewer dynamically tailors follow-ups based on your exact answers
            </p>
          </div>
        </div>

        {/* Dynamic Tags and Progress indicator */}
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <span className="text-[10px] tracking-wider font-extrabold uppercase py-0.5 px-2 bg-brand-border/40 border border-brand-border rounded text-brand-textMuted">
            {session?.domain}
          </span>
          <span className="text-[10px] tracking-wider font-extrabold uppercase py-0.5 px-2 bg-brand-primary/10 border border-brand-primary/20 rounded text-brand-primary">
            {session?.difficulty}
          </span>
          
          <div className="h-5 w-px bg-brand-border" />
          
          <span className="text-xs font-black text-brand-textMain whitespace-nowrap bg-brand-secondary/10 border border-brand-secondary/20 rounded px-2 py-0.5 text-brand-secondary">
            Round {Math.min(roundCount + 1, maxRounds)} of {maxRounds}
          </span>
        </div>

      </div>

      {error && (
        <div className="flex items-start gap-2.5 bg-brand-danger/10 border border-brand-danger/20 rounded-xl p-4 text-brand-danger text-xs animate-fade-in shrink-0">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Chat Conversation timeline container */}
      <div className="flex-1 min-h-[300px] max-h-[calc(100vh-310px)] overflow-y-auto pr-2 flex flex-col gap-4 py-2 border border-brand-border/50 bg-brand-card/10 rounded-2xl p-4 md:p-6 shadow-inner">
        
        {chatLog.map((message) => {
          const isAI = message.sender === 'ai';
          return (
            <div 
              key={message.id}
              className={`flex items-start gap-3 max-w-[85%] ${
                isAI ? 'self-start animate-fade-in' : 'self-end flex-row-reverse animate-fade-in'
              }`}
            >
              
              {/* Avatar Icon */}
              <div className={`h-8 w-8 rounded-full border shrink-0 flex items-center justify-center ${
                isAI 
                  ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary' 
                  : 'bg-brand-secondary/10 border-brand-secondary/20 text-brand-secondary'
              }`}>
                {isAI ? <Bot className="h-4.5 w-4.5" /> : <User className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`rounded-2xl p-4 text-sm leading-relaxed shadow-sm border select-text ${
                isAI 
                  ? 'bg-brand-card/90 border-brand-border text-brand-textMain' 
                  : 'bg-brand-primary text-white border-brand-primary/40 font-medium'
              }`}>
                {message.text}
              </div>

            </div>
          );
        })}

        {/* Dynamic loading states */}
        {sending && (
          <div className="flex items-start gap-3 max-w-[80%] self-start animate-pulse-slow">
            <div className="h-8 w-8 rounded-full border bg-brand-primary/10 border-brand-primary/20 text-brand-primary shrink-0 flex items-center justify-center">
              <Bot className="h-4.5 w-4.5" />
            </div>
            
            <div className="rounded-2xl p-4 bg-brand-card/95 border border-brand-border text-brand-textMuted flex items-center gap-1">
              <span className="text-xs font-semibold mr-1.5">AI Coach is drafting a follow-up</span>
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-bounce delay-100" />
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-bounce delay-200" />
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-bounce delay-300" />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input / Action Form controller */}
      <div className="shrink-0 flex flex-col gap-4">
        
        {isFinished ? (
          // Grade compilation triggers
          <div className="glass-card p-6 border border-brand-secondary/30 bg-gradient-to-tr from-brand-card to-indigo-950/20 rounded-2xl text-center flex flex-col items-center justify-center gap-4 animate-scale-in shadow-lg">
            <div className="h-11 w-11 rounded-full bg-brand-secondary/15 border border-brand-secondary/35 text-brand-secondary flex items-center justify-center">
              <Award className="h-5.5 w-5.5 animate-bounce" />
            </div>
            
            <div>
              <h3 className="text-base font-extrabold text-brand-textMain">Interview Content Covered!</h3>
              <p className="text-xs text-brand-textMuted max-w-md mt-1 leading-relaxed font-semibold">
                You have successfully completed 4 full rounds of interactive questions. Let's send the transcript to Gemini to grade your strengths and weaknesses.
              </p>
            </div>

            <button
              onClick={handleConclude}
              disabled={concluding}
              className="glow-btn-secondary py-3 px-8 rounded-xl text-white font-extrabold text-sm flex items-center gap-2"
            >
              {concluding ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Compiling AI Evaluation Dashboard...</span>
                </>
              ) : (
                <>
                  <span>Conclude & Generate Evaluation Report</span>
                  <Sparkles className="h-4.5 w-4.5 fill-white" />
                </>
              )}
            </button>
          </div>
        ) : (
          // Standard answer text area box
          <form onSubmit={handleSend} className="flex flex-col gap-2">
            
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-3">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-brand-textMuted flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-brand-primary" />
                  <span>Outline your professional response</span>
                </label>
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={sending || concluding}
                  className={`p-1 rounded-full border transition-all ${
                    isRecording 
                      ? 'bg-brand-danger/20 border-brand-danger/40 text-brand-danger shadow-glow-danger animate-pulse-slow'
                      : 'bg-brand-card border-brand-border text-brand-textMuted hover:text-brand-primary hover:border-brand-primary/50'
                  }`}
                  title={isRecording ? "Stop Recording" : "Start Voice Recording"}
                >
                  {isRecording ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
                </button>
                {isRecording && <span className="text-[10px] font-bold text-brand-danger tracking-wider uppercase animate-pulse">Recording...</span>}
              </div>
              
              <span className="text-[10px] font-bold text-brand-textMuted">
                {inputText.split(/\s+/).filter(Boolean).length} Words • {inputText.length} Characters
              </span>
            </div>

            <div className="relative flex items-center glass-card border border-brand-border rounded-2xl overflow-hidden focus-within:border-brand-primary/40 transition-all">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  // Allow pressing Enter to send, but Shift+Enter to write new lines
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Structure your answer clearly, including metrics or framework definitions... (Press Enter to Send)"
                className="w-full bg-transparent border-0 ring-0 focus:ring-0 focus:outline-none p-4 pr-16 text-sm leading-relaxed max-h-24 min-h-[50px] resize-none font-medium text-brand-textMain"
                disabled={sending || concluding}
              />
              
              <button
                type="submit"
                disabled={!inputText.trim() || sending || concluding}
                className="absolute right-3.5 h-10 w-10 rounded-xl bg-brand-primary hover:bg-brand-primary/95 text-white flex items-center justify-center transition-all shadow-md disabled:opacity-40 disabled:pointer-events-none"
                title="Submit Response"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
}
