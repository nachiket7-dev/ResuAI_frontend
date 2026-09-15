import {Check, Palette, Settings2} from 'lucide-react';
import React, {useEffect, useRef, useState} from 'react';
import {DESIGN_OPTIONS, DESIGN_PRESETS, DEFAULT_DESIGN} from '../configs/designPresets';

const DesignSelector = ({design = DEFAULT_DESIGN, onChange}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [draggedSection, setDraggedSection] = useState(null);
    const selectorRef = useRef(null);
    const currentDesign = {...DEFAULT_DESIGN, ...design};
    const sectionLabels = {
        summary: 'Summary',
        experience: 'Experience',
        projects: 'Projects',
        education: 'Education',
        skills: 'Skills',
        customSections: 'Custom sections',
    };

    const updateDesign = (values) => {
        onChange({...currentDesign, ...values});
    };

    useEffect(() => {
        if (!isOpen) return undefined;
        const handlePointerDown = (event) => {
            if (!selectorRef.current?.contains(event.target)) setIsOpen(false);
        };
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    const selectPreset = (preset) => {
        updateDesign(preset.values);
        setIsOpen(false);
    };

    const reorderSection = (targetSection) => {
        if (!draggedSection || draggedSection === targetSection) return;
        const nextOrder = [...(currentDesign.sectionOrder || DEFAULT_DESIGN.sectionOrder)];
        const fromIndex = nextOrder.indexOf(draggedSection);
        const toIndex = nextOrder.indexOf(targetSection);
        nextOrder.splice(fromIndex, 1);
        nextOrder.splice(toIndex, 0, draggedSection);
        updateDesign({sectionOrder: nextOrder});
        setDraggedSection(null);
    };

    return (
        <div ref={selectorRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-100 px-3 py-2 text-sm font-medium text-blue-700 ring-1 ring-blue-200 transition-all hover:-translate-y-0.5 hover:ring-blue-400"
                aria-expanded={isOpen}
                aria-haspopup="dialog"
            >
                <Palette size={14}/><span className="max-sm:hidden">Design</span>
            </button>

            {isOpen && (
                <div className="animate-popover absolute top-full left-0 mt-2 max-h-[min(38rem,calc(100vh-7rem))] w-[min(23rem,calc(100vw-2rem))] space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10" role="dialog" aria-label="Resume design settings">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Settings2 className="size-4 text-slate-500"/>
                            <h3 className="font-semibold text-gray-800">Choose a starting style</h3>
                        </div>
                        <div className="grid gap-2">
                            {DESIGN_PRESETS.map((preset) => (
                                <button
                                    type="button"
                                    key={preset.id}
                                    onClick={() => selectPreset(preset)}
                                    className={`interactive-card relative overflow-hidden rounded-xl border p-3 text-left transition-all ${currentDesign.preset === preset.id ? 'border-green-400 bg-green-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
                                >
                                    {currentDesign.preset === preset.id && <Check className="absolute right-3 top-3 size-4 text-green-600"/>}
                                    <div className="mb-3 flex gap-1 opacity-80" aria-hidden="true"><span className="h-1.5 w-10 rounded-full bg-slate-800"/><span className="h-1.5 w-5 rounded-full bg-green-400"/><span className="h-1.5 w-7 rounded-full bg-slate-200"/></div>
                                    <p className="font-semibold text-slate-800">{preset.name}</p>
                                    <p className="mt-1 text-[11px] font-medium text-green-700">{preset.bestFor}</p>
                                    <p className="mt-1 pr-5 text-xs leading-5 text-slate-500">{preset.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t pt-4">
                        <label className="text-xs text-gray-600">
                            Layout
                            <select value={currentDesign.layout} onChange={(event) => updateDesign({layout: event.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm text-gray-800">
                                {DESIGN_OPTIONS.layout.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                            </select>
                        </label>
                        <label className="text-xs text-gray-600">
                            Density
                            <select value={currentDesign.density} onChange={(event) => updateDesign({density: event.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm text-gray-800">
                                {DESIGN_OPTIONS.density.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                            </select>
                        </label>
                        <label className="text-xs text-gray-600">
                            Font
                            <select value={currentDesign.font} onChange={(event) => updateDesign({font: event.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm text-gray-800">
                                {DESIGN_OPTIONS.font.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                            </select>
                        </label>
                        <label className="text-xs text-gray-600">
                            Skills
                            <select value={currentDesign.skillsStyle} onChange={(event) => updateDesign({skillsStyle: event.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-2 text-sm text-gray-800">
                                {DESIGN_OPTIONS.skillsStyle.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
                            </select>
                        </label>
                        <label className="flex items-center gap-2 self-end pb-2 text-xs text-gray-600">
                            <input type="checkbox" checked={currentDesign.showPhoto} onChange={(event) => updateDesign({showPhoto: event.target.checked})}/>
                            Show photo
                        </label>
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-xs font-medium text-gray-700 mb-2">Section order</p>
                        <div className="space-y-1">
                            {(currentDesign.sectionOrder || DEFAULT_DESIGN.sectionOrder).map((sectionId) => (
                                <div
                                    key={sectionId}
                                    draggable
                                    onDragStart={() => setDraggedSection(sectionId)}
                                    onDragOver={(event) => event.preventDefault()}
                                    onDrop={() => reorderSection(sectionId)}
                                    className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 cursor-grab active:cursor-grabbing"
                                >
                                    <span className="text-gray-400">⋮⋮</span>
                                    {sectionLabels[sectionId] || sectionId}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DesignSelector;
