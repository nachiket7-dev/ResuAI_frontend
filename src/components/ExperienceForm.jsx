import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import api from '../configs/api';
import toast from 'react-hot-toast';

const ExperienceForm = ({data, onChange}) => {
    const {token} = useSelector((state) => state.auth);
    const [generatingIndex, setGeneratingIndex] = useState(-1);
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
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setGeneratingIndex(-1);
        }
    }
    return (
        <div className='space-y-6'>
            <div>
                <h3 className='text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-1'>Professional Experience</h3>
                <p className='text-sm text-zinc-500 dark:text-zinc-400'>Add your job experience</p>
                <button onClick={addExperience} className='flex items-center gap-2 px-4 py-2 mt-4 text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]'>
                    <Plus className='size-4' />
                    Add Experience
                </button>
            </div>
            {data.length === 0 ? (
                <div className='text-center py-12 text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700'>
                    <Briefcase className='w-14 h-14 mx-auto mb-4 text-zinc-300 dark:text-zinc-600' />
                    <p className='font-medium'>No experience added yet</p>
                    <p className='text-sm mt-1'>Click "Add Experience" to get started.</p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {data.map((experience, index) => (
                        <div key={index} className='p-5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl space-y-4 shadow-sm hover:shadow-md transition-all duration-200'>
                            <div className='flex justify-between items-start'>
                                <h4 className='font-semibold text-zinc-900 dark:text-zinc-100'>Experience #{index + 1}</h4>
                                <button onClick={() => removeExperience(index)} className='text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-all duration-200'>
                                    <Trash2 className='size-4' />
                                </button>
                            </div>
                            <div className='grid md:grid-cols-2 gap-3'>
                                <input value={experience.company || ""} onChange={(e) => updateExperience(index, "company", e.target.value)} type="text" placeholder='Company Name' className='px-3 py-2.5 text-sm w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all' />
                                <input value={experience.position || ""} onChange={(e) => updateExperience(index, "position", e.target.value)} type="text" placeholder='Job Title' className='px-3 py-2.5 text-sm w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all' />
                                <input value={experience.start_date || ""} onChange={(e) => updateExperience(index, "start_date", e.target.value)} type="month" className='px-3 py-2.5 text-sm w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all' />
                                <input value={experience.end_date || ""} onChange={(e) => updateExperience(index, "end_date", e.target.value)} type="month" disabled={experience.is_current} className='px-3 py-2.5 text-sm w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:cursor-not-allowed' />
                            </div>
                            <label className='flex items-center gap-2 cursor-pointer'>
                                {/* Checkbox intentionally omitted for clarity, restore as needed */}
                                <span className='text-sm text-zinc-700 dark:text-zinc-300 font-medium'>Currently working here</span>
                            </label>
                            <div className='space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <label className='text-sm font-semibold text-zinc-700 dark:text-zinc-300'>Job description</label>
                                    <button disabled={generatingIndex === index || !experience.position || !experience.company} onClick={() => generateDescription(index)} className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm'>
                                        {generatingIndex === index ? (<Loader2 className='w-3 h-3 animate-spin' />) : (<Sparkles className='w-3 h-3' />)}
                                        Enhance with AI
                                    </button>
                                </div>
                                <textarea rows={4} value={experience.description || ""} onChange={(e) => updateExperience(index, "description", e.target.value)} className='w-full text-sm px-3 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all' placeholder='Describe your key responsibilities and achievements...' />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ExperienceForm