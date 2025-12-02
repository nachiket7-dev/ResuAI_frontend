import { Zap } from "lucide-react";
import React from "react";
import Title from "./Title";

const Features = () => {
  const [isHover, setIsHover] = React.useState(false);
  return (
    <div
      id="features"
      className="flex flex-col items-center my-16 scroll-mt-20 text-zinc-900 dark:text-white"
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 rounded-full px-3 py-1 border border-indigo-100 dark:border-indigo-800 mb-2">
        <Zap width={12} className="size-3 stroke-indigo-700" />
        <span>Simple Process</span>
      </div>
      <Title
        title="Build your Resume"
        description="Our streamlined process helps you create a professional resume in minutes with intelligent AI-powered tools and features."
      />

      <div className="flex flex-col md:flex-row items-center justify-center xl:-mt-10 w-full max-w-6xl px-4">
        <img
          className="max-w-xl w-full xl:-ml-20 drop-shadow-md rounded-lg"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png"
          alt="Features Preview"
        />
        <div
          className="px-4 md:px-0 w-full max-w-md space-y-4"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <div
            className={
              "flex items-center gap-6 group cursor-pointer"
            }
          >
            <div
              className={`p-5 w-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/10 border border-transparent group-hover:border-indigo-200 dark:group-hover:border-indigo-900/50 flex gap-4 rounded-lg transition-all duration-300 ${
                !isHover ? "border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/50 dark:bg-indigo-900/5" : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800"
              }`}
            >
              <div className="p-2 bg-white dark:bg-zinc-800 rounded-md shadow-sm h-fit border border-zinc-100 dark:border-zinc-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5 stroke-indigo-600"
                >
                  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Real-Time Analytics
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Get instant insights into your finances with live dashboards.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 group cursor-pointer">
            <div className="p-5 w-full group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/10 border border-transparent group-hover:border-emerald-200 dark:group-hover:border-emerald-900/50 flex gap-4 rounded-lg transition-all duration-300 bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:shadow-sm">
              <div className="p-2 bg-white dark:bg-zinc-800 rounded-md shadow-sm h-fit border border-zinc-100 dark:border-zinc-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5 stroke-emerald-600"
                >
                  <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Bank-Grade Security
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  End-to-end encryption, 2FA, compliance with GDPR standards.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 group cursor-pointer">
            <div className="p-5 w-full group-hover:bg-amber-50 dark:group-hover:bg-amber-900/10 border border-transparent group-hover:border-amber-200 dark:group-hover:border-amber-900/50 flex gap-4 rounded-lg transition-all duration-300 bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:shadow-sm">
              <div className="p-2 bg-white dark:bg-zinc-800 rounded-md shadow-sm h-fit border border-zinc-100 dark:border-zinc-700">
                <svg
                  className="size-5 stroke-amber-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 15V3" />
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="m7 10 5 5 5-5" />
                </svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  Customizable Reports
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Export professional, audit-ready financial reports for tax or
                  internal review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
