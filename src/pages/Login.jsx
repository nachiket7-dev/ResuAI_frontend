import { Eye, EyeOff, Lock, Mail, User2Icon } from "lucide-react";
import React from "react";
import api from "../configs/api";
import { useDispatch } from "react-redux";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch()
  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");
  const [state, setState] = React.useState(urlState || "login");

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {data} = await api.post(`/api/users/${state}`, formData);
      dispatch(login(data))
      localStorage.setItem('token', data.token);
      toast.success(data.message)
    } catch (error) {
      toast(error?.response?.data?.message || error.message)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative min-h-screen text-zinc-900 dark:text-zinc-50 transition-colors duration-300 overflow-hidden flex items-center justify-center">
      {/* Background Effects (Same as Hero) */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-white dark:bg-[#020204] transition-colors duration-300"></div>
        <div 
          className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[140%] h-[80%] opacity-100 dark:opacity-100 blur-[100px] transition-opacity duration-500"
          style={{
            background: 'radial-gradient(ellipse at bottom, rgba(79, 70, 229, 0.4) 0%, rgba(124, 58, 237, 0.2) 30%, transparent 70%)'
          }}
        ></div>
        <div 
          className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[100%] h-[60%] opacity-0 dark:opacity-100 blur-[80px] transition-opacity duration-500 mix-blend-screen"
          style={{
            background: 'radial-gradient(ellipse at bottom, rgba(99, 102, 241, 0.6) 0%, rgba(139, 92, 246, 0.3) 40%, transparent 80%)'
          }}
        ></div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-100 dark:border-indigo-800">
            Built with AI + ImageKit
          </span>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white leading-tight">
            {state === "login"
              ? "Welcome back to your workspace"
              : "Create an account to start building resumes"}
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-lg">
            Smart templates, professional typography, and an effortless builder that keeps all of your resumes organized.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full px-8 py-10 space-y-6 bg-white dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl"
        >
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {state === "login" ? "Sign in" : "Create account"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">
              {state === "login"
                ? "Enter your credentials to continue"
                : "Fill the form below to get started"}
            </p>
          </div>
          {state !== "login" && (
            <div className="flex items-center gap-3 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <User2Icon size={18} className="text-zinc-400" />
              <input
                type="text"
                name="name"
                placeholder="Full name"
                className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-white placeholder:text-zinc-500"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="flex items-center gap-3 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Mail size={18} className="text-zinc-400" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-white placeholder:text-zinc-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center gap-3 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 bg-zinc-50 dark:bg-zinc-950/50 focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Lock size={18} className="text-zinc-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-white placeholder:text-zinc-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="text-right">
            <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors" type="reset">
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            {state === "login" ? "Sign in" : "Sign up"}
          </button>
          <p
            onClick={() =>
              setState((prev) => (prev === "login" ? "register" : "login"))
            }
            className="text-xs text-slate-500 text-center cursor-pointer"
          >
            {state === "login"
              ? "Don’t have an account?"
              : "Already have an account?"}{" "}
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Click here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
