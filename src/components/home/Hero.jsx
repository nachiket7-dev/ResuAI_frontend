import React from 'react';
import { ArrowRight, ArrowUpRight, Check, FileText, Gauge, Menu, Sparkles, WandSparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResumeArtifact = () => (
  <div className="relative mx-auto w-full max-w-[34rem]">
    <div className="paper-grid absolute -inset-8 rounded-[2.5rem] opacity-60" />
    <div className="relative rounded-[2rem] border border-white/80 bg-white/70 p-3 shadow-[0_35px_90px_rgba(20,83,45,0.18)] backdrop-blur-sm sm:p-4">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-[#f8faf7] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-green-700 text-white"><FileText className="size-4" /></span>
          <div><p className="text-[11px] font-semibold text-slate-900">Product designer.pdf</p><p className="text-[10px] text-slate-500">Live workspace</p></div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-semibold text-green-800"><span className="size-1.5 rounded-full bg-green-600" /> Saved</span>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
        <div className="resume-paper rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
            <div><div className="h-3 w-28 rounded-full bg-slate-900" /><div className="mt-2 h-2 w-20 rounded-full bg-green-600" /><div className="mt-3 h-1.5 w-32 rounded-full bg-slate-200" /></div>
            <div className="size-10 rounded-full bg-gradient-to-br from-green-200 to-emerald-500" />
          </div>
          <div className="mt-5 space-y-4">
            <div><div className="mb-2 h-1.5 w-16 rounded-full bg-green-600" /><div className="space-y-1.5"><div className="h-1.5 w-full rounded-full bg-slate-200" /><div className="h-1.5 w-11/12 rounded-full bg-slate-200" /><div className="h-1.5 w-4/5 rounded-full bg-slate-200" /></div></div>
            <div><div className="mb-2 h-1.5 w-20 rounded-full bg-slate-900" /><div className="space-y-1.5"><div className="h-1.5 w-full rounded-full bg-slate-200" /><div className="h-1.5 w-10/12 rounded-full bg-slate-200" /><div className="h-1.5 w-9/12 rounded-full bg-slate-200" /></div></div>
            <div className="flex flex-wrap gap-1.5"><span className="rounded-full bg-green-100 px-2 py-1 text-[8px] font-semibold text-green-800">Figma</span><span className="rounded-full bg-green-100 px-2 py-1 text-[8px] font-semibold text-green-800">Research</span><span className="rounded-full bg-slate-100 px-2 py-1 text-[8px] font-semibold text-slate-500">Strategy</span></div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-green-800">ATS readiness</span><Gauge className="size-4 text-green-700" /></div>
            <div className="mt-3 flex items-end gap-2"><span className="text-3xl font-semibold tracking-tight text-green-950">86</span><span className="pb-1 text-[10px] font-medium text-green-700">/ 100</span></div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-green-200"><div className="h-full w-[86%] rounded-full bg-green-700" /></div>
            <p className="mt-2 text-[10px] text-green-800">Strong match for your target role</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-[#fbfaf6] p-4 shadow-sm">
            <div className="flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700"><WandSparkles className="size-3.5" /></span><span className="text-[10px] font-semibold text-slate-800">AI suggestion</span></div>
            <p className="mt-3 text-[11px] leading-5 text-slate-600">Make your impact clearer by adding the outcome of this project.</p>
            <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-green-700">Review suggestion <ArrowUpRight className="size-3" /></span>
          </div>
        </div>
      </div>
    </div>
    <div className="animate-float absolute -right-2 -top-5 hidden rounded-2xl border border-white bg-white px-3 py-2 shadow-xl sm:flex sm:items-center sm:gap-2"><span className="flex size-7 items-center justify-center rounded-lg bg-green-100 text-green-700"><Sparkles className="size-3.5" /></span><span className="text-[10px] font-semibold text-slate-700">Tailored in real time</span></div>
  </div>
);

const Hero = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navItems = [['Workflow', '#features'], ['Why ResuAI', '#testimonials'], ['Get started', '#cta']];

  return (
    <section className="landing-surface relative isolate overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-24 -z-10 size-[32rem] -translate-x-1/2 rounded-full bg-green-200/45 blur-[110px]" />
      <nav className="animate-fade-in relative z-50 mx-auto flex max-w-7xl items-center justify-between border-b border-slate-200/70 px-5 py-5 sm:px-8 lg:px-10">
        <Link to="/" className="transition hover:-translate-y-0.5"><img src="/logo.svg" alt="ResuAI home" className="h-10 w-auto" /></Link>
        <div className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          {navItems.map(([label, href]) => <a key={label} href={href} className="transition hover:text-green-800">{label}</a>)}
        </div>
        <div className="hidden items-center gap-3 md:flex"><Link to="/app?state=login" className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900">Log in</Link><Link to="/app?state=register" className="glow-button rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800">Open studio <ArrowUpRight className="ml-1 inline size-3.5" /></Link></div>
        <button type="button" onClick={() => setMenuOpen((open) => !open)} className="rounded-xl p-2 text-slate-700 hover:bg-white md:hidden" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen}>{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
        {menuOpen && <div className="animate-popover absolute left-4 right-4 top-[calc(100%-0.25rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl md:hidden">{navItems.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-green-50">{label}</a>)}<Link to="/app?state=login" onClick={() => setMenuOpen(false)} className="mt-2 block rounded-xl bg-green-700 px-3 py-3 text-center text-sm font-semibold text-white">Open studio</Link></div>}
      </nav>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-16 sm:px-8 sm:pt-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:px-10 lg:pb-32 lg:pt-24">
        <div className="relative z-10">
          <div className="animate-rise-in inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-green-800"><span className="size-1.5 rounded-full bg-green-600" /> The resume studio</div>
          <h1 className="animate-rise-in mt-7 max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl" style={{animationDelay: '90ms'}}>A sharper resume for your <span className="text-green-700">next move.</span></h1>
          <p className="animate-rise-in mt-7 max-w-lg text-base leading-7 text-slate-600 sm:text-lg" style={{animationDelay: '170ms'}}>Write with clarity, tailor with confidence, and leave with a resume that feels unmistakably yours.</p>
          <div className="animate-rise-in mt-9 flex flex-wrap items-center gap-3" style={{animationDelay: '250ms'}}><Link to="/app?state=register" className="glow-button inline-flex items-center gap-2 rounded-full bg-green-700 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-green-800">Build your resume <ArrowRight className="size-4" /></Link><a href="#features" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-green-300 hover:bg-white">See how it works</a></div>
          <div className="animate-fade-in mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-500" style={{animationDelay: '350ms'}}><span className="flex items-center gap-2"><Check className="size-3.5 text-green-700" /> Guided writing</span><span className="flex items-center gap-2"><Check className="size-3.5 text-green-700" /> Role-ready layouts</span><span className="flex items-center gap-2"><Check className="size-3.5 text-green-700" /> Clean PDF export</span></div>
        </div>
        <div className="animate-slide-right lg:pl-4"><ResumeArtifact /></div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 pb-8 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 sm:px-8 lg:px-10"><span className="h-px w-10 bg-slate-300" /> One focused workspace for the whole application process</div>
    </section>
  );
};

export default Hero;
