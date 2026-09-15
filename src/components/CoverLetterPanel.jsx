import {Clipboard, LoaderCircle, Mail, Sparkles} from 'lucide-react';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';
import {notifyAIComplete} from '../utils/aiEvents';

const CoverLetterPanel = ({resume, targetProfile}) => {
    const {token} = useSelector((state) => state.auth);
    const [jobDescription, setJobDescription] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [tone, setTone] = useState('confident and warm');
    const [coverLetter, setCoverLetter] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!targetProfile) return;
        setCompanyName(targetProfile.companyName || '');
        setJobTitle(targetProfile.jobTitle || '');
        setTone(targetProfile.tone || 'confident and warm');
        setJobDescription(targetProfile.jobDescription || '');
        setCoverLetter(null);
    }, [targetProfile]);

    const generateCoverLetter = async () => {
        if (!jobDescription.trim()) return;
        setIsGenerating(true);
        setError('');
        setCoverLetter({subject: `Application for ${jobTitle || 'the role'}`, body: ''});
        try {
            const streamUrl = `${api.defaults.baseURL || ''}/api/ai/cover-letter/stream`;
            const response = await fetch(streamUrl, {method: 'POST', headers: {'Content-Type': 'application/json', Authorization: token}, body: JSON.stringify({resumeId: resume._id, jobDescription: jobDescription.trim(), companyName, jobTitle, tone})});
            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                throw new Error(payload.message || 'Unable to create a cover letter right now.');
            }
            if (!response.body) throw new Error('Streaming is not supported in this browser.');
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let streamDone = false;
            while (!streamDone) {
                const {value, done} = await reader.read();
                buffer += decoder.decode(value || new Uint8Array(), {stream: !done});
                const events = buffer.split('\n\n');
                buffer = events.pop() || '';
                for (const event of events) {
                    const dataLine = event.split('\n').find((line) => line.startsWith('data: '));
                    if (!dataLine) continue;
                    const payload = dataLine.slice(6);
                    if (payload === '[DONE]') {streamDone = true; break;}
                    const parsed = JSON.parse(payload);
                    if (parsed.message && !parsed.delta && !parsed.done) throw new Error(parsed.message);
                    if (parsed.delta) setCoverLetter((current) => ({subject: current?.subject || `Application for ${jobTitle || 'the role'}`, body: `${current?.body || ''}${parsed.delta}`}));
                    if (parsed.done && parsed.coverLetter) setCoverLetter(parsed.coverLetter);
                }
                if (done) break;
            }
            notifyAIComplete();
        } catch (requestError) {
            setCoverLetter(null);
            setError(requestError?.response?.data?.message || requestError.message || 'Unable to create a cover letter right now.');
        } finally {
            setIsGenerating(false);
        }
    };

    const copyLetter = async () => {
        if (!coverLetter?.body) return;
        await navigator.clipboard.writeText(`${coverLetter.subject ? `${coverLetter.subject}\n\n` : ''}${coverLetter.body}`);
        toast.success('Cover letter copied');
    };

    return <div className='mt-4 rounded-2xl border border-violet-200 bg-violet-50/60 p-4' aria-label='AI cover letter generator'>
        <div className='flex items-start justify-between gap-3'>
            <div><p className='flex items-center gap-2 text-sm font-semibold text-slate-800'><Mail className='size-4 text-violet-700' /> Cover letter studio</p><p className='mt-1 text-xs leading-5 text-slate-500'>Generate a tailored first draft using this resume and a real job description.</p></div>
            <Sparkles className='size-4 text-violet-600' />
        </div>
        <div className='mt-3 grid gap-2 sm:grid-cols-2'>
            <input value={companyName} onChange={(event) => setCompanyName(event.target.value)} maxLength={120} className='border-violet-200 bg-white px-3 py-2 text-sm' placeholder='Company name (optional)' />
            <input value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} maxLength={160} className='border-violet-200 bg-white px-3 py-2 text-sm' placeholder='Role title (optional)' />
        </div>
        <div className='mt-2 flex items-center gap-2'>
            <label className='text-xs font-medium text-slate-600' htmlFor='cover-letter-tone'>Tone</label>
            <select id='cover-letter-tone' value={tone} onChange={(event) => setTone(event.target.value)} className='border-violet-200 bg-white px-3 py-2 text-xs text-slate-700'>
                <option>confident and warm</option><option>direct and concise</option><option>thoughtful and conversational</option>
            </select>
        </div>
        <textarea value={jobDescription} onChange={(event) => {setJobDescription(event.target.value); setCoverLetter(null)}} rows={5} maxLength={16000} className='mt-3 w-full border-violet-200 bg-white px-3 py-2 text-sm' placeholder='Paste the job description here...' />
        <div className='mt-2 flex items-center justify-between gap-3'><span className='text-[11px] text-slate-400'>{jobDescription.length.toLocaleString()} / 16,000 characters</span><button type='button' onClick={generateCoverLetter} disabled={isGenerating || !jobDescription.trim() || !resume._id} className='flex items-center gap-2 rounded-xl bg-violet-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50'>{isGenerating ? <LoaderCircle className='size-3.5 animate-spin' /> : <Sparkles className='size-3.5' />}{isGenerating ? 'Writing...' : 'Generate letter'}</button></div>
        {error && <p className='mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700'>{error}</p>}
        {coverLetter && <div className='mt-4 rounded-xl border border-violet-100 bg-white p-4'><div className='flex items-start justify-between gap-3'><div><p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-700'>Draft subject</p><p className='mt-1 text-sm font-semibold text-slate-800'>{coverLetter.subject || 'Application'}</p></div><button type='button' onClick={copyLetter} className='flex items-center gap-1 rounded-lg bg-violet-50 px-2.5 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100'><Clipboard className='size-3.5' /> Copy</button></div><div className='mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700'>{coverLetter.body}</div><p className='mt-4 border-t border-slate-100 pt-3 text-[11px] leading-5 text-slate-400'>Review every claim before sending. AI drafts should be edited to sound like you.</p></div>}
    </div>;
};

export default CoverLetterPanel;
