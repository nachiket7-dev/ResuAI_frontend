import React from "react";

const Banner = () => {
  return (
    <div className="w-full py-2.5 font-medium text-sm text-indigo-900 dark:text-indigo-100 text-center bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 border-b border-indigo-200 dark:border-indigo-800/50">
      <p>
        <span className="px-3 py-1 rounded-lg text-white bg-indigo-600 dark:bg-indigo-500 mr-2 shadow-sm shadow-indigo-500/20">
          New
        </span>
        AI Feature Added
      </p>
    </div>
  );
};

export default Banner;
