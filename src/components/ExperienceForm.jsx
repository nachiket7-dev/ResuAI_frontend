import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';
import {notifyAIComplete} from '../utils/aiEvents';

const ExperienceForm = ({data, onChange, resumeId}) => {
    const {token} = useSelector((state) => state.auth);
    const [generatingIndex, setGeneratingIndex] = useState(-1);
    const [rewriteOptions, setRewriteOptions] = useState(null);
    const addExperience = () => {
        const newExperience = {
            company : "",
            position : "",
            start_date : "",
            end_date : "",
            description : "",
            is_current : false,
        }
        onChange([ ...data, newExperience])
    }
    const removeExperience = (index) => {
        const updated = data.filter((_, i) => i !== index)
        onChange(updated)
    }
    const updateExperience = (index, field, value) => {
        const updated = [...data]
        updated[index] = {...updated[index], [field] : value}
        onChange(updated)
    }
    const generateDescription = async (index) => {
        setGeneratingIndex(index);
        const experience = data[index];
        const prompt = `Enhance this job description ${experience.description} for the position of ${experience.position} at ${experience.company}.`;
        try {
            const {data: responseData} = await api.post('/api/ai/enhance-job-desc', {userContent: prompt}, {headers: {Authorization: token}});
            updateExperience(index, "description", responseData.enhancedContent);
            notifyAIComplete();
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setGeneratingIndex(-1);
        }
    }
    const rewriteBullet = async (index) => {
        setGeneratingIndex(index);
        setRewriteOptions(null);
        const experience = data[index];
        try {
            const {data: responseData} = await api.post('/api/ai/rewrite-bullet', {
                resumeId,
                bullet: experience.description,
                position: experience.position,
                company: experience.company,
            }, {headers: {Authorization: token}});
            setRewriteOptions({index, rewrites: responseData.result?.rewrites || []});
            notifyAIComplete();
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setGeneratingIndex(-1);
        }
    }
  return (
    <div className='space-y-6'>
        <div className='flex items-center justify-between'>
            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Experience</h3>
                <p className='text-sm text-gray-500'>Add your job experience</p>
            </div>
            <button type='button' onClick={addExperience} className='flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'>
                <Plus className='size-4' />
                Add Experience
            </button>
        </div>
        {data.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
                <Briefcase className='w-12 h-12 mx-auto mb-3 text-gray-300' />
                <p>No experience added yet</p>
                <p className='text-sm'>Click "Add Experience" to get started.</p>
            </div>
        ): (
            <div className='space-y-4'>
                {data.map((experience, index) => {
                    return (<div key={index} className='interactive-card space-y-3 rounded-2xl border border-gray-200 p-4'>
                        <div className='flex justify-between items-start'>
                            <h4>Experience #{index + 1}</h4>
                            <button type='button' onClick={() => removeExperience(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                                <Trash2 className='size-4' />
                            </button>
                        </div>

                        <div className='grid md:grid-cols-2 gap-3'>

                           <input value={experience.company || ""} onChange={(e) => updateExperience(index, "company", e.target.value)} type="text" placeholder='Company Name' className='px-3 py-2 text-sm rounded-lg' /> 

                           <input value={experience.position || ""} onChange={(e) => updateExperience(index, "position", e.target.value)} type="text" placeholder='Job Title' className='px-3 py-2 text-sm rounded-lg' /> 

                           <input value={experience.start_date || ""} onChange={(e) => updateExperience(index, "start_date", e.target.value)} type="month" className='px-3 py-2 text-sm rounded-lg' />

                           <input value={experience.end_date || ""} onChange={(e) => updateExperience(index, "end_date", e.target.value)} type="month" disabled={experience.is_current} className='px-3 py-2 text-sm rounded-lg disabled:bg-gray-100' />
                        </div>
                        <label className='flex items-center gap-2'>
                            <input type="checkbox" checked={experience.is_current || false} onChange={(e) => {updateExperience(index, "is_current", e.target.checked ? true : false);}} className='rounded border-gray-300 text-green-600 focus:ring-green-500' />
                            <span className='text-sm text-gray-700'>Currently working here</span>
                        </label>

                        <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                                <label className='text-sm font-medium text-gray-700'>Job description</label>
                                <div className='flex items-center gap-2'>
                                <button type='button' disabled={generatingIndex === index || !experience.position || !experience.company} onClick={() => generateDescription(index)} className='flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'>
                                    {generatingIndex === index ? (<Loader2 className='w-3 h-3 animate-spin' />) : (<Sparkles className='w-3 h-3' />)}
                                    Enhance with AI
                                </button>
                                <button type='button' disabled={generatingIndex === index || !resumeId || !experience.description?.trim()} onClick={() => rewriteBullet(index)} className='flex items-center gap-1 px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors disabled:opacity-50'>
                                    <Sparkles className='w-3 h-3' /> Rewrite options
                                </button>
                                </div>
                            </div>
                            <textarea rows={4} value={experience.description || ""} onChange={(e) => updateExperience(index, "description", e.target.value)} className='w-full text-sm px-3 py-2 rounded-lg resize-none' placeholder='Describe your key responsibilities and achievements...' />
                            {rewriteOptions?.index === index && <div className='space-y-2 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3'>
                                <p className='text-xs font-semibold text-emerald-900'>Choose a grounded rewrite</p>
                                {rewriteOptions.rewrites.length > 0 ? rewriteOptions.rewrites.map((rewrite) => <button type='button' key={`${rewrite.focus}-${rewrite.text}`} onClick={() => {updateExperience(index, 'description', rewrite.text); setRewriteOptions(null)}} className='block w-full rounded-lg bg-white p-3 text-left text-xs leading-5 text-slate-700 ring-1 ring-emerald-100 transition hover:-translate-y-0.5 hover:ring-emerald-300'><span className='mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700'>{rewrite.focus}</span>{rewrite.text}</button>) : <p className='text-xs text-slate-500'>No rewrite options were returned. Try again with a fuller bullet.</p>}
                            </div>}
                        </div>
                    </div>)
                })}
            </div>
        )}
    </div>
  )
}

export default ExperienceForm
