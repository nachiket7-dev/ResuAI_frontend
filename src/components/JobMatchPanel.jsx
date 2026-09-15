import {CheckCircle2, LoaderCircle, Search, Sparkles, XCircle} from 'lucide-react';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import api from '../configs/api';
import {notifyAIComplete} from '../utils/aiEvents';

const JobMatchPanel = ({resume, targetProfile}) => {
    const {token} = useSelector((state) => state.auth);
    const [jobDescription, setJobDescription] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!targetProfile) return;
        setJobDescription(targetProfile.jobDescription || '');
        setAnalysis(null);
    }, [targetProfile]);

    const analyzeJob = async () => {
        if (!jobDescription.trim()) return;
        setIsAnalyzing(true);
        setError('');
        try {
            const {data} = await api.post('/api/ai/match-job', {resumeId: resume._id, jobDescription: jobDescription.trim()}, {headers: {Authorization: token}});
            setAnalysis(data.analysis);
            notifyAIComplete();
        } catch (requestError) {
            setError(requestError?.response?.data?.message || 'Unable to analyze this role right now.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4" aria-label="AI job match analysis">
        <div className="flex items-start justify-between gap-3"><div><p className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Search className="size-4 text-amber-700" /> Role match</p><p className="mt-1 text-xs leading-5 text-slate-500">Paste a job description to see how this resume aligns and what to improve.</p></div><Sparkles className="size-4 text-amber-600" /></div>
        <textarea value={jobDescription} onChange={(event) => {setJobDescription(event.target.value); setAnalysis(null)}} rows={5} maxLength={16000} className="mt-3 w-full border-amber-200 bg-white px-3 py-2 text-sm" placeholder="Paste the job description here..." />
        <div className="mt-2 flex items-center justify-between gap-3"><span className="text-[11px] text-slate-400">{jobDescription.length.toLocaleString()} / 16,000 characters</span><button type="button" onClick={analyzeJob} disabled={isAnalyzing || !jobDescription.trim() || !resume._id} className="flex items-center gap-2 rounded-xl bg-amber-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50">{isAnalyzing && <LoaderCircle className="size-3.5 animate-spin" />}{isAnalyzing ? 'Analyzing...' : 'Analyze role'}</button></div>
        {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
        {analysis && <div className="mt-4 space-y-4 border-t border-amber-200 pt-4"><div className="flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">AI match score</p><p className="mt-1 text-xs text-slate-500">Based on evidence in your resume</p></div><span className="text-3xl font-semibold tracking-tight text-amber-900">{analysis.matchScore}%</span></div><div className="h-2 overflow-hidden rounded-full bg-amber-200"><div className="h-full rounded-full bg-amber-600 transition-all" style={{width: `${analysis.matchScore}%`}} /></div>{analysis.summary && <p className="text-sm leading-6 text-slate-700">{analysis.summary}</p>}{analysis.matchedKeywords?.length > 0 && <div><p className="mb-2 flex items-center gap-2 text-xs font-semibold text-green-800"><CheckCircle2 className="size-3.5" /> Evidence already present</p><div className="flex flex-wrap gap-1.5">{analysis.matchedKeywords.map((keyword) => <span key={keyword} className="rounded-full bg-green-100 px-2 py-1 text-[11px] text-green-800">{keyword}</span>)}</div></div>}{analysis.missingKeywords?.length > 0 && <div><p className="mb-2 flex items-center gap-2 text-xs font-semibold text-amber-900"><XCircle className="size-3.5" /> Consider addressing</p><div className="flex flex-wrap gap-1.5">{analysis.missingKeywords.map((keyword) => <span key={keyword} className="rounded-full bg-white px-2 py-1 text-[11px] text-amber-900 ring-1 ring-amber-200">{keyword}</span>)}</div></div>}{analysis.recommendations?.length > 0 && <div><p className="mb-2 text-xs font-semibold text-slate-800">Recommended next steps</p><ul className="space-y-1.5 text-xs leading-5 text-slate-600">{analysis.recommendations.slice(0, 4).map((recommendation) => <li key={recommendation} className="flex gap-2"><span className="mt-2 size-1 shrink-0 rounded-full bg-amber-600" />{recommendation}</li>)}</ul></div>}</div>}
    </div>;
};

export default JobMatchPanel;
