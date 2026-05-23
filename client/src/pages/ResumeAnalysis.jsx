import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyzeResume, getResumeHistory, startSession, extractResumeText } from '../services/api';
import { 
  Upload, FileText, CheckCircle, AlertTriangle, Sparkles, 
  Play, ChevronRight, Award, Compass, RefreshCw, Star, HelpCircle 
} from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';

export default function ResumeAnalysis() {
  const { getIdToken } = useAuth();
  const navigate = useNavigate();

  // Mode state: 'upload' or 'history' or 'details'
  const [activeView, setActiveView] = useState('upload'); 
  const [resumeText, setResumeText] = useState('');
  const [domain, setDomain] = useState('DSA');
  const [customDomain, setCustomDomain] = useState('');
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('strengths'); // strengths, improvements, keywords, star
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      const token = await getIdToken();
      const records = await getResumeHistory(token);
      setHistory(records);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setError('');
    const extension = file.name.split('.').pop().toLowerCase();
    
    const allowedExtensions = ['pdf', 'docx', 'txt', 'md'];
    if (!allowedExtensions.includes(extension)) {
      setError('Supported file types are .pdf, .docx, .txt, and .md. You can also paste your resume details below!');
      return;
    }

    try {
      setExtracting(true);
      setError('');
      const token = await getIdToken();
      const result = await extractResumeText(token, file);
      if (result && result.text) {
        setResumeText(result.text);
      } else {
        setError('Failed to extract text from the document. Please verify it is not scanned or password-protected.');
      }
    } catch (err) {
      console.error('File parsing error:', err);
      setError(err.message || 'Failed to extract text from the file. Please try directly pasting your resume content instead.');
    } finally {
      setExtracting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalDomain = domain === 'custom' ? customDomain : domain;
    if (!resumeText.trim()) {
      setError('Please upload a resume file or paste your resume text to begin analysis.');
      return;
    }
    if (domain === 'custom' && !customDomain.trim()) {
      setError('Please enter a target custom role/domain.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const token = await getIdToken();
      const result = await analyzeResume(token, { resumeText, domain: finalDomain });
      setAnalysisResult(result);
      setActiveView('details');
      loadHistory(); // refresh history list
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to complete resume analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPractice = async (qText, qDomain) => {
    try {
      setLoading(true);
      const token = await getIdToken();
      // Start a standard 5-question structured practice session centered around that target question's domain
      const session = await startSession(token, { 
        domain: qDomain, 
        difficulty: 'Medium', 
        count: 5,
        type: 'chat' // Redirect user to dynamic chat practice by default!
      });
      navigate(`/chat-interview/${session.id}`);
    } catch (err) {
      console.error('Failed to start quick session:', err);
      setError('Failed to start interview practice session. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full min-h-[calc(100vh-73px)] relative z-10 animate-fade-in flex flex-col gap-8">
      
      {/* Background Neon Glow */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 h-96 w-96 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 bg-brand-secondary/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-brand-border pb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white shadow-glow-primary">
            <Sparkles className="h-6 w-6 animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold font-display tracking-tight text-brand-textMain">
              Resume <span className="text-brand-primary">Analyzer</span>
            </h1>
            <p className="text-xs text-brand-textMuted mt-1">
              Elevate your profile for recruiter algorithms and check alignment against modern roles
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 bg-brand-border/20 p-1.5 rounded-xl border border-brand-border max-w-max">
          <button
            onClick={() => { setActiveView('upload'); setAnalysisResult(null); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeView === 'upload' || activeView === 'details' && analysisResult === null
                ? 'bg-brand-primary text-white shadow-glow-primary'
                : 'text-brand-textMuted hover:text-brand-textMain'
            }`}
          >
            New Analysis
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'history'
                ? 'bg-brand-primary text-white shadow-glow-primary'
                : 'text-brand-textMuted hover:text-brand-textMain'
            }`}
          >
            <span>Analysis History</span>
            {history.length > 0 && (
              <span className="h-4.5 w-4.5 rounded-full bg-brand-accent/20 border border-brand-accent/30 text-brand-accent flex items-center justify-center text-[10px] font-extrabold leading-none">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 bg-brand-danger/10 border border-brand-danger/20 rounded-xl p-4 text-brand-danger text-sm animate-fade-in">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {extracting && (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center animate-pulse-slow">
          <div className="relative h-16 w-16 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-brand-primary/20 border-t-brand-primary animate-spin" />
            <FileText className="h-6 w-6 text-brand-primary animate-bounce" />
          </div>
          <h3 className="text-lg font-bold font-display text-brand-textMain">Extracting Document Text</h3>
          <p className="text-xs text-brand-textMuted max-w-[320px] mt-2 font-medium leading-relaxed">
            Reading physical layouts, decomposing files, parsing formatting blocks, and compiling plain text content...
          </p>
        </div>
      )}

      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center animate-pulse-slow">
          <div className="relative h-16 w-16 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-brand-primary/20 border-t-brand-primary animate-spin" />
            <Sparkles className="h-6 w-6 text-brand-primary animate-bounce" />
          </div>
          <h3 className="text-lg font-bold font-display text-brand-textMain">Analyzing with Gemini 2.5</h3>
          <p className="text-xs text-brand-textMuted max-w-[320px] mt-2 font-medium leading-relaxed">
            Scanning industry keywords, assessing grammar clarity, measuring STAR-method alignments, and configuring interview questions...
          </p>
        </div>
      )}

      {!loading && !extracting && activeView === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Dropzone */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Target Domain Input */}
              <div className="flex flex-col gap-2 glass-card p-6 rounded-2xl border border-brand-border">
                <label className="text-xs font-extrabold uppercase tracking-wider text-brand-textMuted flex items-center gap-1.5">
                  <Compass className="h-4 w-4 text-brand-primary" />
                  <span>Target Practice Domain</span>
                </label>
                <p className="text-[11px] text-brand-textMuted -mt-1 leading-relaxed">
                  Select the engineering or leadership role you are targeting so our model can calibrate vocabulary and keywords.
                </p>
                <select
                  value={domain}
                  onChange={(e) => {
                    setDomain(e.target.value);
                    setIsCustomDomain(e.target.value === 'custom');
                  }}
                  className="w-full mt-2 px-4 py-3.5 rounded-xl glass-input bg-brand-card font-semibold text-sm cursor-pointer"
                >
                  <option value="DSA">Data Structures & Algorithms (SDE)</option>
                  <option value="System Design">System Design & Cloud Architecture</option>
                  <option value="Frontend">Frontend Development (Web/React)</option>
                  <option value="Backend">Backend Development (APIs/Node)</option>
                  <option value="Behavioural">Behavioral & Tech Leadership (STAR)</option>
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

              {/* File Dropzone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 md:p-10 flex flex-col items-center justify-center text-center transition-all duration-300 relative overflow-hidden ${
                  dragActive 
                    ? 'border-brand-primary bg-brand-primary/5 scale-[1.01]' 
                    : 'border-brand-border bg-brand-card/30 hover:border-brand-borderHover hover:bg-brand-card/50'
                }`}
              >
                <Upload className={`h-12 w-12 mb-4 transition-transform duration-300 ${dragActive ? 'scale-110 text-brand-primary' : 'text-brand-textMuted'}`} />
                <h3 className="text-base font-extrabold text-brand-textMain mb-1">Drag & Drop Resume</h3>
                <p className="text-xs text-brand-textMuted max-w-[280px] leading-relaxed mb-4">
                  Support document formats (.pdf, .docx, .txt, .md) for instant parsing
                </p>
                
                <label className="glow-btn-primary text-xs font-bold text-white py-2.5 px-6 rounded-xl cursor-pointer">
                  Browse Files
                  <input type="file" onChange={handleFileChange} accept=".pdf,.docx,.txt,.md" className="hidden" />
                </label>
              </div>

              {/* Pasted Text Box */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-brand-textMuted flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-brand-primary" />
                  <span>Resume Content</span>
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your professional experience bullet points, skills inventory, and summaries here directly..."
                  rows={8}
                  className="w-full p-4 rounded-2xl glass-input font-medium text-sm leading-relaxed"
                />
                <div className="flex justify-between items-center text-[10px] text-brand-textMuted font-bold">
                  <span>Characters: {resumeText.length}</span>
                  <span>Minimum suggested: 100 characters</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="glow-btn-primary w-full py-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                <span>Initiate AI Resume Review</span>
                <Sparkles className="h-4 w-4 text-white animate-pulse" />
              </button>

            </form>
          </div>

          {/* Quick instructions sidebar */}
          <div className="flex flex-col gap-6">
            <div className="glass-card p-6 rounded-2xl border border-brand-border">
              <h3 className="text-base font-extrabold text-brand-textMain flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-brand-accent" />
                <span>Analyzer Guidelines</span>
              </h3>
              <ul className="flex flex-col gap-4 text-xs font-medium leading-relaxed text-brand-textMuted">
                <li className="flex gap-2 items-start">
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-brand-primary" />
                  <span><strong>ATS calibration:</strong> Evaluates resume relevance against current ATS technical keywords to prevent auto-rejection.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-brand-primary" />
                  <span><strong>STAR-Method alignment:</strong> Scans project bullets to check if Situation, Task, Action, and Results are clearly structured.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-brand-primary" />
                  <span><strong>Tailored Practice:</strong> Synthesizes standard custom questions aimed at addressing technical and behavioral gaps.</span>
                </li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-brand-border flex-1">
              <h3 className="text-base font-extrabold text-brand-textMain mb-4">Past Analysis Reviews</h3>
              {historyLoading ? (
                <div className="flex justify-center py-10">
                  <RefreshCw className="h-5 w-5 animate-spin text-brand-primary" />
                </div>
              ) : history.length === 0 ? (
                <p className="text-xs text-brand-textMuted leading-relaxed font-medium">
                  No previous resumes have been analyzed yet. Run your first assessment above to build practice track records!
                </p>
              ) : (
                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
                  {history.map((record) => (
                    <button
                      key={record.id}
                      onClick={async () => {
                        try {
                          setLoading(true);
                          const token = await getIdToken();
                          // Fetch full record details
                          const fullRecord = await analyzeResume(token, { resumeText: record.resumeText || '', domain: record.domain });
                          // Force record values into display
                          setAnalysisResult({
                            ...fullRecord,
                            score: record.score || fullRecord.score,
                            summary: record.summary || fullRecord.summary
                          });
                          setActiveView('details');
                        } catch (err) {
                          console.error(err);
                          setError('Failed to fetch past analysis details');
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="w-full text-left p-3.5 rounded-xl border border-brand-border hover:border-brand-primary/30 bg-brand-border/10 hover:bg-brand-primary/5 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-extrabold text-brand-textMain truncate">
                          {record.domain}
                        </span>
                        <span className="text-[10px] text-brand-textMuted mt-0.5">
                          {new Date(record.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-black text-brand-primary">
                          {record.score}/100
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-brand-textMuted group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History view panel */}
      {!loading && activeView === 'history' && (
        <div className="glass-card rounded-2xl border border-brand-border p-6 md:p-8">
          <h2 className="text-lg font-bold text-brand-textMain mb-6">Historical Resume Analytics</h2>
          {history.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center justify-center">
              <FileText className="h-10 w-10 text-brand-textMuted mb-2" />
              <p className="text-xs text-brand-textMuted font-medium max-w-[280px]">
                No resume reviews found. Head over to 'New Analysis' to start grading your credentials!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((record) => (
                <div 
                  key={record.id}
                  className="glass-card-interactive p-6 rounded-xl border border-brand-border flex flex-col justify-between gap-6"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-sm font-extrabold text-brand-textMain">{record.domain}</h3>
                      <span className="text-[10px] text-brand-textMuted mt-0.5 block">
                        {new Date(record.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary text-xs font-black shrink-0">
                      {record.score}
                    </div>
                  </div>
                  
                  <p className="text-xs text-brand-textMuted leading-relaxed font-medium line-clamp-3">
                    {record.summary}
                  </p>

                  <button
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const token = await getIdToken();
                        // Call mock or real DB endpoint to fetch details
                        const fullRecord = await analyzeResume(token, { resumeText: record.resumeText || '', domain: record.domain });
                        setAnalysisResult({
                          ...fullRecord,
                          score: record.score || fullRecord.score,
                          summary: record.summary || fullRecord.summary
                        });
                        setActiveView('details');
                      } catch (err) {
                        console.error(err);
                        setError('Failed to fetch analysis details');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-brand-border hover:border-brand-primary/30 text-xs font-bold text-brand-textMain hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
                  >
                    <span>View Detailed Audit</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detailed Analysis Output */}
      {!loading && activeView === 'details' && analysisResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Score & Gauge Sidebar */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <div className="glass-card p-6 rounded-2xl border border-brand-border flex flex-col items-center justify-center text-center">
              <h2 className="text-base font-extrabold text-brand-textMain mb-6 flex items-center gap-1.5">
                <Award className="h-5 w-5 text-brand-accent animate-pulse" />
                <span>ATS Quality Grade</span>
              </h2>
              
              <div className="h-44 w-44 flex items-center justify-center mb-6">
                <ScoreGauge score={analysisResult.score} maxScore={100} size={150} strokeWidth={12} />
              </div>

              <div className="mt-2">
                <h3 className="text-sm font-extrabold text-brand-textMain">
                  {analysisResult.score >= 85 ? 'Premium Level Profile' : analysisResult.score >= 70 ? 'Intermediate Level Profile' : 'Needs Actionable Calibration'}
                </h3>
                <p className="text-xs text-brand-textMuted leading-relaxed font-medium mt-1">
                  Target Role: <strong>{domain}</strong>
                </p>
              </div>
            </div>

            {/* ATS Metric Breakdown Card */}
            {analysisResult.breakdown && (
              <div className="glass-card p-6 rounded-2xl border border-brand-border flex flex-col gap-5 animate-slide-up">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-textMuted flex items-center gap-2 pb-2.5 border-b border-brand-border">
                  <Sparkles className="h-4.5 w-4.5 text-brand-primary animate-pulse" />
                  <span>ATS Performance Breakdown</span>
                </h3>
                <div className="flex flex-col gap-4">
                  {[
                    { 
                      label: 'Role Keywords Density', 
                      value: analysisResult.breakdown.keywords, 
                      icon: FileText, 
                      color: 'bg-brand-primary', 
                      glow: 'shadow-[0_0_10px_rgba(74,124,92,0.3)]' 
                    },
                    { 
                      label: 'STAR Compliant Impact', 
                      value: analysisResult.breakdown.impact, 
                      icon: Star, 
                      color: 'bg-brand-secondary', 
                      glow: 'shadow-[0_0_10px_rgba(90,158,111,0.3)]' 
                    },
                    { 
                      label: 'Grammar, Style & Tone', 
                      value: analysisResult.breakdown.style, 
                      icon: Award, 
                      color: 'bg-indigo-500', 
                      glow: 'shadow-[0_0_10px_rgba(99,102,241,0.3)]' 
                    },
                    { 
                      label: 'Structure & Section Coverage', 
                      value: analysisResult.breakdown.structure, 
                      icon: CheckCircle, 
                      color: 'bg-amber-500', 
                      glow: 'shadow-[0_0_10px_rgba(245,158,11,0.3)]' 
                    }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-[11px] font-bold text-brand-textMuted">
                          <div className="flex items-center gap-1.5">
                            <Icon className="h-3.5 w-3.5 text-brand-textMuted" />
                            <span>{item.label}</span>
                          </div>
                          <span className="text-brand-textMain font-mono font-black">{item.value}%</span>
                        </div>
                        <div className="h-2 w-full bg-brand-border/20 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.color} ${item.glow} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Summary card */}
            <div className="glass-card p-6 rounded-2xl border border-brand-border">
              <h3 className="text-sm font-extrabold text-brand-textMain mb-3">AI Executive Review</h3>
              <p className="text-xs text-brand-textMuted leading-relaxed font-medium">
                {analysisResult.summary}
              </p>
            </div>
          </div>

          {/* Detailed Audit & Gaps Tabbing Panels */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass-card rounded-2xl border border-brand-border overflow-hidden">
              
              {/* Tab Navigation header */}
              <div className="flex border-b border-brand-border bg-brand-border/10 overflow-x-auto">
                {[
                  { id: 'strengths', label: 'Strengths', icon: CheckCircle, activeColor: 'text-brand-primary border-brand-primary' },
                  { id: 'improvements', label: 'Areas to Fix', icon: AlertTriangle, activeColor: 'text-brand-accent border-brand-accent' },
                  { id: 'keywords', label: 'ATS Keywords', icon: FileText, activeColor: 'text-brand-secondary border-brand-secondary' },
                  { id: 'star', label: 'STAR Check', icon: Star, activeColor: 'text-indigo-400 border-indigo-400' }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 py-4 px-6 text-xs font-extrabold tracking-wider uppercase border-b-2 whitespace-nowrap transition-all ${
                        activeTab === tab.id
                          ? `${tab.activeColor} bg-brand-primary/5`
                          : 'border-transparent text-brand-textMuted hover:text-brand-textMain'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Contents */}
              <div className="p-6 md:p-8 animate-fade-in min-h-[280px]">
                
                {/* Strengths Tab */}
                {activeTab === 'strengths' && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-base font-extrabold text-brand-textMain flex items-center gap-1.5">
                      <span>Strong Visual Markers & Vocabularies</span>
                    </h3>
                    <p className="text-xs text-brand-textMuted -mt-1 leading-relaxed">
                      These aspects of your resume are strong and align well with recruiter expectations.
                    </p>
                    <div className="flex flex-col gap-3 mt-2">
                      {analysisResult.strengths?.map((str, idx) => (
                        <div key={idx} className="flex gap-3 items-start bg-brand-border/10 border border-brand-border p-4 rounded-xl">
                          <CheckCircle className="h-4.5 w-4.5 text-brand-primary shrink-0 mt-0.5" />
                          <span className="text-xs font-semibold text-brand-textMain leading-relaxed">{str}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improvements Tab */}
                {activeTab === 'improvements' && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-base font-extrabold text-brand-textMain">Actionable Profile Revisions</h3>
                    <p className="text-xs text-brand-textMuted -mt-1 leading-relaxed">
                      Apply these edits to raise your score and increase callback rates.
                    </p>
                    <div className="flex flex-col gap-3 mt-2">
                      {analysisResult.improvements?.map((imp, idx) => (
                        <div key={idx} className="flex gap-3 items-start bg-brand-border/10 border border-brand-border p-4 rounded-xl">
                          <AlertTriangle className="h-4.5 w-4.5 text-brand-accent shrink-0 mt-0.5" />
                          <span className="text-xs font-semibold text-brand-textMain leading-relaxed">{imp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Keywords Tab */}
                {activeTab === 'keywords' && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-base font-extrabold text-brand-textMain">Missing ATS Key Phrases</h3>
                    <p className="text-xs text-brand-textMuted -mt-1 leading-relaxed">
                      These technical terms were not detected. Recruiters and scanners filter profiles based on these keywords.
                    </p>
                    <div className="flex flex-wrap gap-2.5 mt-4">
                      {analysisResult.missingKeywords?.length === 0 ? (
                        <span className="text-xs font-semibold text-brand-textMuted bg-brand-border/15 p-4 rounded-xl w-full text-center">
                          Zero missing keywords! Your profile is extremely keyword-rich for this domain.
                        </span>
                      ) : (
                        analysisResult.missingKeywords?.map((kw, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-border/20 border border-brand-border text-brand-textMain hover:border-brand-primary/30 transition-all cursor-default"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                            <span>{kw}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* STAR Calibration Tab */}
                {activeTab === 'star' && (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-base font-extrabold text-brand-textMain">STAR Method Metric Alignment</h3>
                    <p className="text-xs text-brand-textMuted -mt-1 leading-relaxed">
                      Evaluation of how well your achievements explain the Situation, Task, Action, and specific Result.
                    </p>
                    <div className="bg-brand-border/10 border border-brand-border p-5 rounded-xl flex flex-col gap-4 mt-2">
                      <div className="flex gap-2.5 items-center pb-3 border-b border-brand-border">
                        <Star className="h-5 w-5 text-brand-primary" />
                        <span className="text-xs font-black uppercase tracking-wider text-brand-textMain">AI Calibration Summary</span>
                      </div>
                      <p className="text-xs font-semibold text-brand-textMain leading-relaxed">
                        {analysisResult.starCalibration}
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Custom tailored questions card deck */}
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-extrabold text-brand-textMain flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-brand-primary" />
                <span>Tailored Practice Questions</span>
              </h3>
              <p className="text-xs text-brand-textMuted -mt-2.5">
                Gemini configured these custom questions based on your profile gaps. Click any card to launch an interactive chat practice session!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.recommendedQuestions?.map((rec, idx) => (
                  <div 
                    key={rec.id || idx}
                    className="glass-card-interactive p-5 rounded-xl border border-brand-border flex flex-col justify-between gap-5 group"
                  >
                    <p className="text-xs font-extrabold text-brand-textMain leading-relaxed flex-1">
                      "{rec.question}"
                    </p>
                    
                    <button
                      onClick={() => handleQuickPractice(rec.question, rec.domain)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-primary/95 text-xs font-bold text-white shadow-sm hover:shadow-md transition-all mt-2"
                    >
                      <span>Practice in AI Chat</span>
                      <Play className="h-3 w-3 fill-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
