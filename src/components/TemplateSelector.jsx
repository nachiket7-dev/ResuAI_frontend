import { Check, Layout } from 'lucide-react'
import React, { useState } from 'react'

const TemplateSelector = ({selectedTemplate, onChange}) => {
    const [isOpen,setIsOpen] = useState(false)
    const templates = [
        {
            id : "classic",
            name : "Classic",
            preview : "A clean, traditional resume format with clear sections and professional typography"
        },
        {
            id : "modern",
            name : "Modern",
            preview : "Sleek design with strategic use of color and modern font choices"
        },
        {
            id : "minimal-image",
            name : "Minimal Image",
            preview : "Minimal design with a single image and clean typography"
        },
        {
            id : "minimal",
            name : "Minimal",
            preview : "Ultra-clean design that puts your content front and center"
        }
    ]
  return (
    <div className='relative'>
        <button onClick={() => setIsOpen(!isOpen)} className='flex items-center gap-1.5 text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all px-4 py-2 rounded-md shadow-sm'>
            <Layout size={16} /><span className='max-sm:hidden'>Template</span>
        </button>
        {isOpen && (
            <div className='absolute top-full w-72 p-4 mt-2 space-y-3 z-20 bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-700 shadow-lg'>
                {templates.map((template) => {
                    return (<div key={template.id} onClick={() => {onChange(template.id); setIsOpen(false)}} className={`relative p-4 border-2 rounded-md cursor-pointer transition-all duration-200 ${selectedTemplate === template.id ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 shadow-sm" : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800"}`}>
                        {selectedTemplate === template.id && (
                            <div className='absolute top-3 right-3'>
                                <div className='size-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-sm'>
                                    <Check className='w-3.5 h-3.5 text-white'/>
                                </div>
                            </div>
                        )}

                        <div className='space-y-2 pr-8'>
                            <h4 className='font-semibold text-zinc-800 dark:text-zinc-200'>{template.name}</h4>
                            <div className='p-2.5 bg-white/60 dark:bg-zinc-800/60 rounded-md text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed'>{template.preview}</div>
                        </div>
                    </div>)
                })}
            </div>
        )}
    </div>
  )
}

export default TemplateSelector