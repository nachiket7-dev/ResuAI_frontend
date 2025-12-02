import { Check, Palette } from 'lucide-react'
import React, { useState } from 'react'

const ColorPicker = ({selectedColor, onChange}) => {
    const colors = [
        {name : "Blue", value : "#3B82F6"},
        {name : "Red", value : "#EF4444"},
        {name : "Green", value : "#10B981"},
        {name : "Purple", value : "#8B5CF6"},
        {name : "Orange", value : "#F97316"},
        {name : "Indigo", value : "#6366F1"},
        {name : "Teal", value : "#14B8A6"},
        {name : "Pink", value : "#EC4899"},
        {name : "Gray", value : "#6B7280"},
        {name : "Black", value : "#1F2937"},
    ]
    const [isOpen,setIsOpen] = useState(false)
  return (
    <div className='relative'>
        <button onClick={() => setIsOpen(!isOpen)} className='flex items-center gap-1.5 text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all px-4 py-2 rounded-md shadow-sm'>
            <Palette size={16} /><span className='max-sm:hidden'>Accent</span>
        </button>
        {isOpen && (
            <div className='grid grid-cols-5 w-72 gap-3 absolute top-full left-0 p-4 mt-2 z-20 bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-700 shadow-lg'>
                {colors.map((color) => {
                    return (
                        <div key={color.value} className='relative cursor-pointer group flex flex-col items-center' onClick={() => {onChange(color.value); setIsOpen(false)}}>
                            <div className='w-12 h-12 rounded-full border-2 border-transparent group-hover:border-zinc-400 group-hover:scale-110 transition-all duration-200 shadow-sm' style={{backgroundColor : color.value}}>
                            </div>
                            {selectedColor === color.value && (
                                <div className='absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center'>
                                    <div className='w-12 h-12 rounded-full bg-black/20 flex items-center justify-center'>
                                        <Check className='size-5 text-white drop-shadow-lg'/>
                                    </div>
                                </div>
                            )}
                            <p className='text-xs text-center text-zinc-600 dark:text-zinc-400 font-medium mt-2'>{color.name}</p>
                        </div>
                    ) 
                })}
            </div>
        )}
    </div>
  )
}

export default ColorPicker