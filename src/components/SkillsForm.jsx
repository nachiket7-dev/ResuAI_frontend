import { Plus, Sparkles, X } from 'lucide-react'
import React, { useState } from 'react'

const SkillsForm = ({data, onChange}) => {
    const [newSkill, setNewSkill] = useState("")
    const skills = data || [];
    const addSkill = () => {
        if(newSkill.trim() && !skills.includes(newSkill.trim())){
            onChange([ ...skills, newSkill.trim()])
            setNewSkill("")
        }
    }
    const removeSkill = (index) => {
        onChange(skills.filter((_, i) => i !== index))
    }
    const handleKeyPress = (e) => {
        if(e.key === "Enter"){
            e.preventDefault()
            addSkill()
        }
    }
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">Skills</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">List the abilities recruiters want to see.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Enter a skill (e.g., JavaScript, Project Management)"
          className="flex-1 min-w-[220px] rounded-md px-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          onChange={(e) => setNewSkill(e.target.value)}
          value={newSkill}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={addSkill}
          disabled={!newSkill.trim()}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide rounded-md bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          <Plus className="size-4" /> Add
        </button>
      </div>
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-md text-sm font-medium border border-indigo-100 dark:border-indigo-800">
              {skill}
              <button onClick={() => removeSkill(index)} className="ml-1 hover:bg-indigo-100 rounded-full p-0.5 transition-colors">
                <X className="w-3.5 h-3.5 text-indigo-700" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-zinc-300 dark:text-zinc-600" />
          <p className="font-medium text-zinc-700 dark:text-zinc-300">No skills added yet.</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Add your technical and soft skills above.</p>
        </div>
      )}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-md border border-zinc-200 dark:border-zinc-700">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          💡 <strong>Tip:</strong> Add 8-12 relevant skills. Combine technical tools and interpersonal strengths.
        </p>
      </div>
    </div>
  );
}

export default SkillsForm