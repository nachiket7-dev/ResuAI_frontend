import {BriefcaseBusiness, Check, LoaderCircle, Plus, Trash2} from 'lucide-react';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';

const emptyProfile = {name: '', jobTitle: '', companyName: '', jobDescription: '', tone: 'confident and warm'};

const TargetProfilePanel = ({onSelect}) => {
    const {token} = useSelector((state) => state.auth);
    const [profiles, setProfiles] = useState([]);
    const [profileId, setProfileId] = useState('');
    const [form, setForm] = useState(emptyProfile);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProfiles = async () => {
            try {
                const {data} = await api.get('/api/users/target-profiles', {headers: {Authorization: token}});
                setProfiles(data.profiles || []);
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Unable to load target profiles');
            } finally {
                setIsLoading(false);
            }
        };
        loadProfiles();
    }, [token]);

    const updateField = (field, value) => setForm((current) => ({...current, [field]: value}));

    const selectProfile = (id) => {
        setProfileId(id);
        const profile = profiles.find((item) => item._id === id);
        if (!profile) {
            setForm(emptyProfile);
            onSelect(null);
            return;
        }
        setForm({...emptyProfile, ...profile});
        onSelect(profile);
    };

    const saveProfile = async (event) => {
        event.preventDefault();
        if (!form.name.trim()) return toast.error('Give this target profile a name');
        setIsSaving(true);
        try {
            const config = {headers: {Authorization: token}};
            const response = profileId
                ? await api.put(`/api/users/target-profiles/${profileId}`, form, config)
                : await api.post('/api/users/target-profiles', form, config);
            const saved = response.data.profile;
            setProfiles((current) => profileId ? current.map((item) => item._id === profileId ? saved : item) : [...current, saved]);
            setProfileId(saved._id);
            setForm({...emptyProfile, ...saved});
            onSelect(saved);
            toast.success('Target profile saved');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to save target profile');
        } finally {
            setIsSaving(false);
        }
    };

    const deleteProfile = async () => {
        if (!profileId || !window.confirm('Delete this target profile?')) return;
        try {
            await api.delete(`/api/users/target-profiles/${profileId}`, {headers: {Authorization: token}});
            setProfiles((current) => current.filter((item) => item._id !== profileId));
            setProfileId('');
            setForm(emptyProfile);
            onSelect(null);
            toast.success('Target profile deleted');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Unable to delete target profile');
        }
    };

    return <div className='mt-6 rounded-2xl border border-cyan-200 bg-cyan-50/60 p-4' aria-label='Target job profiles'>
        <div className='flex items-start justify-between gap-3'><div><p className='flex items-center gap-2 text-sm font-semibold text-slate-800'><BriefcaseBusiness className='size-4 text-cyan-700' /> Target profiles</p><p className='mt-1 text-xs leading-5 text-slate-500'>Save the role context you apply to often and reuse it across AI tools.</p></div><span className='rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-cyan-700 ring-1 ring-cyan-200'>{profiles.length}/12 saved</span></div>
        <div className='mt-3 flex items-center gap-2'><select value={profileId} onChange={(event) => selectProfile(event.target.value)} disabled={isLoading} className='min-w-0 flex-1 border-cyan-200 bg-white px-3 py-2 text-xs text-slate-700'><option value=''>{isLoading ? 'Loading profiles...' : 'Choose a saved profile'}</option>{profiles.map((profile) => <option key={profile._id} value={profile._id}>{profile.name}</option>)}</select><button type='button' onClick={() => {setProfileId(''); setForm(emptyProfile); onSelect(null)}} className='flex items-center gap-1 rounded-lg bg-white px-2.5 py-2 text-xs font-semibold text-cyan-700 ring-1 ring-cyan-200 transition hover:bg-cyan-100'><Plus className='size-3.5' /> New</button></div>
        <form onSubmit={saveProfile} className='mt-3 space-y-2'>
            <div className='grid gap-2 sm:grid-cols-3'><input value={form.name} onChange={(event) => updateField('name', event.target.value)} maxLength={120} required className='border-cyan-200 bg-white px-3 py-2 text-sm sm:col-span-1' placeholder='Profile name' /><input value={form.jobTitle} onChange={(event) => updateField('jobTitle', event.target.value)} maxLength={160} className='border-cyan-200 bg-white px-3 py-2 text-sm sm:col-span-1' placeholder='Target role' /><input value={form.companyName} onChange={(event) => updateField('companyName', event.target.value)} maxLength={120} className='border-cyan-200 bg-white px-3 py-2 text-sm sm:col-span-1' placeholder='Company' /></div>
            <textarea value={form.jobDescription} onChange={(event) => updateField('jobDescription', event.target.value)} maxLength={16000} rows={4} className='w-full border-cyan-200 bg-white px-3 py-2 text-sm' placeholder='Paste the role description once, then reuse it...' />
            <div className='flex items-center justify-between gap-2'><select value={form.tone} onChange={(event) => updateField('tone', event.target.value)} className='border-cyan-200 bg-white px-3 py-2 text-xs text-slate-700'><option>confident and warm</option><option>direct and concise</option><option>thoughtful and conversational</option></select><div className='flex items-center gap-2'><button type='submit' disabled={isSaving} className='flex items-center gap-1.5 rounded-xl bg-cyan-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-800 disabled:opacity-50'>{isSaving ? <LoaderCircle className='size-3.5 animate-spin' /> : <Check className='size-3.5' />}{isSaving ? 'Saving...' : 'Save profile'}</button>{profileId && <button type='button' onClick={deleteProfile} className='rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600' aria-label='Delete target profile'><Trash2 className='size-4' /></button>}</div></div>
        </form>
    </div>;
};

export default TargetProfilePanel;
