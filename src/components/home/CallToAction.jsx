import React from "react";

const CallToAction = () => {
  return (
    <section
      id="cta"
      className="max-w-5xl mx-auto px-10 sm:px-16 mt-28 py-12 border border-indigo-500/20 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 dark:from-indigo-900 dark:via-violet-900 dark:to-indigo-800 text-white dark:text-white shadow-xl shadow-indigo-500/20"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <p className="text-2xl md:text-3xl font-bold max-w-lg leading-tight">
          Build a professional resume that helps you stand out and get hired.
        </p>
        <a
          href="/app"
          className="flex items-center gap-2 rounded-md px-8 py-3.5 bg-white dark:bg-zinc-950 text-indigo-600 dark:text-indigo-300 font-semibold shadow-sm hover:bg-indigo-50 dark:hover:bg-zinc-900 transition hover:-translate-y-0.5"
        >
          <span>Get started</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default CallToAction;
