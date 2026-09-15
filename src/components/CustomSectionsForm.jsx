import {GripVertical, Plus, Trash2} from 'lucide-react';
import React from 'react';

const CustomSectionsForm = ({data = [], onChange}) => {
    const addSection = () => onChange([...data, {title: '', content: ''}]);
    const updateSection = (index, field, value) => {
        const next = [...data];
        next[index] = {...next[index], [field]: value};
        onChange(next);
    };
    const removeSection = (index) => onChange(data.filter((_, itemIndex) => itemIndex !== index));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Custom Sections</h3>
                    <p className="text-sm text-gray-500">Add certifications, awards, volunteering, publications, or anything else.</p>
                </div>
                <button type="button" onClick={addSection} className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                    <Plus className="size-4"/> Add Section
                </button>
            </div>

            {data.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No custom sections yet.</p>
                    <p className="text-sm">Use this for content that does not fit the standard sections.</p>
                </div>
            ) : data.map((section, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-500">
                            <GripVertical className="size-4"/>
                            <span className="text-sm font-medium text-gray-700">Section #{index + 1}</span>
                        </div>
                        <button type="button" onClick={() => removeSection(index)} className="text-red-500 hover:text-red-700" aria-label={`Remove section ${index + 1}`}>
                            <Trash2 className="size-4"/>
                        </button>
                    </div>
                    <input value={section.title || ''} onChange={(event) => updateSection(index, 'title', event.target.value)} placeholder="Section title" className="w-full px-3 py-2 text-sm" maxLength={80}/>
                    <textarea value={section.content || ''} onChange={(event) => updateSection(index, 'content', event.target.value)} placeholder="Add details. Use a new line for each bullet point." rows={5} className="w-full px-3 py-2 text-sm" maxLength={5000}/>
                </div>
            ))}
        </div>
    );
};

export default CustomSectionsForm;
