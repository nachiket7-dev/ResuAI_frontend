import { Loader2, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../configs/api';
import toast from 'react-hot-toast';

const ProfessionalSummaryForm = ({data, onChange, setResumeData}) => {
    const {token} = useSelector((state) => state.auth);
    const [isGenerating, setIsGenerating] = useState(false);
    const generateSummary = async () => {
        try {
            setIsGenerating(true);
            const prompt = `Enhance my professional summary "${data}"`;
            const response = await api.post('/api/ai/enhance-pro-sum', {userContent: prompt}, {headers: {Authorization: token}});
            setResumeData((prev) => ({...prev, professional_summary: response.data.enhancedContent}));
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setIsGenerating(false);
        }
    }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">Professional Summary</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Boil down your story into 3-4 impactful sentences.</p>
        </div>
        <button
          disabled={isGenerating}
          onClick={generateSummary}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white rounded-md bg-indigo-600 shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGenerating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {isGenerating ? "Enhancing..." : "AI Enhance"}
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <textarea
          value={data || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          className="w-full p-4 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center bg-zinc-50 dark:bg-zinc-800 px-4 py-3 rounded-md border border-zinc-200 dark:border-zinc-700">
          💡 <strong>Tip:</strong> Keep it concise (3-4 sentences) and focus on measurable achievements.
        </p>
      </div>
    </div>
  );
}

export default ProfessionalSummaryForm