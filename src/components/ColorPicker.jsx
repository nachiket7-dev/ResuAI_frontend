import { Check, Palette } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const ColorPicker = ({selectedColor, onChange}) => {
    const themes = [
        {name: 'Evergreen', description: 'Calm and confident', value: '#166534', swatch: '#22c55e', soft: '#dcfce7'},
        {name: 'Ocean', description: 'Clear and modern', value: '#0f766e', swatch: '#14b8a6', soft: '#ccfbf1'},
        {name: 'Cobalt', description: 'Sharp and technical', value: '#1d4ed8', swatch: '#3b82f6', soft: '#dbeafe'},
        {name: 'Plum', description: 'Distinctive and creative', value: '#7e22ce', swatch: '#a855f7', soft: '#f3e8ff'},
        {name: 'Sunset', description: 'Warm and energetic', value: '#c2410c', swatch: '#f97316', soft: '#ffedd5'},
        {name: 'Rose', description: 'Friendly and expressive', value: '#be123c', swatch: '#f43f5e', soft: '#ffe4e6'},
        {name: 'Slate', description: 'Minimal and serious', value: '#334155', swatch: '#64748b', soft: '#f1f5f9'},
        {name: 'Midnight', description: 'Bold and high contrast', value: '#111827', swatch: '#374151', soft: '#e5e7eb'},
    ]

    const [isOpen, setIsOpen] = useState(false)
    const pickerRef = useRef(null)

    useEffect(() => {
        const closeOnOutsideClick = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) setIsOpen(false)
        }
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setIsOpen(false)
        }
        document.addEventListener('mousedown', closeOnOutsideClick)
        document.addEventListener('keydown', closeOnEscape)
        return () => {
            document.removeEventListener('mousedown', closeOnOutsideClick)
            document.removeEventListener('keydown', closeOnEscape)
        }
    }, [])

    const activeTheme = themes.find((theme) => theme.value.toLowerCase() === selectedColor?.toLowerCase())

  return (
    <div ref={pickerRef} className='relative'>
        <button type='button' onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} className='flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-50 to-green-100 px-3 py-2 text-sm font-medium text-green-800 ring-1 ring-green-200 transition-all hover:-translate-y-0.5 hover:ring-green-400'>
            <span className='size-3 rounded-full ring-2 ring-white' style={{backgroundColor: activeTheme?.swatch || selectedColor}} />
            <Palette size={16} /><span className='max-sm:hidden'>Theme</span>
        </button>
        {isOpen && (
            <div className='animate-popover absolute left-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10'>
                <div className='mb-3 flex items-start justify-between px-1'>
                    <div><p className='text-sm font-semibold text-slate-900'>Choose a color theme</p><p className='mt-0.5 text-xs text-slate-500'>Set the tone for your resume.</p></div>
                    <span className='rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-green-700'>8 styles</span>
                </div>
                <div className='grid gap-2 sm:grid-cols-2'>
                {themes.map((theme) => {
                    return (
                        <button type='button' key={theme.value} className={`interactive-card group relative flex items-center gap-3 rounded-xl border p-2.5 text-left ${activeTheme?.value === theme.value ? 'border-green-400 bg-green-50/70' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`} onClick={() => {onChange(theme.value); setIsOpen(false)}} aria-label={`Use ${theme.name} color theme`}>
                            <span className='flex size-10 shrink-0 items-center justify-center rounded-xl' style={{backgroundColor: theme.soft}}><span className='size-5 rounded-full shadow-sm' style={{backgroundColor: theme.swatch}} /></span>
                            <span className='min-w-0'><span className='block text-xs font-semibold text-slate-800'>{theme.name}</span><span className='mt-0.5 block truncate text-[11px] text-slate-500'>{theme.description}</span></span>
                            {activeTheme?.value === theme.value && <Check className='ml-auto size-4 shrink-0 text-green-700' />}
                        </button>
                    ) 
                })}
                </div>
            </div>
        )}
    </div>
  )
}

export default ColorPicker
