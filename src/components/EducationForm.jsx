import { GraduationCap, Plus, Trash2 } from 'lucide-react'
import React from 'react'

const EducationForm = ({data, onChange}) => {
    const addEducation = () => {
        const newEducation = {
            institution : "",
            degree : "",
            field : "",
            graduation_date : "",
            gpa : ""
        }
        onChange([ ...data, newEducation])
    }
    const removeEducation = (index) => {
        const updated = data.filter((_, i) => i !== index)
        onChange(updated)
    }
    const updateEducation = (index, field, value) => {
        const updated = [...data]
        updated[index] = {...updated[index], [field] : value}
        onChange(updated)
    }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">Education</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">List your academic achievements.</p>
        </div>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium uppercase tracking-wide bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition"
        >
          <Plus className="size-4" />
          Add Education
        </button>
      </div>
      {data.length === 0 ? (
        <div className="text-center py-10 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl">
          <GraduationCap className="w-14 h-14 mx-auto mb-4 text-zinc-300 dark:text-zinc-600" />
          <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">No education added yet</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Click "Add Education" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((education, index) => (
            <div
              key={index}
              className="card rounded-xl p-5 space-y-3 shadow-sm transition hover:shadow-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Education #{index + 1}</h4>
                <button
                  onClick={() => removeEducation(index)}
                  className="p-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:text-red-500 dark:hover:text-red-400 transition"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <input value={education.institution || ""} onChange={(e) => updateEducation(index, "institution", e.target.value)} type="text" placeholder="Institution Name" className="w-full px-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                <input value={education.degree || ""} onChange={(e) => updateEducation(index, "degree", e.target.value)} type="text" placeholder="Degree" className="w-full px-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                <input value={education.field || ""} onChange={(e) => updateEducation(index, "field", e.target.value)} type="text" className="w-full px-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="Field of Study" />
                <input value={education.graduation_date || ""} onChange={(e) => updateEducation(index, "graduation_date", e.target.value)} type="month" className="w-full px-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
              </div>
              <input value={education.gpa || ""} onChange={(e) => updateEducation(index, "gpa", e.target.value)} type="text" className="w-full px-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" placeholder="GPA (optional)" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EducationForm