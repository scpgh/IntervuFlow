import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart2,
  ChevronRight,
  FileText,
  MessageSquare,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
  UserCheck,
  Wand2
} from 'lucide-react';

export default function Landing() {
  const [playState, setPlayState] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [scanLog, setScanLog] = useState('Ready to calibrate role, resume, and interview signals.');

  const logs = [
    'Reading resume structure and role intent...',
    'Scoring STAR evidence and measurable outcomes...',
    'Checking portfolio, contact, and project credibility...',
    'Building interview probes from candidate context...',
    'Preparing precision feedback dashboard...',
    'Interview readiness profile completed.'
  ];

  useEffect(() => {
    let timer;
    if (playState === 'scanning') {
      setProgress(0);
      setScanLog(logs[0]);

      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setPlayState('completed');
            setScanLog(logs[logs.length - 1]);
            return 100;
          }

          const next = prev + 5;
          const index = Math.min(Math.floor((next / 100) * logs.length), logs.length - 1);
          setScanLog(logs[index]);
          return next;
        });
      }, 110);
    }

    return () => clearInterval(timer);
  }, [playState]);

  const features = [
    {
      icon: FileText,
      title: 'Resume Signal Audit',
      description: 'Detect weak bullets, missing proof, ATS issues, and role-fit gaps before recruiters ever see them.'
    },
    {
      icon: MessageSquare,
      title: 'Adaptive Interview Rooms',
      description: 'Practice with context-aware follow-ups that respond to your resume, target role, and answer quality.'
    },
    {
      icon: BarChart2,
      title: 'Executive Feedback View',
      description: 'Review scores, improvement priorities, grammar flags, and interview patterns in one polished dashboard.'
    }
  ];

  const steps = [
    ['01', 'Upload', 'Bring in your resume and target role.'],
    ['02', 'Calibrate', 'Tune strictness, domain, and session format.'],
    ['03', 'Practice', 'Answer realistic prompts with adaptive follow-ups.'],
    ['04', 'Improve', 'Use focused feedback to refine your next attempt.']
  ];

  const startScan = () => {
    setPlayState('scanning');
  };

  const resetScan = () => {
    setPlayState('idle');
    setProgress(0);
    setScanLog('Ready to calibrate role, resume, and interview signals.');
  };

  return (
    <div className="relative w-full overflow-hidden bg-transparent">
      <section className="relative mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl grid-cols-1 items-center gap-14 px-6 pb-20 pt-16 md:px-12 lg:grid-cols-[0.9fr_1.1fr] lg:pt-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent" />

        <div className="relative z-10 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/20 bg-black/5 px-4 py-2 text-sm font-bold text-brand-textMain shadow-glass backdrop-blur-xl dark:bg-white/5">
            <Sparkles className="h-4 w-4 text-brand-primary" />
            Premium AI interview preparation
          </div>

          <div className="space-y-6">
            <h1 className="max-w-3xl font-display text-5xl font-bold leading-[0.95] text-brand-textMain md:text-7xl lg:text-8xl">
              Interview readiness, crafted like a private career studio.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-brand-textMuted md:text-lg">
              IntervuFlow blends resume auditing, role-aware mock interviews, and performance analytics into a refined workspace for candidates who want sharper answers and stronger offers.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="glow-btn-primary inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">
              Start your prep
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#services" className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-border bg-black/5 px-7 py-3.5 text-sm font-bold text-brand-textMain transition-all hover:border-brand-primary/30 hover:bg-brand-primary/10 dark:bg-white/5">
              View platform
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid max-w-xl grid-cols-3 gap-4 border-t border-brand-border pt-6">
            {[
              ['98%', 'ATS clarity'],
              ['4.9', 'prep rating'],
              ['24/7', 'AI practice']
            ].map(([value, label]) => (
              <div key={label}>
                <div className="font-display text-3xl font-bold text-brand-primary">{value}</div>
                <div className="mt-1 text-xs font-semibold text-brand-textMuted">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="rounded-[2rem] border border-brand-border/80 bg-black/80 p-4 shadow-2xl dark:bg-black/70">
            <div className="rounded-[1.5rem] border border-white/10 bg-[#050505] p-5 md:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full bg-brand-primary" />
                  <span className="h-3.5 w-3.5 rounded-full bg-brand-secondary" />
                  <span className="h-3.5 w-3.5 rounded-full bg-brand-accent" />
                </div>
                <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold text-white/70">
                  Live workspace
                </span>
              </div>

              <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
                <div className="space-y-4">
                  {[
                    ['Resume Score', '92', ShieldCheck],
                    ['Role Fit', 'Strong', UserCheck],
                    ['Answer Clarity', '8.7', Wand2]
                  ].map(([label, value, Icon]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                      <div className="mb-5 flex items-center justify-between text-white">
                        <span className="text-sm font-bold">{label}</span>
                        <Icon className="h-5 w-5 text-brand-secondary" />
                      </div>
                      <div className="flex items-end gap-2">
                        <span className="font-display text-4xl font-bold text-brand-primary">{value}</span>
                        <span className="pb-1 text-xs font-semibold text-white/45">indexed</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-brand-accent/10 to-brand-secondary/10 p-5">
                  <div className="mb-5 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Candidate command center</h3>
                      <p className="mt-1 text-sm text-white/45">Resume, interview, and analytics pipeline</p>
                    </div>
                    <Sparkles className="h-6 w-6 text-brand-primary" />
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-black/55 p-5">
                    <div className="mb-5 rounded-2xl bg-gradient-to-br from-brand-primary/70 via-brand-accent/55 to-brand-secondary/70 p-4">
                      <div className="rounded-xl bg-black/70 p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-xs font-bold text-white/60">Frontend Engineer</span>
                          <span className="rounded-full bg-brand-primary px-3 py-1 text-xs font-bold text-black">Ready</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 rounded-full bg-white/60" />
                          <div className="h-2 w-4/5 rounded-full bg-white/30" />
                          <div className="h-2 w-2/3 rounded-full bg-white/20" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {['ATS', 'STAR', 'Voice'].map((item) => (
                        <div key={item} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center text-xs font-bold text-white/70">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-brand-border/70 bg-black/[0.03] py-8 backdrop-blur-sm dark:bg-white/[0.025]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 md:grid-cols-3 md:px-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="luxury-glass-glow rounded-2xl p-6 text-left">
                <Icon className="mb-5 h-7 w-7 text-brand-primary" />
                <h3 className="text-xl font-bold text-brand-textMain">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-brand-textMuted">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="services" className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-24 md:px-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6 text-left">
          <span className="inline-flex rounded-full border border-brand-primary/20 bg-brand-primary/10 px-4 py-2 text-xs font-bold uppercase text-brand-primary">
            Interactive platform
          </span>
          <h2 className="font-display text-4xl font-bold leading-tight text-brand-textMain md:text-6xl">
            A polished flow from resume proof to interview confidence.
          </h2>
          <p className="max-w-xl text-base leading-8 text-brand-textMuted">
            The experience is built around repeated practice: upload, calibrate, answer, review, and return sharper every time.
          </p>
        </div>

        <div className="luxury-glass-glow rounded-[2rem] p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-brand-border pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-primary/20 bg-brand-primary/10 text-brand-primary">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-textMain">Readiness scan</h3>
                <p className="text-xs font-semibold text-brand-textMuted">Strict candidate evaluation</p>
              </div>
            </div>
            <span className="font-display text-3xl font-bold text-brand-primary">{progress}%</span>
          </div>

          <div className="relative mb-6 h-2 overflow-hidden rounded-full bg-brand-border">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-secondary transition-all duration-150" style={{ width: `${progress}%` }} />
          </div>

          <div className="min-h-[150px] rounded-2xl border border-brand-border bg-black/5 p-5 font-mono text-sm leading-7 text-brand-textMain dark:bg-black/35">
            <span className="text-brand-primary">&gt;</span> {scanLog}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {playState !== 'scanning' && playState !== 'completed' && (
              <button onClick={startScan} className="glow-btn-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold">
                Run sample scan
                <Play className="h-4 w-4 fill-current" />
              </button>
            )}
            {playState === 'completed' && (
              <button onClick={resetScan} className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-border px-6 py-3 text-sm font-bold text-brand-textMain transition-all hover:border-brand-primary/30 hover:bg-brand-primary/10">
                Reset scan
              </button>
            )}
            <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-border px-6 py-3 text-sm font-bold text-brand-textMain transition-all hover:border-brand-primary/30 hover:bg-brand-primary/10">
              Analyze my resume
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-12">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {steps.map(([num, title, text]) => (
            <div key={num} className="border-t border-brand-border pt-6 text-left">
              <div className="font-display text-4xl font-bold text-brand-primary/80">{num}</div>
              <h3 className="mt-4 text-lg font-bold text-brand-textMain">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-brand-textMuted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 md:px-12">
        <div className="overflow-hidden rounded-[2rem] border border-brand-primary/20 bg-black px-6 py-14 text-center shadow-2xl dark:bg-black/70 md:px-12">
          <div className="mx-auto mb-5 flex w-max items-center gap-1 text-brand-primary">
            {[1, 2, 3, 4, 5].map((item) => (
              <Star key={item} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-6xl">
            Make every answer sound prepared, specific, and calm.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55 md:text-base">
            Create an account to start a complete preparation loop with resume analysis, mock interviews, and performance feedback.
          </p>
          <Link to="/register" className="glow-btn-primary mt-8 inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold">
            Build my interview plan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-brand-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 text-sm text-brand-textMuted md:flex-row md:px-12">
          <div className="flex items-center gap-2 font-bold text-brand-textMain">
            <Sparkles className="h-5 w-5 text-brand-primary" />
            IntervuFlow
          </div>
          <div className="flex items-center gap-6">
            <a href="#services" className="transition-colors hover:text-brand-primary">Platform</a>
            <Link to="/login" className="transition-colors hover:text-brand-primary">Sign in</Link>
            <Link to="/register" className="transition-colors hover:text-brand-primary">Get started</Link>
          </div>
          <div>© {new Date().getFullYear()} IntervuFlow.</div>
        </div>
      </footer>
    </div>
  );
}
