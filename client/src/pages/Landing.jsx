import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, ShieldCheck, Cpu, Play, CheckCircle, 
  AlertTriangle, FileText, ChevronRight, MessageSquare, Terminal, 
  HelpCircle, UserCheck, BarChart2, Star, ShieldAlert, Award
} from 'lucide-react';

export default function Landing() {
  // Simulator State
  const [playState, setPlayState] = useState('idle'); // idle | scanning | completed
  const [progress, setProgress] = useState(0);
  const [scanLog, setScanLog] = useState('');

  const logs = [
    'Initializing advanced parsing engine...',
    'Extracting raw PDF text modules...',
    'Verifying structure & contact credentials...',
    'Scanning bullets for quantifiable STAR metrics...',
    'Analyzing verb tenses bullet-by-bullet...',
    'Checking developer portfolio links (GitHub/LinkedIn)...',
    'Generating granular ATS report indices...',
    'Platform audit completed successfully!'
  ];

  useEffect(() => {
    let timer;
    let logIdx = 0;
    if (playState === 'scanning') {
      setProgress(0);
      setScanLog(logs[0]);
      
      // Update progress bar
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setPlayState('completed');
            return 100;
          }
          const next = prev + 4;
          
          // Rotate scanning logs based on progress threshold
          const index = Math.min(Math.floor((next / 100) * logs.length), logs.length - 1);
          setScanLog(logs[index]);
          
          return next;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [playState]);

  const handleStartScan = () => {
    setPlayState('scanning');
  };

  const handleResetScan = () => {
    setPlayState('idle');
    setProgress(0);
  };

  const features = [
    {
      icon: Cpu,
      title: "ATS Optimization Engine",
      description: "Audits your resume using strict recruitment algorithms. Scans for real STAR metrics, bullet-by-bullet tense consistency, and checks for missing contact/portfolio details.",
      color: "text-brand-primary"
    },
    {
      icon: MessageSquare,
      title: "Contextual AI Interview Rooms",
      description: "Engage in highly realistic chat or voice simulations. Tailored dynamically for Software Engineering, Product Management, Sales, and Finance workflows.",
      color: "text-brand-secondary"
    },
    {
      icon: BarChart2,
      title: "Visual Performance Dashboards",
      description: "Get immediate actionable feedback with visual scoring gauges, comprehensive analytical category charts, and concrete suggestions for grammar and structure.",
      color: "text-brand-accent"
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Upload & Audit",
      description: "Drop your PDF or Word resume. Our engine analyzes tenses, STAR metrics, and technical formats, flagging visual issues immediately."
    },
    {
      num: "02",
      title: "Calibrate Target",
      description: "Select your desired role (Tech, Product, Marketing) and fine-tune the grading strictness. Customize the session matching your real job target."
    },
    {
      num: "03",
      title: "Interactive Practice",
      description: "Conducted by adaptive AI models. Respond via chat, and receive responsive, context-aware queries testing your deep expertise."
    },
    {
      num: "04",
      title: "Upgrade & Land",
      description: "Inspect dynamic metrics charts, correct specific flagged issues, and download comprehensive guides to optimize your interview confidence."
    }
  ];

  return (
    <div className="relative w-full overflow-hidden bg-brand-bgLight dark:bg-brand-bg transition-colors duration-300">
      
      {/* Decorative Blur Overlays */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-brand-primary/10 dark:bg-brand-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-secondary/15 dark:bg-brand-secondary/5 blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[35%] h-[35%] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      {/* ─── Hero Section ─── */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-24 md:pt-32 md:pb-36 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 space-y-8 animate-slide-up text-left z-10">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold tracking-wide uppercase select-none animate-pulse-slow">
            <Sparkles className="h-4 w-4 text-brand-secondary" />
            Next-Gen Recruitment Platform
          </div>

          {/* Luxury Display Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold font-display leading-[1.1] tracking-tight text-brand-textMainLight dark:text-brand-textMain">
            Master Your Next <br />
            Career Opportunity with <br />
            <span className="text-gradient-sage">IntervuFlow</span>
          </h1>

          <p className="text-base md:text-lg text-brand-textMutedLight dark:text-brand-textMuted max-w-xl leading-relaxed">
            Bridge the gap between your resume and the interview room. Upload your resume for strict, metric-calibrated ATS auditing, then practice live with context-aware AI interviewers.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link 
              to="/register" 
              className="glow-btn-primary flex items-center justify-center gap-2 text-white font-bold py-3.5 px-8 rounded-xl w-full sm:w-auto text-sm transition-all"
            >
              Get Started for Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a 
              href="#services" 
              className="flex items-center justify-center gap-2 border border-brand-border dark:border-brand-border/40 hover:border-brand-primary/30 hover:bg-brand-primary/5 bg-transparent text-brand-textMainLight dark:text-brand-textMain font-semibold py-3.5 px-8 rounded-xl w-full sm:w-auto text-sm transition-all"
            >
              Explore Capabilities
            </a>
          </div>

          {/* Micro Trust Stats */}
          <div className="flex items-center gap-6 pt-4 border-t border-brand-border/40 dark:border-brand-border/10 max-w-md">
            <div className="flex -space-x-2">
              <div className="h-8 w-8 rounded-full bg-brand-primary/30 border border-brand-primary flex items-center justify-center text-[10px] font-bold">JD</div>
              <div className="h-8 w-8 rounded-full bg-brand-secondary/30 border border-brand-secondary flex items-center justify-center text-[10px] font-bold">AS</div>
              <div className="h-8 w-8 rounded-full bg-indigo-500/30 border border-indigo-400 flex items-center justify-center text-[10px] font-bold">ML</div>
            </div>
            <div className="text-xs text-brand-textMutedLight dark:text-brand-textMuted">
              <div className="flex items-center gap-1 text-brand-primary font-bold dark:text-brand-secondary">
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="ml-1 text-brand-textMainLight dark:text-brand-textMain">4.9/5</span>
              </div>
              <span>Trusted by 10,000+ candidates globally</span>
            </div>
          </div>
        </div>

        {/* Hero Preview Interactive Card */}
        <div className="flex-1 w-full lg:max-w-xl animate-fade-in z-10">
          <div className="luxury-glass-glow rounded-3xl p-6 md:p-8 relative border border-brand-border dark:border-brand-border/20 shadow-2xl animate-float">
            
            {/* Window controls */}
            <div className="flex items-center justify-between border-b border-brand-border/50 dark:border-brand-border/15 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full bg-brand-danger/30 border border-brand-danger/40 block" />
                <span className="h-3.5 w-3.5 rounded-full bg-brand-accent/30 border border-brand-accent/40 block" />
                <span className="h-3.5 w-3.5 rounded-full bg-brand-primary/30 border border-brand-primary/40 block" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-textMutedLight dark:text-brand-textMuted bg-brand-border/20 dark:bg-brand-bg/50 px-3 py-1 rounded-md border border-brand-border/40 dark:border-brand-border/10">
                IntervuFlow Dashboard
              </span>
            </div>

            {/* Simulated Workspace */}
            <div className="space-y-6">
              
              {/* Active Session Header Mockup */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-brand-textMainLight dark:text-brand-textMain leading-tight">Software Engineer Interview</h4>
                    <span className="text-[10px] text-brand-textMutedLight dark:text-brand-textMuted">Grade strictness: Extremely Strict</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-full border border-brand-primary/20 animate-pulse-slow">
                  Live Audit
                </span>
              </div>

              {/* Progress and scores grid */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Score gauge mockup */}
                <div className="p-4 rounded-2xl border border-brand-border dark:border-brand-border/10 bg-transparent dark:bg-brand-bg/30 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-textMutedLight dark:text-brand-textMuted">ATS Audit Index</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-black text-brand-primary font-display">89</span>
                    <span className="text-xs text-brand-textMutedLight dark:text-brand-textMuted">/100</span>
                  </div>
                  <div className="w-full bg-brand-border/40 dark:bg-brand-border/10 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-brand-primary h-full rounded-full" style={{ width: '89%' }} />
                  </div>
                </div>

                {/* Sub score mockup */}
                <div className="p-4 rounded-2xl border border-brand-border dark:border-brand-border/10 bg-transparent dark:bg-brand-bg/30 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-textMutedLight dark:text-brand-textMuted">STAR Metrics check</span>
                  <div className="flex items-center gap-1.5 mt-2">
                    <CheckCircle className="h-5 w-5 text-brand-primary" />
                    <span className="text-sm font-bold text-brand-textMainLight dark:text-brand-textMain">Validated</span>
                  </div>
                  <span className="text-[9px] text-brand-secondary font-semibold block mt-3">4 quantifiable keys found</span>
                </div>

              </div>

              {/* Tense check list mockup */}
              <div className="p-4 rounded-2xl border border-brand-border dark:border-brand-border/10 bg-transparent dark:bg-brand-bg/30 space-y-3 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-textMutedLight dark:text-brand-textMuted">Grammatical Audits</span>
                
                <div className="flex items-start gap-2 text-xs">
                  <AlertTriangle className="h-4 w-4 text-brand-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-brand-textMainLight dark:text-brand-textMain">Mixed Tense Flagged</span>
                    <p className="text-[10px] text-brand-textMutedLight dark:text-brand-textMuted leading-tight mt-0.5">
                      Bullet 3 in Past Role uses present continuous <span className="text-brand-accent font-semibold underline">"architecting"</span>.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* ─── Metrics Stats Bar ─── */}
      <section className="relative py-12 border-y border-brand-border/60 dark:border-brand-border/10 bg-brand-primary/5 dark:bg-brand-primary/5 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            
            <div className="text-center space-y-1">
              <h3 className="text-3xl md:text-4xl font-extrabold text-brand-primary font-display">98.4%</h3>
              <p className="text-xs md:text-sm font-semibold text-brand-textMutedLight dark:text-brand-textMuted">ATS Accuracy Match</p>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-3xl md:text-4xl font-extrabold text-brand-primary font-display">15,000+</h3>
              <p className="text-xs md:text-sm font-semibold text-brand-textMutedLight dark:text-brand-textMuted">Mock Sessions Conducted</p>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-3xl md:text-4xl font-extrabold text-brand-primary font-display">&lt; 0.4s</h3>
              <p className="text-xs md:text-sm font-semibold text-brand-textMutedLight dark:text-brand-textMuted">Real-Time Evaluation</p>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-3xl md:text-4xl font-extrabold text-brand-primary font-display">4.95 / 5</h3>
              <p className="text-xs md:text-sm font-semibold text-brand-textMutedLight dark:text-brand-textMuted">Candidate Rating</p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Services Features Section ─── */}
      <section id="services" className="relative max-w-7xl mx-auto px-6 md:px-12 py-24 z-10 scroll-mt-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
            Key Features
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-brand-textMainLight dark:text-brand-textMain">
            Unified Audit and Practice Platform
          </h2>
          <p className="text-base text-brand-textMutedLight dark:text-brand-textMuted">
            IntervuFlow combines advanced ATS compliance algorithms with highly adaptive AI interview rooms to deliver comprehensive evaluation insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className="luxury-glass-glow rounded-2xl p-8 border border-brand-border dark:border-brand-border/10 flex flex-col text-left space-y-6 group cursor-pointer"
              >
                <div className={`h-12 w-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center ${feature.color} transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-primary/20`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-3 flex-1">
                  <h3 className="text-lg font-bold text-brand-textMainLight dark:text-brand-textMain leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-brand-textMutedLight dark:text-brand-textMuted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:text-brand-secondary transition-colors cursor-pointer select-none">
                  Learn more <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Interactive ATS Scanner Simulator Section ─── */}
      <section id="playground" className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 mb-16 z-10">
        <div className="luxury-glass-glow rounded-3xl border border-brand-border dark:border-brand-border/15 p-8 md:p-12 relative overflow-hidden shadow-3xl">
          
          <div className="flex flex-col lg:flex-row items-center gap-12 relative z-20">
            
            {/* Description panel */}
            <div className="flex-1 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 border border-brand-primary/20 py-1 px-3 rounded-full animate-pulse-slow">
                Interactive Playground
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold font-display tracking-tight text-brand-textMainLight dark:text-brand-textMain leading-snug">
                Simulate Your First ATS Verification Check
              </h2>
              <p className="text-sm md:text-base text-brand-textMutedLight dark:text-brand-textMuted leading-relaxed">
                Click below to launch our sandbox scanner. Watch the AI parse a test software engineering resume template, excluding generic years, validating bullet tenses, and scoring quantifiable results.
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs">
                  <CheckCircle className="h-5 w-5 text-brand-primary shrink-0" />
                  <span className="text-brand-textMainLight dark:text-brand-textMain font-semibold">Tense-by-tense grammar evaluation</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <CheckCircle className="h-5 w-5 text-brand-primary shrink-0" />
                  <span className="text-brand-textMainLight dark:text-brand-textMain font-semibold">STAR metrics check (ignores generic years)</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <CheckCircle className="h-5 w-5 text-brand-primary shrink-0" />
                  <span className="text-brand-textMainLight dark:text-brand-textMain font-semibold">Checks for complete email, phone, LinkedIn & GitHub profiles</span>
                </div>
              </div>

              {playState === 'idle' && (
                <button
                  onClick={handleStartScan}
                  className="glow-btn-primary flex items-center justify-center gap-2 text-white font-bold py-3.5 px-8 rounded-xl text-sm transition-all"
                >
                  Analyze Test Resume Template
                  <Play className="h-4 w-4 fill-white" />
                </button>
              )}

              {playState === 'completed' && (
                <button
                  onClick={handleResetScan}
                  className="flex items-center justify-center gap-2 border border-brand-border dark:border-brand-border/40 hover:border-brand-danger/30 hover:bg-brand-danger/10 text-brand-textMainLight dark:text-brand-textMain font-bold py-3.5 px-8 rounded-xl text-sm transition-all"
                >
                  Reset Simulator Workspace
                </button>
              )}
            </div>

            {/* Sandbox scanner screen */}
            <div className="flex-1 w-full max-w-xl">
              <div className="relative rounded-2xl border border-brand-border dark:border-brand-border/10 bg-black/40 backdrop-blur-md p-6 h-[380px] flex flex-col justify-between overflow-hidden">
                
                {/* Visual scanner sweep lines during scan state */}
                {playState === 'scanning' && <div className="scanner-line" />}

                {/* Simulator State: Idle */}
                {playState === 'idle' && (
                  <div className="m-auto text-center space-y-4 max-w-xs animate-scale-in">
                    <div className="h-16 w-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mx-auto animate-bounce">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-brand-textMainLight dark:text-brand-textMain">test_resume_template.pdf</h4>
                      <p className="text-xs text-brand-textMutedLight dark:text-brand-textMuted">Format: PDF document (14 KB)</p>
                    </div>
                    <p className="text-[11px] text-brand-textMutedLight dark:text-brand-textMuted italic leading-relaxed">
                      "Preloaded Software Developer template containing some common metrics, calendar years, and grammatical tense discrepancies."
                    </p>
                  </div>
                )}

                {/* Simulator State: Scanning */}
                {playState === 'scanning' && (
                  <div className="w-full h-full flex flex-col justify-between py-4 text-left font-mono">
                    
                    {/* Shell-like scanner outputs */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-brand-primary font-bold">
                        <Terminal className="h-4 w-4" />
                        <span>INTERVUFLOW SCAN TERMINAL v1.0</span>
                      </div>
                      
                      <div className="w-full bg-brand-border/30 dark:bg-brand-border/15 h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-primary h-full transition-all duration-100" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-brand-textMutedLight dark:text-brand-textMuted">
                        <span>SCANNING PROGRESS</span>
                        <span>{progress}%</span>
                      </div>
                    </div>

                    {/* Active parser logging logs */}
                    <div className="flex-1 flex flex-col justify-center text-xs space-y-2 text-brand-textMainLight dark:text-brand-textMain">
                      <div className="py-2.5 px-3 rounded-lg bg-white/5 border border-white/10 text-left animate-pulse-slow">
                        <span className="text-brand-primary font-semibold mr-1">&gt;</span>
                        {scanLog}
                      </div>
                    </div>

                    <span className="text-[10px] text-brand-textMutedLight dark:text-brand-textMuted uppercase tracking-wider text-right">
                      analyzing STAR metrics bullet-by-bullet...
                    </span>
                  </div>
                )}

                {/* Simulator State: Completed */}
                {playState === 'completed' && (
                  <div className="w-full h-full flex flex-col justify-between text-left animate-scale-in">
                    
                    {/* Score Summary Banner */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                          <Award className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-brand-textMainLight dark:text-brand-textMain leading-tight">ATS Audit Score</h4>
                          <span className="text-[9px] text-brand-textMutedLight dark:text-brand-textMuted">Strict validation applied</span>
                        </div>
                      </div>
                      
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-2xl font-black text-brand-primary font-display leading-none">86</span>
                        <span className="text-[10px] text-brand-textMutedLight dark:text-brand-textMuted font-bold">/100</span>
                      </div>
                    </div>

                    {/* Detailed findings breakdown */}
                    <div className="flex-1 overflow-y-auto my-3.5 pr-1 space-y-2.5 custom-scrollbar">
                      
                      {/* Metric Check result */}
                      <div className="flex items-start gap-2.5 text-[11px] p-2 rounded-lg bg-white/5 border border-white/5">
                        <CheckCircle className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-brand-textMainLight dark:text-brand-textMain">STAR Quantifiable Metrics (Validated)</span>
                          <p className="text-[10px] text-brand-textMutedLight dark:text-brand-textMuted leading-tight mt-0.5">
                            Identified real metrics ("increased query speeds by 30%"). Implicity ignored standard years ("2023").
                          </p>
                        </div>
                      </div>

                      {/* Tense Check error */}
                      <div className="flex items-start gap-2.5 text-[11px] p-2 rounded-lg bg-brand-accent/5 border border-brand-accent/25">
                        <AlertTriangle className="h-4 w-4 text-brand-accent shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-brand-accent">Mixed Tenses Conflict (1 warning)</span>
                          <p className="text-[10px] text-brand-textMutedLight dark:text-brand-textMuted leading-tight mt-0.5">
                            In Past Role, bullet 3 uses present continuous <span className="font-bold underline">"deploying"</span> instead of past tense <span className="font-bold underline">"deployed"</span>.
                          </p>
                        </div>
                      </div>

                      {/* Portfolio Check result */}
                      <div className="flex items-start gap-2.5 text-[11px] p-2 rounded-lg bg-white/5 border border-white/5">
                        <CheckCircle className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-brand-textMainLight dark:text-brand-textMain">Contact Credentials (Validated)</span>
                          <p className="text-[10px] text-brand-textMutedLight dark:text-brand-textMuted leading-tight mt-0.5">
                            Successfully parsed candidate email, mobile, and premium GitHub repository links.
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* CTA suggestion */}
                    <div className="flex items-center justify-between border-t border-brand-border/40 dark:border-brand-border/10 pt-3">
                      <span className="text-[9px] text-brand-textMutedLight dark:text-brand-textMuted font-mono">CODE: INTERVU_AUDIT_SUCCESS</span>
                      <Link 
                        to="/register" 
                        className="inline-flex items-center gap-1 text-[10px] font-extrabold text-brand-primary hover:text-brand-secondary transition-colors"
                      >
                        Optimize Your Real Resume <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── Timeline / Roadmap Section ─── */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 z-10 border-t border-brand-border/40 dark:border-brand-border/10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
            Our Flow
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-brand-textMainLight dark:text-brand-textMain">
            How IntervuFlow Accelerates You
          </h2>
          <p className="text-base text-brand-textMutedLight dark:text-brand-textMuted">
            A seamless cycle of auditing, target calibration, realistic practice, and precise metrics feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="relative p-6 rounded-2xl border border-brand-border dark:border-brand-border/10 bg-transparent text-left space-y-4 hover:border-brand-primary/20 transition-all duration-300"
            >
              <div className="text-4xl font-extrabold text-brand-primary/20 font-display">
                {step.num}
              </div>
              <h3 className="text-lg font-bold text-brand-textMainLight dark:text-brand-textMain">
                {step.title}
              </h3>
              <p className="text-xs md:text-sm text-brand-textMutedLight dark:text-brand-textMuted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Call-To-Action Banner ─── */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 z-10">
        <div className="relative rounded-3xl overflow-hidden py-16 px-8 md:p-16 border border-brand-primary/20 text-center space-y-8 bg-gradient-to-r from-brand-primary/10 via-brand-secondary/5 to-brand-primary/15 shadow-2xl">
          
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30 pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-brand-textMainLight dark:text-brand-textMain">
              Ready to Upgrade Your Interview Performance?
            </h2>
            <p className="text-sm md:text-base text-brand-textMutedLight dark:text-brand-textMuted leading-relaxed max-w-lg mx-auto">
              Unlock a strict ATS evaluator dashboard, identify hidden grammar conflicts, and gain the mock interview practice required to secure top role offers.
            </p>
            <div className="pt-2">
              <Link 
                to="/register" 
                className="glow-btn-primary inline-flex items-center justify-center gap-2 text-white font-bold py-4 px-10 rounded-xl text-sm transition-all"
              >
                Create Your Account Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ─── Luxury Footer ─── */}
      <footer className="relative border-t border-brand-border/60 dark:border-brand-border/10 py-12 bg-black/20 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <svg className="h-6 w-6 text-brand-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 12C4 7.58172 7.58172 4 12 4C14.5 4 16.5 5.5 18 7.5M20 12C20 16.4183 16.4183 20 12 20C9.5 20 7.5 18.5 6 16.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
            <span className="text-lg font-extrabold font-display text-brand-textMainLight dark:text-brand-textMain">
              Intervu<span className="text-brand-primary">Flow</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-xs text-brand-textMutedLight dark:text-brand-textMuted">
            <a href="#services" className="hover:text-brand-primary transition-colors">Services</a>
            <a href="#playground" className="hover:text-brand-primary transition-colors">ATS Scanner</a>
            <a href="/login" className="hover:text-brand-primary transition-colors">Sign In</a>
            <a href="/register" className="hover:text-brand-primary transition-colors">Get Started</a>
          </div>

          {/* Copyright */}
          <div className="text-xs text-brand-textMutedLight dark:text-brand-textMuted">
            &copy; {new Date().getFullYear()} IntervuFlow. Designed for modern professionals.
          </div>

        </div>
      </footer>

    </div>
  );
}
