import React from "react";

const Banner = () => {
  return (
    <div className="animate-fade-in w-full border-b border-green-200/70 bg-gradient-to-r from-green-100 via-emerald-50 to-white py-2.5 text-center text-sm font-medium text-green-800">
      <p className="flex items-center justify-center gap-2">
        <span className="rounded-full bg-green-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">New</span>
        AI writing and job matching are now in your workspace
      </p>
    </div>
  );
};

export default Banner;
