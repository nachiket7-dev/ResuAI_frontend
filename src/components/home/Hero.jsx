import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { Moon, Sun } from "lucide-react";

const Hero = () => {
  const {user} = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = React.useState(false);



  return (
    <div className="relative min-h-screen overflow-hidden text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Main dark gradient background */}
        <div className="absolute inset-0 bg-white dark:bg-[#020204] transition-colors duration-300"></div>
        
        {/* Bottom Glow Effect (Reference Image) - Using inline style for reliability */}
        <div 
          className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[140%] h-[80%] opacity-100 dark:opacity-100 blur-[100px] transition-opacity duration-500"
          style={{
            background: 'radial-gradient(ellipse at bottom, rgba(79, 70, 229, 0.4) 0%, rgba(124, 58, 237, 0.2) 30%, transparent 70%)'
          }}
        ></div>
        
        {/* Dark Mode Specific Intense Glow (to match reference "spotlight") */}
        <div 
          className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[100%] h-[60%] opacity-0 dark:opacity-100 blur-[80px] transition-opacity duration-500 mix-blend-screen"
          style={{
            background: 'radial-gradient(ellipse at bottom, rgba(99, 102, 241, 0.6) 0%, rgba(139, 92, 246, 0.3) 40%, transparent 80%)'
          }}
        ></div>

        {/* Top subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/5 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="size-9 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
            R
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            Resu AI
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.4em] text-zinc-500 dark:text-zinc-400 font-medium">
          <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition hover:-translate-y-px">Features</a>
          <a href="#testimonials" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition hover:-translate-y-px">Testimonials</a>
          <a href="#cta" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition hover:-translate-y-px">Contact</a>
        </div>
        <div className="hidden md:flex gap-3 items-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
          {!user && (
            <>
              <Link
                to="/app?state=register"
                className="px-5 py-2 rounded-md bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm transition hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:-translate-y-0.5 text-sm font-medium"
              >
                Get started
              </Link>
              <Link to="/app?state=login" className="px-5 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition text-sm font-medium">
                Login
              </Link>
            </>
          )}
          {user && (
            <Link to="/app" className="px-5 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition text-sm font-medium">
              Dashboard
            </Link>
          )}
        </div>
        <button onClick={() => setMenuOpen(true)} className="md:hidden border border-zinc-200 dark:border-zinc-800 rounded-md p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="relative px-4 md:px-10 lg:px-20 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
            AI Resume Studio
          </p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-zinc-900 dark:text-white tracking-tight">
            Land your dream job with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 animate-[pulseGlow_5s_ease-in-out_infinite]">AI-powered</span> resumes.
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Build, customize, and download modern resumes with smart prompts, polished templates, and Instant ImageKit uploads.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/app"
              className="flex items-center gap-2 px-8 py-3 rounded-md bg-indigo-600 text-white shadow-md transition hover:bg-indigo-700 hover:-translate-y-0.5 font-medium"
            >
              Get started
              <span className="text-sm">→</span>
            </Link>
            <button className="flex items-center gap-2 px-6 py-3 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition hover:-translate-y-0.5 font-medium bg-white/50 dark:bg-zinc-900/50">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path>
                <rect x="2" y="6" width="14" height="12" rx="2"></rect>
              </svg>
              Try demo
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-zinc-500 text-xs font-medium pt-4">
            <span>Trusted by 10,000+ creators</span>
            <span className="text-zinc-300">·</span>
            <span>Powered by ImageKit, MongoDB, OpenAI</span>
          </div>
        </div>


      </div>

      <div
        className={`fixed inset-0 z-50 bg-zinc-900/95 dark:bg-zinc-950/95 backdrop-blur-md text-white flex flex-col items-center justify-center gap-6 transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <a href="#features" className="uppercase tracking-[0.4em] text-sm font-medium hover:text-indigo-400 dark:hover:text-indigo-300 transition">Features</a>
        <a href="#testimonials" className="uppercase tracking-[0.4em] text-sm font-medium hover:text-indigo-400 dark:hover:text-indigo-300 transition">Testimonials</a>
        <a href="#cta" className="uppercase tracking-[0.4em] text-sm font-medium hover:text-indigo-400 dark:hover:text-indigo-300 transition">Contact</a>
        <button onClick={() => setMenuOpen(false)} className="px-8 py-2 rounded-md border border-white/20 dark:border-white/10 hover:bg-white/10 dark:hover:bg-white/5 transition mt-4">
          Close
        </button>
      </div>
    </div>
  );
};

export default Hero;
