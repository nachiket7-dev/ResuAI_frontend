import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { logout } from '../app/features/authSlice';
import { useTheme } from "../hooks/useTheme";
import { LogOut, Moon, Sun } from "lucide-react";

const Navbar = () => {
    const {user} = useSelector((state) => state.auth);
    const { theme, toggleTheme } = useTheme();
    const dispatch = useDispatch()
    const handleLogout = () => {
        dispatch(logout())
    }
  return (
    <div className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/app" className="flex items-center gap-2 group">
          <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
            R
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Resu AI</h1>
            <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 tracking-wider uppercase">
              Builder Suite
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition text-sm font-medium"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar