import { FileCheck2, LockKeyhole, MousePointer2, Sparkles } from 'lucide-react';
import React from 'react';

const principles = [
  {icon: MousePointer2, title: 'Visible by default', description: 'Every improvement appears in the live document, so you stay in control of the final story.'},
  {icon: FileCheck2, title: 'Built for readability', description: 'Clear hierarchy and intentional spacing keep the resume easy for people and systems to scan.'},
  {icon: LockKeyhole, title: 'Private until you share', description: 'Keep drafts private while you shape them, then share a clean public version when ready.'},
];

const Testimonial = () => <section id="testimonials" className="bg-white px-5 py-24 sm:px-8 lg:px-10 lg:py-32"><div className="mx-auto grid max-w-7xl items-end gap-12 lg:grid-cols-[0.75fr_1.25fr]"><div className="animate-rise-in"><div className="flex size-12 items-center justify-center rounded-2xl bg-green-100 text-green-800"><Sparkles className="size-5" /></div><p className="mt-8 text-xs font-semibold uppercase tracking-[0.22em] text-green-700">Why it feels different</p><h2 className="mt-4 max-w-md text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">A calmer way to make a strong first impression.</h2><p className="mt-5 max-w-md text-base leading-7 text-slate-600">ResuAI brings the words, the structure, and the final polish into one place—without turning your resume into a design project.</p></div><div className="grid gap-3 sm:grid-cols-3 lg:pb-2">{principles.map(({icon: Icon, title, description}) => <div key={title} className="interactive-card rounded-2xl border border-slate-200 bg-[#fbfaf6] p-5">{React.createElement(Icon, {className: 'size-5 text-green-700'})}<h3 className="mt-8 text-sm font-semibold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p></div>)}</div></div></section>;

export default Testimonial;
