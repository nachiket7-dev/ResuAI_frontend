import {BadgeCheck, BookOpen, Check, LoaderCircle, Pencil, Plus, Search, Trash2, X} from 'lucide-react';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';

const categories = [
    {value: 'achievement', label: 'Achievement'},
    {value: 'project', label: 'Project'},
    {value: 'responsibility', label: 'Responsibility'},
    {value: 'metric', label: 'Metric'},
    {value: 'feedback', label: 'Feedback'},
    {value: 'other', label: 'Other'},
];
const emptyForm = {category: 'achievement', title: '', content: '', metric: '', company: '', role: '', skills: '', source: '', verified: false};
const categoryLabel = (value) => categories.find((item) => item.value === value)?.label || 'Other';

const EvidenceBank = () => {
    const {token} = useSelector((state) => state.auth);
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [editingId, setEditingId] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const loadItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const {data} = await api.get('/api/evidence', {headers: {Authorization: token}});
            setItems(data.items || []);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to load evidence bank');
        } finally {
            setIsLoading(false);
        }
    }, [token]);
    useEffect(() => { loadItems(); }, [loadItems]);

    const visibleItems = useMemo(() => {
        const query = search.trim().toLowerCase();
        return items.filter((item) => (filter === 'all' || item.category === filter) && (!query || [item.title, item.content, item.company, ...(item.skills || [])].join(' ').toLowerCase().includes(query)));
    }, [filter, items, search]);

    const updateField = (field, value) => setForm((current) => ({...current, [field]: value}));
    const startCreate = () => { setForm(emptyForm); setEditingId(''); setShowForm(true); };
    const startEdit = (item) => { setEditingId(item._id); setForm({...emptyForm, ...item, skills: (item.skills || []).join(', ')}); setShowForm(true); };
    const closeForm = () => { setShowForm(false); setEditingId(''); setForm(emptyForm); };

    const saveItem = async (event) => {
        event.preventDefault();
        setIsSaving(true);
        try {
            const payload = {...form, skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean)};
            const config = {headers: {Authorization: token}};
            const response = editingId ? await api.put(`/api/evidence/${editingId}`, payload, config) : await api.post('/api/evidence', payload, config);
            const saved = response.data.item;
            setItems((current) => editingId ? current.map((item) => item._id === editingId ? saved : item) : [saved, ...current]);
            closeForm();
            toast.success(editingId ? 'Evidence updated' : 'Evidence saved');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to save evidence');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteItem = async (id) => {
        if (!window.confirm('Delete this evidence item?')) return;
        try {
            await api.delete(`/api/evidence/${id}`, {headers: {Authorization: token}});
            setItems((current) => current.filter((item) => item._id !== id));
            toast.success('Evidence deleted');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to delete evidence');
        }
    };

    return <section className='mt-12 border-t border-slate-200 pt-8' aria-label='Evidence bank'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'><div><p className='text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700'>Evidence bank</p><h2 className='mt-2 text-2xl font-semibold tracking-tight text-slate-950'>Keep your proof close.</h2><p className='mt-1 max-w-xl text-sm text-slate-500'>Save real outcomes, metrics, and feedback once. Tailoring can reuse them without making anything up.</p></div><button type='button' onClick={startCreate} className='flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800'><Plus className='size-4' /> Add evidence</button></div>
        <div className='mt-5 flex flex-col gap-2 sm:flex-row'><label className='relative flex-1'><Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400' /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder='Search achievements, skills, companies...' aria-label='Search evidence bank' className='w-full border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm' /></label><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label='Filter evidence category' className='border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600'><option value='all'>All evidence</option>{categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
        {showForm && <form onSubmit={saveItem} className='mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm'><div className='flex items-start justify-between gap-3'><div><p className='text-sm font-semibold text-slate-900'>{editingId ? 'Edit evidence' : 'Add proof from your work'}</p><p className='mt-1 text-xs text-slate-500'>Write the fact in your own words. Include a number whenever you have one.</p></div><button type='button' onClick={closeForm} className='rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700' aria-label='Close evidence form'><X className='size-4' /></button></div><div className='mt-4 grid gap-2 sm:grid-cols-2'><input value={form.title} onChange={(event) => updateField('title', event.target.value)} maxLength={160} required className='border-emerald-200 bg-white px-3 py-2 text-sm' placeholder='Short title, e.g. Reduced build time' /><select value={form.category} onChange={(event) => updateField('category', event.target.value)} className='border-emerald-200 bg-white px-3 py-2 text-sm'>{categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select><input value={form.company} onChange={(event) => updateField('company', event.target.value)} maxLength={120} className='border-emerald-200 bg-white px-3 py-2 text-sm' placeholder='Company or project' /><input value={form.role} onChange={(event) => updateField('role', event.target.value)} maxLength={160} className='border-emerald-200 bg-white px-3 py-2 text-sm' placeholder='Role or context' /><input value={form.metric} onChange={(event) => updateField('metric', event.target.value)} maxLength={240} className='border-emerald-200 bg-white px-3 py-2 text-sm' placeholder='Metric, e.g. 35% faster' /><input value={form.skills} onChange={(event) => updateField('skills', event.target.value)} maxLength={1200} className='border-emerald-200 bg-white px-3 py-2 text-sm' placeholder='Skills, comma separated' /></div><textarea value={form.content} onChange={(event) => updateField('content', event.target.value)} maxLength={3000} rows={4} required className='mt-2 w-full border-emerald-200 bg-white px-3 py-2 text-sm' placeholder='What did you do, how did you do it, and what changed?' /><div className='mt-2 flex flex-col gap-2 sm:flex-row'><input value={form.source} onChange={(event) => updateField('source', event.target.value)} maxLength={180} className='flex-1 border-emerald-200 bg-white px-3 py-2 text-sm' placeholder='Source or proof, e.g. quarterly review' /><label className='flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs text-slate-700'><input type='checkbox' checked={form.verified} onChange={(event) => updateField('verified', event.target.checked)} /> I verified this fact</label></div><div className='mt-3 flex justify-end gap-2'><button type='button' onClick={closeForm} className='rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-white'>Cancel</button><button type='submit' disabled={isSaving} className='flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50'>{isSaving && <LoaderCircle className='size-3.5 animate-spin' />}{isSaving ? 'Saving...' : editingId ? 'Save changes' : 'Save evidence'}</button></div></form>}
        {isLoading ? <div className='mt-5 h-36 rounded-2xl border border-slate-200 bg-white skeleton-shimmer' /> : visibleItems.length === 0 ? <div className='mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center'><BookOpen className='mx-auto size-7 text-emerald-500' /><p className='mt-3 text-sm font-semibold text-slate-800'>{search ? 'No matching evidence' : 'Your evidence bank is empty'}</p><p className='mt-1 text-xs text-slate-500'>Add a result, metric, project moment, or piece of feedback to make future tailoring stronger.</p></div> : <div className='mt-5 grid gap-3 md:grid-cols-2'>{visibleItems.map((item) => <article key={item._id} className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'><div className='flex items-start justify-between gap-3'><div><div className='flex flex-wrap items-center gap-2'><span className='rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700'>{categoryLabel(item.category)}</span>{item.verified && <span className='flex items-center gap-1 text-[10px] font-semibold text-blue-600'><BadgeCheck className='size-3.5' /> Verified</span>}</div><h3 className='mt-2 font-semibold text-slate-900'>{item.title}</h3></div><div className='flex items-center gap-1'><button type='button' onClick={() => startEdit(item)} className='rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700' aria-label={`Edit ${item.title}`}><Pencil className='size-4' /></button><button type='button' onClick={() => deleteItem(item._id)} className='rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600' aria-label={`Delete ${item.title}`}><Trash2 className='size-4' /></button></div></div><p className='mt-2 text-sm leading-6 text-slate-600'>{item.content}</p>{(item.metric || item.company || item.role) && <p className='mt-3 text-xs font-medium text-slate-500'>{[item.metric, item.company, item.role].filter(Boolean).join(' · ')}</p>}{item.skills?.length > 0 && <div className='mt-3 flex flex-wrap gap-1.5'>{item.skills.map((skill) => <span key={skill} className='rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-600'>{skill}</span>)}</div>}{item.source && <p className='mt-3 text-[11px] text-slate-400'>Source: {item.source}</p>}</article>)}</div>}
    </section>;
};

export default EvidenceBank;
