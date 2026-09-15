import {Clock3, LoaderCircle, Trash2} from 'lucide-react';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';

const labels = {review: 'Resume review', match: 'Job match', 'bullet-rewrite': 'Bullet rewrites', 'cover-letter': 'Cover letter', tailor: 'Resume tailoring', interview: 'Interview prep'};

const AIHistoryPanel = ({resumeId}) => {
    const {token} = useSelector((state) => state.auth);
    const [history, setHistory] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const {data} = await api.get(`/api/ai/history?resumeId=${encodeURIComponent(resumeId)}`, {headers: {Authorization: token}});
                setHistory(data.history || []);
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Unable to load AI history');
        } finally {
            setIsLoading(false);
        }
        };
        if (resumeId) {
            loadHistory();
            window.addEventListener('resuai:ai-complete', loadHistory);
        }
        return () => window.removeEventListener('resuai:ai-complete', loadHistory);
    }, [resumeId, token]);

    const deleteItem = async (event, id) => {
        event.stopPropagation();
        try {
            await api.delete(`/api/ai/history/${id}`, {headers: {Authorization: token}});
            setHistory((current) => current.filter((item) => item._id !== id));
            if (selectedId === id) setSelectedId('');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to delete history item');
        }
    };

    const selected = history.find((item) => item._id === selectedId);
    const selectedResult = selected?.result || {};
    const coverLetter = selectedResult.coverLetter;
    const textItems = selectedResult.recommendations || selectedResult.strengths || selectedResult.rewrites?.map((item) => item.text) || [];

    return <div className='mt-6 rounded-2xl border border-slate-200 bg-white p-4' aria-label='AI history'>
        <div className='flex items-start justify-between gap-3'><div><p className='flex items-center gap-2 text-sm font-semibold text-slate-800'><Clock3 className='size-4 text-slate-500' /> AI history</p><p className='mt-1 text-xs leading-5 text-slate-500'>Your latest review, match, rewrite, and cover-letter drafts stay attached to this resume.</p></div><span className='text-xs text-slate-400'>{history.length} saved</span></div>
        {isLoading ? <LoaderCircle className='mx-auto mt-5 size-5 animate-spin text-slate-400' /> : history.length === 0 ? <p className='mt-4 rounded-xl bg-slate-50 px-3 py-4 text-xs text-slate-500'>Run an AI tool to start building a history.</p> : <div className='mt-4 space-y-2'>{history.slice(0, 8).map((item) => <div key={item._id}><button type='button' onClick={() => setSelectedId(selectedId === item._id ? '' : item._id)} className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition ${selectedId === item._id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}><span><span className='block text-xs font-semibold'>{labels[item.kind] || item.title}</span><span className={`mt-0.5 block text-[10px] ${selectedId === item._id ? 'text-slate-300' : 'text-slate-400'}`}>{new Date(item.createdAt).toLocaleString()}</span></span><span className='flex items-center gap-2'><span className={`max-w-36 truncate text-[10px] ${selectedId === item._id ? 'text-slate-300' : 'text-slate-400'}`}>{item.title}</span><span role='button' tabIndex={0} onClick={(event) => deleteItem(event, item._id)} className={`rounded p-1 ${selectedId === item._id ? 'hover:bg-white/10' : 'hover:bg-red-50 hover:text-red-600'}`} aria-label='Delete history item'><Trash2 className='size-3.5' /></span></span></button>{selectedId === item._id && <div className='rounded-b-xl border border-t-0 border-slate-200 bg-white p-3 text-xs leading-5 text-slate-600'>{coverLetter ? <><p className='font-semibold text-slate-800'>{coverLetter.subject}</p><p className='mt-2 whitespace-pre-wrap'>{coverLetter.body}</p></> : <>{selectedResult.summary && <p>{selectedResult.summary}</p>}{textItems.length > 0 && <ul className='mt-2 space-y-1'>{textItems.slice(0, 5).map((text) => <li key={text} className='flex gap-2'><span className='mt-2 size-1 shrink-0 rounded-full bg-green-500' />{typeof text === 'string' ? text : text.text}</li>)}</ul>}{selectedResult.matchScore !== undefined && <p className='mt-2 font-semibold text-amber-700'>Match score: {selectedResult.matchScore}%</p>}{selectedResult.score !== undefined && <p className='mt-2 font-semibold text-indigo-700'>Review score: {selectedResult.score}/100</p>}</>}</div>}</div>)}</div>}
    </div>;
};

export default AIHistoryPanel;
