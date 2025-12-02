import React from "react";

const Title = ({ title, description }) => {
  return (
    <div className="text-center mt-6 text-zinc-700 dark:text-zinc-300">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">{title}</h2>
      <p className="max-sm max-w-2xl mt-4 text-zinc-500 dark:text-zinc-400 text-lg">{description}</p>
    </div>
  );
};

export default Title;
