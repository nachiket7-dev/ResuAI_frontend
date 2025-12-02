import { BriefcaseBusiness, Globe, Linkedin, Mail, MapPin, Phone, User } from 'lucide-react'
import React from 'react'

const PersonalInfoForm = ({data, onChange, removeBackground, setRemoveBackground}) => {
    const personalInfo = data || {};
    const handleChange = (field, value) => {
        onChange({...personalInfo, [field] : value})
    }
    const fields = [
        {key : "fullName", label :  "Full Name", icon : User, type : "text", required : true},
        {key : "email", label :  "Email Address", icon : Mail, type : "email", required : true},
        {key : "phone", label :  "Phone Number", icon : Phone, type : "tel"},
        {key : "location", label :  "Location", icon : MapPin, type : "text"},
        {key : "profession", label :  "Profession", icon : BriefcaseBusiness, type : "text"},
        {key : "linkedin", label :  "LinkedIn Profile", icon : Linkedin, type : "url"},
        {key : "website", label :  "Personal Website", icon : Globe, type : "url"}
    ]
  return (
    <div>
        <h3 className='text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1'>Personal Information</h3>
        <p className='text-sm text-zinc-500 dark:text-zinc-400 mb-6'>Update the details that power the header of your resume.</p>
        <div className='flex items-center gap-4 mb-6'>
            <label className='cursor-pointer'>
                {personalInfo.image ? (
                    <div className='relative group'>
                        <img src={typeof personalInfo.image === 'string' ? personalInfo.image : URL.createObjectURL(personalInfo.image)} alt="user-image" className='w-20 h-20 rounded-xl object-cover ring-2 ring-indigo-100 hover:ring-indigo-400 transition-all duration-200 shadow-sm' />
                        <div className='absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                            <User className='size-6 text-white' />
                        </div>
                    </div>
                ) : (
                    <div className='inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200 cursor-pointer shadow-sm'>
                        <User className='size-5 text-indigo-500 dark:text-indigo-400' />
                        <span className='text-sm font-medium text-zinc-700 dark:text-zinc-300'>Upload image</span>
                    </div>
                )}
                <input type="file" accept='image/jpeg, image/png' className='hidden' onChange={(e) => handleChange("image", e.target.files[0])} />
            </label>
            {typeof personalInfo.image === 'object' && (
                <div className='flex flex-col gap-2 pl-2'>
                    <p className='text-sm font-medium text-zinc-600 dark:text-zinc-400'>Remove background</p>
                    <label className='relative inline-flex items-center cursor-pointer gap-3'>
                        <input type="checkbox" className='sr-only peer' onChange={() => setRemoveBackground(prev => !prev)} checked={removeBackground} />
                        <div className='w-11 h-6 bg-zinc-200 rounded-full peer peer-checked:bg-indigo-600 transition-colors duration-200 shadow-inner'>

                        </div>
                        <span className='absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out shadow-sm peer-checked:translate-x-5'></span>
                    </label>
                </div>
            )}
        </div>
        {fields.map((field) => {
            const Icon = field.icon
            return (
                <div key={field.key} className='space-y-2 mb-5'>
                    <label className='flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300'>
                        <Icon className='size-4 text-zinc-400 dark:text-zinc-500'/>
                        {field.label}
                        {field.required && <span className='text-red-500 dark:text-red-400'>*</span>}
                    </label>
                    <input
                        type={field.type}
                        value={personalInfo[field.key] || ""}
                        onChange={(e) => handleChange(field.key,e.target.value)}
                        className='w-full px-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all'
                        placeholder={`Enter your ${field.key.toLowerCase()}`}
                        required={field.required}
                    />
                </div>
            )
        })}
    </div>
  )
}

export default PersonalInfoForm