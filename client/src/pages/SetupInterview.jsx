import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { startSession } from '../services/api';
import { 
  Play, Sparkles, AlertCircle, Compass, HelpCircle, 
  ShieldAlert, MessageSquare, ClipboardList 
} from 'lucide-react';

const PREP_QUOTES = [
  "Formulating domain-aligned assessment questions...",
  "Analyzing algorithm complexity benchmarks...",
  "Structuring behavioral scenarios using the STAR method...",
  "Calibrating difficulty weights and model answer keys...",
  "Preparing the virtual sandbox console room..."
];

export default function SetupInterview() {
  const { getIdToken } = useAuth();
  const navigate = useNavigate();

  const [domain, setDomain] = useState('DSA');
  const [customDomain, setCustomDomain] = useState('');
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(5);
  const [type, setType] = useState('structured'); // 'structured' or 'chat'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalDomain = domain === 'custom' ? customDomain : domain;
    if (domain === 'custom' && !customDomain.trim()) {
      setError('Please enter a target custom role/domain.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Cycle through motivational quotes during AI generation
      const quoteInterval = setInterval(() => {
        setQuoteIndex((prev) => (prev + 1) % PREP_QUOTES.length);
      }, 2500);

      const token = await getIdToken();
      // If chat is chosen, count parameter doesn't matter (always 4 rounds)
      const session = await startSession(token, { domain: finalDomain, difficulty, count, type });
      
      clearInterval(quoteInterval);
      if (type === 'chat') {
        navigate(`/chat-interview/${session.id}`);
      } else {
        navigate(`/interview/${session.id}`);
      }
    } catch (err) {
      console.error('Error starting session:', err);
      setError('Failed to generate interview set. Please verify that the Express backend server is online.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 min-h-[calc(100vh-73px)] flex items-center justify-center relative z-10 animate-fade-in">
      
      {/* Background glow spot */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-80 w-80 bg-brand-secondary/5 rounded-full blur-[90px] pointer-events-none" />

      {loading ? (
        // Beautiful loader while AI generates the questions
        <div className="text-center flex flex-col items-center justify-center glass-card p-10 md:p-12 rounded-2xl max-w-md w-full border border-brand-border animate-pulse-slow">
          <div className="relative h-16 w-16 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-brand-primary/20 border-t-brand-primary animate-spin" />
            <Sparkles className="h-6 w-6 text-brand-primary animate-bounce" />
          </div>
          <h3 className="text-lg font-bold font-display text-brand-textMain">Consulting Gemini 2.5 Flash</h3>
          <p className="text-xs text-brand-textMuted max-w-[280px] mt-2.5 transition-all duration-500 h-10 leading-relaxed font-medium">
            {PREP_QUOTES[quoteIndex]}
          </p>
        </div>
      ) : (
        <div className="w-full glass-card rounded-2xl border border-brand-border p-8 md:p-10 shadow-2xl relative">
          
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-brand-border pb-6 mb-8">
            <div className="h-10 w-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shadow-sm">
              <Compass className="h-5.5 w-5.5" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold font-display text-brand-textMain">
                Configure Practice Set
              </h2>
              <p className="text-xs text-brand-textMuted mt-0.5">
                Choose format, target topic, and difficulty to prepare your sandbox environment
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-brand-danger/10 border border-brand-danger/20 rounded-xl p-4 text-brand-danger text-sm mb-6 animate-fade-in">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            {/* Redesigned Premium Format Selector */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-textMuted flex items-center gap-1">
                <span>Interview Style / Format</span>
                <HelpCircle className="h-3.5 w-3.5" title="Decide between structured sequential questions or a dynamic conversation." />
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Format 1: Structured Questions */}
                <div 
                  onClick={() => setType('structured')}
                  className={`glass-card-interactive p-5 rounded-xl border transition-all cursor-pointer flex gap-4 ${
                    type === 'structured'
                      ? 'border-brand-primary bg-brand-primary/5 shadow-glow-primary scale-[1.01]'
                      : 'border-brand-border bg-brand-card/30 hover:border-brand-borderHover hover:bg-brand-card/50'
                  }`}
                >
                  <div className={`h-10 w-10 rounded-lg shrink-0 flex items-center justify-center ${
                    type === 'structured'
                      ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                      : 'bg-brand-border/40 text-brand-textMuted border border-transparent'
                  }`}>
                    <ClipboardList className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-brand-textMain">Structured Questions</h4>
                    <p className="text-xs text-brand-textMuted mt-1 leading-relaxed font-semibold">
                      Answer a sequential pool of questions (5-15) one-by-one inside an isolated, structured workspace sandbox. Excellent for targeted practices.
                    </p>
                  </div>
                </div>

                {/* Format 2: Interactive AI Chat */}
                <div 
                  onClick={() => setType('chat')}
                  className={`glass-card-interactive p-5 rounded-xl border transition-all cursor-pointer flex gap-4 ${
                    type === 'chat'
                      ? 'border-brand-primary bg-brand-primary/5 shadow-glow-primary scale-[1.01]'
                      : 'border-brand-border bg-brand-card/30 hover:border-brand-borderHover hover:bg-brand-card/50'
                  }`}
                >
                  <div className={`h-10 w-10 rounded-lg shrink-0 flex items-center justify-center ${
                    type === 'chat'
                      ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                      : 'bg-brand-border/40 text-brand-textMuted border border-transparent'
                  }`}>
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-brand-textMain flex items-center gap-1.5">
                      <span>Interactive AI Chat</span>
                      <span className="text-[9px] tracking-widest font-black uppercase py-0.5 px-1.5 bg-brand-secondary/15 text-brand-secondary rounded border border-brand-secondary/25">
                        New
                      </span>
                    </h4>
                    <p className="text-xs text-brand-textMuted mt-1 leading-relaxed font-semibold">
                      Practice via a natural conversational dialogue timeline. The AI interviewer starts the meeting and asks dynamic follow-ups based on your comments.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Domain and Difficulty Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Domain Preference Select */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-textMuted flex items-center gap-1">
                  <span>Topic Domain</span>
                  <HelpCircle className="h-3.5 w-3.5" title="The functional subject of this practice mock set." />
                </label>
                <select
                  value={domain}
                  onChange={(e) => {
                    setDomain(e.target.value);
                    setIsCustomDomain(e.target.value === 'custom');
                  }}
                  className="w-full px-4 py-3.5 rounded-xl glass-input appearance-none bg-brand-card font-semibold text-sm cursor-pointer"
                >
                  <option value="DSA">Data Structures & Algorithms</option>
                  <option value="System Design">System Design</option>
                  <option value="Frontend">Frontend Development</option>
                  <option value="Backend">Backend Development</option>
                  <option value="Behavioural">Behavioural & Leadership</option>
                  <option value="HR">HR & Cultural Alignment</option>
                  <option value="Data Science">Data Science / ML</option>
                  <option value="DevOps">DevOps / Cloud</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Product Management">Product Management</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Database">Database / SQL</option>
                  <option value="QA Testing">QA / Testing</option>
                  <option value="Blockchain">Blockchain / Web3</option>
                  <option value="AI/ML">AI / NLP</option>
                  <option value="Embedded Systems">Embedded Systems / IoT</option>
                  <option value="Game Development">Game Development</option>
                  <option value="Data Engineering">Data Engineering</option>
                  <option value="Full Stack">Full Stack</option>
                  <option value="custom">Custom Role / Other...</option>
                </select>
                {isCustomDomain && (
                  <input
                    type="text"
                    placeholder="e.g. Data Scientist, iOS Developer, Product Manager..."
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="w-full mt-3 px-4 py-3 rounded-xl glass-input bg-brand-card font-semibold text-sm animate-fade-in focus:outline-none"
                    required
                  />
                )}
              </div>

              {/* Difficulty Preference Select */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-textMuted flex items-center gap-1">
                  <span>Target Difficulty</span>
                  <HelpCircle className="h-3.5 w-3.5" title="Calibrates the grading strictness and depth required." />
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Easy', 'Medium', 'Hard'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`py-3.5 rounded-xl text-xs font-bold border transition-all ${
                        difficulty === diff
                          ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-glow-primary'
                          : 'border-brand-border bg-brand-border/10 text-brand-textMuted hover:border-brand-borderHover hover:text-brand-textMain'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Question Count Selector (Conditionally shown) */}
            {type === 'structured' ? (
              <div className="flex flex-col gap-2 animate-fade-in">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-textMuted flex items-center gap-1">
                  <span>Number of Questions</span>
                  <HelpCircle className="h-3.5 w-3.5" title="Fewer questions allow swift iterations, while 10+ provide robust analysis." />
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCount(num)}
                      className={`py-3.5 rounded-xl text-sm font-extrabold border transition-all ${
                        count === num
                          ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-glow-primary'
                          : 'border-brand-border bg-brand-border/10 text-brand-textMuted hover:border-brand-borderHover hover:text-brand-textMain'
                      }`}
                    >
                      {num} Qs
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-4 text-brand-primary text-xs leading-relaxed font-semibold animate-fade-in">
                <Sparkles className="h-4.5 w-4.5 shrink-0 text-brand-primary" />
                <span>
                  <strong>Conversational Style Active:</strong> Chat interview length is handled dynamically by our AI Interviewer, set to exactly 4 rounds of fluid question & follow-up dialogues.
                </span>
              </div>
            )}

            {/* Warning note on API Limits */}
            <div className="flex gap-2.5 items-start bg-brand-border/20 border border-brand-border rounded-xl p-4 text-brand-textMuted text-xs leading-relaxed font-medium">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5 text-brand-accent" />
              <span>
                <strong>Developer Note:</strong> Initializing sessions works out-of-the-box in developer offline database mode. All scoring aggregates and evaluations are supported completely free!
              </span>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="glow-btn-primary w-full flex items-center justify-center gap-2 text-white font-bold py-4 rounded-xl text-sm transition-all mt-2"
            >
              <span>Initialize Workspace</span>
              <Play className="h-4 w-4 fill-white" />
            </button>

          </form>

        </div>
      )}
    </div>
  );
}
