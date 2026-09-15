import {CheckCircle2, ChevronRight, LoaderCircle, MessageSquare, Sparkles, Target, XCircle} from 'lucide-react';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import api from '../configs/api';
import {notifyAIComplete} from '../utils/aiEvents';

const InterviewPrepPanel = ({resume, targetProfile}) => {
    const {token} = useSelector((state) => state.auth);
    const [jobTitle, setJobTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [focus, setFocus] = useState('');
    const [prep, setPrep] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [review, setReview] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!targetProfile) return;
        setJobTitle(targetProfile.jobTitle || '');
        setCompanyName(targetProfile.companyName || '');
        setJobDescription(targetProfile.jobDescription || '');
        setPrep(null);
        setReview(null);
    }, [targetProfile]);

    const generatePrep = async () => {
        if (!jobDescription.trim()) return;
        setIsGenerating(true);
        setError('');
        setPrep(null);
        setReview(null);
        try {
            const {data} = await api.post('/api/ai/interview-prep', {resumeId: resume._id, jobTitle: jobTitle.trim(), companyName: companyName.trim(), jobDescription: jobDescription.trim(), focus: focus.trim()}, {headers: {Authorization: token}});
            setPrep(data.prep);
            setSelectedIndex(0);
            setAnswer('');
            notifyAIComplete();
        } catch (requestError) {
            setError(requestError?.response?.data?.message || 'Unable to create interview prep right now.');
        } finally {
            setIsGenerating(false);
        }
    };

    const activeQuestion = prep?.questions?.[selectedIndex];
    const reviewAnswer = async () => {
        if (!activeQuestion || !answer.trim()) return;
        setIsReviewing(true);
        setError('');
        try {
            const {data} = await api.post('/api/ai/interview-answer-review', {resumeId: resume._id, question: activeQuestion.question, answer: answer.trim(), jobDescription: jobDescription.trim()}, {headers: {Authorization: token}});
            setReview(data.review);
            notifyAIComplete();
        } catch (requestError) {
            setError(requestError?.response?.data?.message || 'Unable to review this answer right now.');
        } finally {
            setIsReviewing(false);
        }
    };

    return <div className='rounded-2xl border border-sky-200 bg-sky-50/70 p-4 shadow-sm' aria-label='AI interview preparation'>
        <div className='flex items-start justify-between gap-3'><div><p className='flex items-center gap-2 text-sm font-semibold text-slate-900'><MessageSquare className='size-4 text-sky-700' /> Interview rehearsal</p><p className='mt-1 text-xs leading-5 text-slate-600'>Practice the questions most likely for this role using your actual resume evidence.</p></div><Target className='size-4 text-sky-600' /></div>
        <div className='mt-4 grid gap-2 sm:grid-cols-2'><input value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} maxLength={160} className='border-sky-200 bg-white px-3 py-2 text-sm' placeholder='Target role' /><input value={companyName} onChange={(event) => setCompanyName(event.target.value)} maxLength={120} className='border-sky-200 bg-white px-3 py-2 text-sm' placeholder='Company (optional)' /></div>
        <textarea value={jobDescription} onChange={(event) => {setJobDescription(event.target.value); setPrep(null)}} rows={4} maxLength={16000} className='mt-2 w-full border-sky-200 bg-white px-3 py-2 text-sm' placeholder='Paste the job description here...' />
        <div className='mt-2 flex items-start gap-2'><input value={focus} onChange={(event) => setFocus(event.target.value)} maxLength={160} className='min-w-0 flex-1 border-sky-200 bg-white px-3 py-2 text-xs' placeholder='Optional focus, e.g. system design or leadership' /><button type='button' onClick={generatePrep} disabled={isGenerating || !jobDescription.trim() || !resume._id} className='flex shrink-0 items-center gap-2 rounded-xl bg-sky-700 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-sky-800 disabled:opacity-50'>{isGenerating ? <LoaderCircle className='size-3.5 animate-spin' /> : <Sparkles className='size-3.5' />}{isGenerating ? 'Preparing...' : 'Create prep pack'}</button></div>
        {error && <p className='mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700'>{error}</p>}
        {prep && <div className='mt-4 space-y-4 border-t border-sky-200 pt-4'><div className='rounded-xl border border-sky-100 bg-white p-3'><p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-700'>Your positioning</p><p className='mt-2 text-sm leading-6 text-slate-700'>{prep.opening || 'Lead with the strongest evidence-backed story in your background.'}</p></div>{prep.talkingPoints?.length > 0 && <div><p className='mb-2 text-xs font-semibold text-slate-800'>Talking points</p><div className='flex flex-wrap gap-1.5'>{prep.talkingPoints.map((point) => <span key={point} className='rounded-full bg-white px-2.5 py-1.5 text-[11px] text-slate-600 ring-1 ring-sky-100'>{point}</span>)}</div></div>}<div><p className='mb-2 text-xs font-semibold text-slate-800'>{prep.questions?.length || 0} questions to rehearse</p><div className='grid gap-2'>{prep.questions?.map((question, index) => <button type='button' key={`${question.question}-${index}`} onClick={() => {setSelectedIndex(index); setReview(null); setAnswer('')}} className={`flex items-start justify-between gap-3 rounded-xl border p-3 text-left transition ${selectedIndex === index ? 'border-sky-500 bg-white shadow-sm' : 'border-slate-200 bg-white/70 hover:border-sky-300'}`}><span><span className='block text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-700'>{question.category}</span><span className='mt-1 block text-xs leading-5 text-slate-700'>{question.question}</span></span><ChevronRight className={`mt-1 size-4 shrink-0 ${selectedIndex === index ? 'text-sky-600' : 'text-slate-300'}`} /></button>)}</div></div>{activeQuestion && <div className='rounded-xl border border-slate-200 bg-white p-4'><p className='text-sm font-semibold text-slate-900'>{activeQuestion.question}</p>{activeQuestion.whyItMatters && <p className='mt-2 text-xs leading-5 text-slate-500'>{activeQuestion.whyItMatters}</p>}{activeQuestion.evidenceToUse?.length > 0 && <div className='mt-3'><p className='text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400'>Use these facts</p><ul className='mt-1 space-y-1 text-xs text-slate-600'>{activeQuestion.evidenceToUse.map((item) => <li key={item} className='flex gap-2'><span className='mt-1.5 size-1 shrink-0 rounded-full bg-sky-500' />{item}</li>)}</ul></div>}{activeQuestion.answerOutline?.length > 0 && <div className='mt-3'><p className='text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400'>Answer outline</p><ol className='mt-1 list-decimal space-y-1 pl-4 text-xs text-slate-600'>{activeQuestion.answerOutline.map((item) => <li key={item}>{item}</li>)}</ol></div>}<textarea value={answer} onChange={(event) => {setAnswer(event.target.value); setReview(null)}} maxLength={6000} rows={5} className='mt-4 w-full border-sky-200 bg-sky-50/40 px-3 py-2 text-sm' placeholder='Write or paste your answer, then ask AI to coach it...' /><div className='mt-2 flex items-center justify-between gap-3'><span className='text-[11px] text-slate-400'>{answer.length.toLocaleString()} / 6,000 characters</span><button type='button' onClick={reviewAnswer} disabled={isReviewing || !answer.trim()} className='flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50'>{isReviewing && <LoaderCircle className='size-3.5 animate-spin' />}{isReviewing ? 'Reviewing...' : 'Review answer'}</button></div></div>}{review && <div className='rounded-xl border border-indigo-200 bg-indigo-50/60 p-4'><div className='flex items-end justify-between gap-3'><div><p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-700'>Answer score</p><p className='mt-1 text-sm text-slate-600'>{review.summary}</p></div><span className='text-3xl font-semibold text-indigo-900'>{review.score}%</span></div>{review.strengths?.length > 0 && <div className='mt-3'><p className='flex items-center gap-1 text-xs font-semibold text-emerald-700'><CheckCircle2 className='size-3.5' /> What worked</p><ul className='mt-1 space-y-1 text-xs leading-5 text-slate-600'>{review.strengths.map((item) => <li key={item}>• {item}</li>)}</ul></div>}{review.improvements?.length > 0 && <div className='mt-3'><p className='flex items-center gap-1 text-xs font-semibold text-amber-700'><XCircle className='size-3.5' /> Improve next</p><ul className='mt-1 space-y-1 text-xs leading-5 text-slate-600'>{review.improvements.map((item) => <li key={item}>• {item}</li>)}</ul></div>}{review.suggestedAnswer && <details className='mt-3 rounded-xl bg-white p-3'><summary className='cursor-pointer text-xs font-semibold text-slate-800'>Show improved answer</summary><p className='mt-2 whitespace-pre-wrap text-xs leading-6 text-slate-700'>{review.suggestedAnswer}</p></details>}</div>}</div>}
    </div>;
};

export default InterviewPrepPanel;
