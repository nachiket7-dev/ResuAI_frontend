import {History, RotateCcw, X} from 'lucide-react';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';

const VersionHistory = ({resumeId, onRestored}) => {
    const {token} = useSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [versions, setVersions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const openHistory = async () => {
        setIsOpen(true);
        setIsLoading(true);
        try {
            const {data} = await api.get(`/api/resumes/versions/${resumeId}`, {headers: {Authorization: token}});
            setVersions(data.versions || []);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const restore = async (versionId) => {
        if (!window.confirm('Restore this version? Your current version will be saved in history.')) return;
        try {
            const {data} = await api.post(`/api/resumes/versions/${resumeId}/restore/${versionId}`, {}, {headers: {Authorization: token}});
            onRestored(data.resume);
            setIsOpen(false);
            toast.success('Version restored');
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    return (
        <>
            <button type="button" onClick={openHistory} className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:-translate-y-0.5 hover:bg-slate-200" aria-label="Open version history">
                <History size={14}/><span className="max-sm:hidden">History</span>
            </button>
            {isOpen && (
                <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Resume version history">
                    <div className="animate-modal relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
                        <button type="button" onClick={() => setIsOpen(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-700" aria-label="Close version history"><X className="size-4"/></button>
                        <h2 className="text-lg font-semibold text-slate-800">Version history</h2>
                        <p className="mt-1 text-xs text-slate-500">The last 10 meaningful saves are kept.</p>
                        {isLoading ? <p className="py-6 text-sm text-slate-500">Loading history...</p> : versions.length === 0 ? <p className="py-6 text-sm text-slate-500">No earlier versions yet.</p> : (
                            <div className="mt-4 space-y-2">
                                {versions.map((version) => <div key={version.id} className="interactive-card flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm"><span>{new Date(version.savedAt).toLocaleString()}</span><button type="button" onClick={() => restore(version.id)} className="flex items-center gap-1 text-xs text-green-700 hover:text-green-900"><RotateCcw className="size-3"/> Restore</button></div>)}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default VersionHistory;
