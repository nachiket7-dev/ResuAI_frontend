import {ArrowRight, Check, LoaderCircle, RotateCcw, Sparkles, WandSparkles} from 'lucide-react';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';
import {notifyAIComplete} from '../utils/aiEvents';

const TailorResumePanel = ({resume, targetProfile, onApplied}) => {
    const {token} = useSelector((state) => state.auth);
    const [jobTitle, setJobTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [userInstruction, setUserInstruction] = useState('');
    const [run, setRun] = useState(null);
    const [isTailoring, setIsTailoring] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!targetProfile) return;
        setJobTitle(targetProfile.jobTitle || '');
        setCompanyName(targetProfile.companyName || '');
        setJobDescription(targetProfile.jobDescription || '');
        setRun(null);
    }, [targetProfile]);

    const tailorResume = async () => {
        if (!jobDescription.trim()) return;
        setIsTailoring(true);
        setError('');
        setRun(null);
        try {
            const {data} = await api.post('/api/ai/tailor-resume', {
                resumeId: resume._id,
                jobTitle: jobTitle.trim(),
                companyName: companyName.trim(),
                jobDescription: jobDescription.trim(),
                userInstruction: userInstruction.trim(),
                targetProfileId: targetProfile?._id,
            }, {headers: {Authorization: token}});
            setRun(data.run);
            notifyAIComplete();
        } catch (requestError) {
            setError(requestError?.response?.data?.message || 'Unable to tailor this resume right now.');
        } finally {
            setIsTailoring(false);
        }
    };

    const applyRun = async () => {
        if (!run?._id) return;
        setIsApplying(true);
        try {
            const {data} = await api.post(`/api/ai/tailoring-runs/${run._id}/apply`, {}, {headers: {Authorization: token}});
            onApplied(data.resume);
            setRun(null);
            toast.success('Tailored resume applied and saved as a new version');
        } catch (requestError) {
            setError(requestError?.response?.data?.message || 'Unable to apply this tailoring run.');
        } finally {
            setIsApplying(false);
        }
    };

    const rejectRun = async () => {
        if (!run?._id) return;
        try {
            await api.post(`/api/ai/tailoring-runs/${run._id}/reject`, {}, {headers: {Authorization: token}});
            setRun(null);
            toast.success('Tailoring draft discarded');
        } catch (requestError) {
            setError(requestError?.response?.data?.message || 'Unable to discard this draft.');
        }
    };

    return <div className='rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm' aria-label='AI resume tailoring'>
        <div className='flex items-start justify-between gap-3'>
            <div><p className='flex items-center gap-2 text-sm font-semibold text-slate-900'><WandSparkles className='size-4 text-emerald-700' /> Tailor for a real role</p><p className='mt-1 text-xs leading-5 text-slate-600'>Get a complete, evidence-safe rewrite for one job. Review every change before it touches your resume.</p></div>
            <span className='rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200'>120B editor</span>
        </div>
        <div className='mt-4 grid gap-2 sm:grid-cols-2'>
            <input value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} maxLength={160} className='border-emerald-200 bg-white px-3 py-2 text-sm' placeholder='Target role' />
            <input value={companyName} onChange={(event) => setCompanyName(event.target.value)} maxLength={120} className='border-emerald-200 bg-white px-3 py-2 text-sm' placeholder='Company (optional)' />
        </div>
        <textarea value={jobDescription} onChange={(event) => {setJobDescription(event.target.value); setRun(null)}} rows={5} maxLength={16000} className='mt-2 w-full border-emerald-200 bg-white px-3 py-2 text-sm' placeholder='Paste the job description here...' />
        <div className='mt-2 flex items-start gap-2'>
            <textarea value={userInstruction} onChange={(event) => setUserInstruction(event.target.value)} rows={2} maxLength={1200} className='min-w-0 flex-1 border-emerald-200 bg-white px-3 py-2 text-xs' placeholder='Optional direction: emphasize leadership, keep it concise, etc.' />
            <button type='button' onClick={tailorResume} disabled={isTailoring || !jobDescription.trim() || !resume._id} className='flex shrink-0 items-center gap-2 rounded-xl bg-emerald-700 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50'>{isTailoring ? <LoaderCircle className='size-3.5 animate-spin' /> : <Sparkles className='size-3.5' />}{isTailoring ? 'Tailoring...' : 'Tailor resume'}</button>
        </div>
        <div className='mt-2 flex justify-between text-[11px] text-slate-400'><span>{jobDescription.length.toLocaleString()} / 16,000 job-description characters</span><span>Facts preserved</span></div>
        {error && <p className='mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700'>{error}</p>}
        {run && <div className='mt-4 space-y-4 border-t border-emerald-200 pt-4'>
            <div className='grid grid-cols-2 gap-2'><div className='rounded-xl bg-white p-3'><p className='text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500'>Before</p><p className='mt-1 text-2xl font-semibold text-slate-700'>{run.matchScoreBefore}%</p></div><div className='rounded-xl bg-slate-900 p-3 text-white'><p className='text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-300'>After</p><p className='mt-1 text-2xl font-semibold'>{run.matchScoreAfter}%</p></div></div>
            {run.warnings?.length > 0 && <div className='rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-xs leading-5 text-amber-900'><p className='font-semibold'>Review these gaps before applying</p><ul className='mt-1 list-disc space-y-1 pl-4'>{run.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div>}
            <div><p className='text-xs font-semibold uppercase tracking-[0.12em] text-slate-500'>{run.changes?.length || 0} suggested changes</p>{run.changes?.length > 0 ? <div className='mt-2 space-y-2'>{run.changes.slice(0, 8).map((change, index) => <div key={`${change.section}-${change.itemIndex}-${change.field}-${index}`} className='rounded-xl border border-slate-200 bg-white p-3'><p className='text-[11px] font-semibold text-emerald-700'>{change.section}{change.itemIndex !== null ? ` · item ${change.itemIndex + 1}` : ''} · {change.field}</p><div className='mt-2 grid gap-2 text-xs sm:grid-cols-[1fr_auto_1fr] sm:items-start'><p className='rounded-lg bg-red-50 p-2 leading-5 text-slate-600'>{change.before || '—'}</p><ArrowRight className='hidden size-4 text-slate-400 sm:block' /><p className='rounded-lg bg-emerald-50 p-2 leading-5 text-slate-700'>{change.after || '—'}</p></div>{change.reason && <p className='mt-2 text-[11px] leading-5 text-slate-500'>{change.reason}</p>}</div>)}</div> : <p className='mt-2 rounded-xl bg-white px-3 py-3 text-xs text-slate-500'>No safe content changes were found for this role.</p>}</div>
            <div className='flex flex-wrap items-center justify-end gap-2'><button type='button' onClick={rejectRun} className='flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-white hover:text-slate-800'><RotateCcw className='size-3.5' /> Discard</button><button type='button' onClick={applyRun} disabled={isApplying} className='flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50'>{isApplying ? <LoaderCircle className='size-3.5 animate-spin' /> : <Check className='size-3.5' />}{isApplying ? 'Applying...' : 'Apply reviewed version'}</button></div>
        </div>}
    </div>;
};

export default TailorResumePanel;
