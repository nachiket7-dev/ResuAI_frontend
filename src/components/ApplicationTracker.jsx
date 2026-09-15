import {CalendarClock, ExternalLink, LoaderCircle, Pencil, Plus, Trash2, X} from 'lucide-react';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';

const statuses = [
    {value: 'saved', label: 'Saved', tone: 'bg-slate-100 text-slate-700'},
    {value: 'applied', label: 'Applied', tone: 'bg-blue-100 text-blue-700'},
    {value: 'interview', label: 'Interview', tone: 'bg-amber-100 text-amber-800'},
    {value: 'offer', label: 'Offer', tone: 'bg-emerald-100 text-emerald-700'},
    {value: 'rejected', label: 'Rejected', tone: 'bg-red-100 text-red-700'},
    {value: 'withdrawn', label: 'Withdrawn', tone: 'bg-slate-100 text-slate-500'},
];

const emptyForm = {companyName: '', jobTitle: '', jobUrl: '', location: '', source: '', contactName: '', status: 'saved', appliedAt: '', followUpAt: '', notes: '', resumeId: ''};

const dateValue = (value) => value ? new Date(value).toISOString().slice(0, 10) : '';
const statusMeta = (status) => statuses.find((item) => item.value === status) || statuses[0];

const ApplicationTracker = ({resumes}) => {
    const {token} = useSelector((state) => state.auth);
    const [applications, setApplications] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState('');
    const [filter, setFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const loadApplications = useCallback(async () => {
        setIsLoading(true);
        try {
            const {data} = await api.get('/api/applications', {headers: {Authorization: token}});
            setApplications(data.applications || []);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to load application tracker');
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => { loadApplications(); }, [loadApplications]);

    const visibleApplications = useMemo(() => filter === 'all' ? applications : applications.filter((item) => item.status === filter), [applications, filter]);
    const counts = useMemo(() => applications.reduce((result, item) => ({...result, [item.status]: (result[item.status] || 0) + 1}), {}), [applications]);
    const responseRate = counts.applied ? Math.round(((counts.interview || 0) + (counts.offer || 0)) / counts.applied * 100) : 0;

    const updateField = (field, value) => setForm((current) => ({...current, [field]: value}));
    const startCreate = () => { setEditingId(''); setForm(emptyForm); setShowForm(true); };
    const startEdit = (application) => {
        setEditingId(application._id);
        setForm({...emptyForm, ...application, resumeId: application.resumeId?._id || application.resumeId || '', appliedAt: dateValue(application.appliedAt), followUpAt: dateValue(application.followUpAt)});
        setShowForm(true);
    };
    const closeForm = () => { setShowForm(false); setEditingId(''); setForm(emptyForm); };

    const saveApplication = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        try {
            const payload = {...form, resumeId: form.resumeId || null, appliedAt: form.appliedAt || null, followUpAt: form.followUpAt || null};
            const config = {headers: {Authorization: token}};
            const response = editingId
                ? await api.put(`/api/applications/${editingId}`, payload, config)
                : await api.post('/api/applications', payload, config);
            const saved = response.data.application;
            setApplications((current) => editingId ? current.map((item) => item._id === editingId ? saved : item) : [saved, ...current]);
            closeForm();
            toast.success(editingId ? 'Application updated' : 'Application saved');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to save application');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteApplication = async (id) => {
        if (!window.confirm('Delete this application?')) return;
        try {
            await api.delete(`/api/applications/${id}`, {headers: {Authorization: token}});
            setApplications((current) => current.filter((item) => item._id !== id));
            toast.success('Application deleted');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to delete application');
        }
    };

    return <section className='mt-12 border-t border-slate-200 pt-8' aria-label='Application tracker'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <div><p className='text-xs font-semibold uppercase tracking-[0.22em] text-indigo-700'>Application workspace</p><h2 className='mt-2 text-2xl font-semibold tracking-tight text-slate-950'>Keep the search moving.</h2><p className='mt-1 max-w-xl text-sm text-slate-500'>Track opportunities, follow-ups, and which resume version you sent.</p></div>
            <button type='button' onClick={startCreate} className='flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700'><Plus className='size-4' /> Add application</button>
        </div>
        <div className='mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5'><div className='rounded-xl border border-slate-200 bg-white p-3'><p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400'>All</p><p className='mt-1 text-2xl font-semibold text-slate-900'>{applications.length}</p></div><div className='rounded-xl border border-blue-200 bg-blue-50 p-3'><p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600'>Applied</p><p className='mt-1 text-2xl font-semibold text-blue-900'>{counts.applied || 0}</p></div><div className='rounded-xl border border-amber-200 bg-amber-50 p-3'><p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700'>Interviews</p><p className='mt-1 text-2xl font-semibold text-amber-900'>{counts.interview || 0}</p></div><div className='rounded-xl border border-emerald-200 bg-emerald-50 p-3'><p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700'>Offers</p><p className='mt-1 text-2xl font-semibold text-emerald-900'>{counts.offer || 0}</p></div><div className='rounded-xl border border-indigo-200 bg-indigo-50 p-3'><p className='text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-600'>Response rate</p><p className='mt-1 text-2xl font-semibold text-indigo-900'>{responseRate}%</p></div></div>
        <div className='mt-5 flex items-center gap-2 overflow-x-auto pb-1'>{[{value: 'all', label: 'All'}, ...statuses].map((item) => <button type='button' key={item.value} onClick={() => setFilter(item.value)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${filter === item.value ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:text-slate-900'}`}>{item.label}{item.value !== 'all' && <span className='ml-1 opacity-60'>{counts[item.value] || 0}</span>}</button>)}</div>
        {showForm && <form onSubmit={saveApplication} className='mt-4 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 shadow-sm'><div className='flex items-start justify-between gap-3'><div><p className='text-sm font-semibold text-slate-900'>{editingId ? 'Edit application' : 'Add an opportunity'}</p><p className='mt-1 text-xs text-slate-500'>Capture just enough context to make your next action obvious.</p></div><button type='button' onClick={closeForm} className='rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700' aria-label='Close application form'><X className='size-4' /></button></div><div className='mt-4 grid gap-2 sm:grid-cols-2'><input value={form.companyName} onChange={(event) => updateField('companyName', event.target.value)} maxLength={120} required className='border-indigo-200 bg-white px-3 py-2 text-sm' placeholder='Company' /><input value={form.jobTitle} onChange={(event) => updateField('jobTitle', event.target.value)} maxLength={160} required className='border-indigo-200 bg-white px-3 py-2 text-sm' placeholder='Role title' /><input value={form.jobUrl} onChange={(event) => updateField('jobUrl', event.target.value)} maxLength={500} type='url' className='border-indigo-200 bg-white px-3 py-2 text-sm' placeholder='Job link (optional)' /><input value={form.location} onChange={(event) => updateField('location', event.target.value)} maxLength={160} className='border-indigo-200 bg-white px-3 py-2 text-sm' placeholder='Location or remote' /><input value={form.source} onChange={(event) => updateField('source', event.target.value)} maxLength={80} className='border-indigo-200 bg-white px-3 py-2 text-sm' placeholder='Source, e.g. LinkedIn' /><input value={form.contactName} onChange={(event) => updateField('contactName', event.target.value)} maxLength={120} className='border-indigo-200 bg-white px-3 py-2 text-sm' placeholder='Contact name (optional)' /><select value={form.status} onChange={(event) => updateField('status', event.target.value)} className='border-indigo-200 bg-white px-3 py-2 text-sm'>{statuses.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select><select value={form.resumeId} onChange={(event) => updateField('resumeId', event.target.value)} className='border-indigo-200 bg-white px-3 py-2 text-sm'><option value=''>Resume version (optional)</option>{resumes.map((resume) => <option key={resume._id} value={resume._id}>{resume.title || 'Untitled resume'}</option>)}</select><label className='text-xs text-slate-600'>Applied date<input value={form.appliedAt} onChange={(event) => updateField('appliedAt', event.target.value)} type='date' className='mt-1 block w-full border-indigo-200 bg-white px-3 py-2 text-sm' /></label><label className='text-xs text-slate-600'>Follow-up date<input value={form.followUpAt} onChange={(event) => updateField('followUpAt', event.target.value)} type='date' className='mt-1 block w-full border-indigo-200 bg-white px-3 py-2 text-sm' /></label></div><textarea value={form.notes} onChange={(event) => updateField('notes', event.target.value)} maxLength={5000} rows={3} className='mt-2 w-full border-indigo-200 bg-white px-3 py-2 text-sm' placeholder='Notes, interview details, questions, or next steps...' /><div className='mt-3 flex justify-end gap-2'><button type='button' onClick={closeForm} className='rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-white'>Cancel</button><button type='submit' disabled={isSaving} className='flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50'>{isSaving && <LoaderCircle className='size-3.5 animate-spin' />}{isSaving ? 'Saving...' : editingId ? 'Save changes' : 'Add application'}</button></div></form>}
        {isLoading ? <div className='mt-5 h-32 rounded-2xl border border-slate-200 bg-white skeleton-shimmer' /> : visibleApplications.length === 0 ? <div className='mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center'><CalendarClock className='mx-auto size-7 text-indigo-400' /><p className='mt-3 text-sm font-semibold text-slate-800'>{filter === 'all' ? 'No applications tracked yet' : `No ${statusMeta(filter).label.toLowerCase()} applications`}</p><p className='mt-1 text-xs text-slate-500'>Add your next opportunity and give it a clear next step.</p></div> : <div className='mt-5 grid gap-3'>{visibleApplications.map((application) => { const meta = statusMeta(application.status); return <article key={application._id} className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'><div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'><div className='min-w-0'><div className='flex flex-wrap items-center gap-2'><h3 className='truncate font-semibold text-slate-900'>{application.jobTitle}</h3><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${meta.tone}`}>{meta.label}</span></div><p className='mt-1 text-sm text-slate-600'>{application.companyName}{application.location ? ` · ${application.location}` : ''}</p><div className='mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400'>{application.resume?.title && <span>Resume: {application.resume.title}</span>}{application.followUpAt && <span>Follow up: {new Date(application.followUpAt).toLocaleDateString()}</span>}{application.source && <span>Via {application.source}</span>}</div></div><div className='flex shrink-0 items-center gap-1'><button type='button' onClick={() => startEdit(application)} className='rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700' aria-label={`Edit ${application.jobTitle}`}><Pencil className='size-4' /></button><button type='button' onClick={() => deleteApplication(application._id)} className='rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600' aria-label={`Delete ${application.jobTitle}`}><Trash2 className='size-4' /></button>{application.jobUrl && <a href={application.jobUrl} target='_blank' rel='noreferrer' className='rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600' aria-label={`Open ${application.jobTitle} listing`}><ExternalLink className='size-4' /></a>}</div></div>{application.notes && <p className='mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600'>{application.notes}</p>}</article>; })}</div>}
    </section>;
};

export default ApplicationTracker;
