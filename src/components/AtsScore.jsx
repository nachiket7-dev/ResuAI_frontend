import {CheckCircle2, CircleAlert, LoaderCircle, Sparkles, Target} from 'lucide-react';
import React, {useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import api from '../configs/api';
import {notifyAIComplete} from '../utils/aiEvents';

const getAtsAnalysis = (resume) => {
    const personal = resume.personal_info || {};
    const experience = resume.experience || [];
    const skills = resume.skills || [];
    const education = resume.education || [];
    const projects = resume.project || [];
    const issues = [];
    let score = 0;

    if (personal.fullName && personal.email) score += 15;
    else issues.push('Add your full name and email address.');
    if (personal.phone || personal.linkedin || personal.website) score += 5;
    else issues.push('Add a phone number or professional profile link.');
    if ((resume.professional_summary || '').trim().length >= 80) score += 15;
    else issues.push('Write a summary of at least 80 characters.');
    if (experience.length > 0) score += 20;
    else issues.push('Add at least one experience entry.');
    if (experience.some((entry) => (entry.description || '').trim().length >= 80)) score += 10;
    else issues.push('Use detailed, achievement-focused experience bullets.');
    if (skills.length >= 5) score += 15;
    else issues.push('Add at least five relevant skills.');
    if (education.length > 0) score += 10;
    else issues.push('Add an education entry if relevant to your target role.');
    if (projects.length > 0) score += 5;
    if (experience.every((entry) => entry.start_date)) score += 5;
    else issues.push('Add dates to each experience entry.');

    return {score, issues: issues.slice(0, 3)};
};

const AtsScore = ({resume}) => {
    const {token} = useSelector((state) => state.auth);
    const analysis = useMemo(() => getAtsAnalysis(resume), [resume]);
    const [review, setReview] = useState(null);
    const [isReviewing, setIsReviewing] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const scoreColor = analysis.score >= 80 ? 'text-green-600' : analysis.score >= 60 ? 'text-amber-600' : 'text-red-600';

    const runReview = async () => {
        setIsReviewing(true);
        setReviewError('');
        try {
            const {data} = await api.post('/api/ai/review-resume', {resumeId: resume._id}, {headers: {Authorization: token}});
            setReview(data.review);
            notifyAIComplete();
        } catch (error) {
            setReviewError(error?.response?.data?.message || 'Unable to review this resume right now.');
        } finally {
            setIsReviewing(false);
        }
    };

    return (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4" aria-label="ATS readiness score">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Target className="size-4 text-indigo-500"/> ATS readiness</p>
                    <p className="mt-1 text-xs text-slate-500">A quick content check before you apply.</p>
                </div>
                <span className={`text-2xl font-bold ${scoreColor}`}>{analysis.score}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className={`h-full transition-all ${analysis.score >= 80 ? 'bg-green-500' : analysis.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width: `${analysis.score}%`}}/>
            </div>
            {analysis.issues.length > 0 ? (
                <ul className="mt-3 space-y-1 text-xs text-slate-600">
                    {analysis.issues.map((issue) => <li key={issue} className="flex gap-2"><CircleAlert className="mt-0.5 size-3 shrink-0 text-amber-500"/>{issue}</li>)}
                </ul>
            ) : (
                <p className="mt-3 flex items-center gap-2 text-xs text-green-700"><CheckCircle2 className="size-3"/> Your resume covers the main ATS content checks.</p>
            )}
            <div className="mt-4 border-t border-slate-200 pt-3"><button type="button" onClick={runReview} disabled={isReviewing || !resume._id} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">{isReviewing ? <LoaderCircle className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}{isReviewing ? 'Reviewing resume...' : 'Run AI review'}</button>{reviewError && <p className="mt-2 text-xs text-red-600">{reviewError}</p>}</div>
            {review && <div className="mt-4 space-y-3 rounded-xl border border-indigo-100 bg-white p-3"><div className="flex items-center justify-between"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700"><Sparkles className="size-3.5" /> AI review</p><span className="text-lg font-semibold text-indigo-800">{review.score}/100</span></div>{review.summary && <p className="text-sm leading-6 text-slate-600">{review.summary}</p>}{review.strengths?.length > 0 && <div><p className="text-xs font-semibold text-green-800">What is working</p><ul className="mt-1 space-y-1 text-xs leading-5 text-slate-600">{review.strengths.slice(0, 3).map((strength) => <li key={strength} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-3 shrink-0 text-green-600" />{strength}</li>)}</ul></div>}{review.issues?.length > 0 && <div><p className="text-xs font-semibold text-amber-800">Highest-impact improvements</p><ul className="mt-1 space-y-2 text-xs leading-5 text-slate-600">{review.issues.slice(0, 3).map((issue) => <li key={`${issue.category}-${issue.message}`} className="rounded-lg bg-amber-50 px-2.5 py-2"><span className="font-semibold text-slate-800">{issue.category}: </span>{issue.message}{issue.suggestion && <span className="block mt-1 text-slate-500">{issue.suggestion}</span>}</li>)}</ul></div>}</div>}
        </div>
    );
};

export default AtsScore;
