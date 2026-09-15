import { ArrowUpRight } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => <footer className="border-t border-slate-200 bg-[#f7f7f2] px-5 py-10 sm:px-8 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"><div><Link to="/" className="inline-block transition hover:-translate-y-0.5"><img src="/logo.svg" alt="ResuAI" className="h-9 w-auto" /></Link><p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">A focused workspace for writing, tailoring, and sharing resumes you feel good about.</p></div><div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-600"><a href="#features" className="transition hover:text-green-800">Workflow</a><a href="#testimonials" className="transition hover:text-green-800">Principles</a><Link to="/app?state=register" className="inline-flex items-center gap-1 text-green-800 transition hover:gap-2">Open studio <ArrowUpRight className="size-3.5" /></Link></div><p className="text-xs text-slate-400 sm:text-right">© 2026 ResuAI<br />Made for confident applications</p></div></footer>;

export default Footer;
