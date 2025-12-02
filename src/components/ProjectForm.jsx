import { FolderIcon, Plus, Trash2 } from 'lucide-react'
import React from 'react'

const ProjectForm = ({data, onChange}) => {
    const projects = data || [];
    const addProject = () => {
        const newProject = {
            name : "",
            type : "",
            description : "",
        }
        onChange([ ...projects, newProject])
    }
    const removeProject = (index) => {
        const updated = projects.filter((_, i) => i !== index)
        onChange(updated)
    }
    const updateProject = (index, field, value) => {
        const updated = [...projects]
        updated[index] = {...updated[index], [field] : value}
        onChange(updated)
    } 
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">Projects</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Highlight your standout builds.</p>
        </div>
        <button
          onClick={addProject}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wide bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 hover:shadow-md transition"
        >
          <Plus className="size-4" />
          Add Projects
        </button>
      </div>
      {projects.length === 0 ? (
        <div className="text-center py-10 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl">
          <FolderIcon className="w-14 h-14 mx-auto mb-4 text-zinc-300 dark:text-zinc-600" />
          <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">No projects added yet</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Click "Add Projects" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4 mt-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="card rounded-xl p-5 space-y-4 shadow-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 transition hover:shadow-md"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Project #{index + 1}</h4>
                <button
                  onClick={() => removeProject(index)}
                  className="p-1.5 rounded-md border border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-red-500 transition"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="grid gap-3">
                <input
                  value={project.name || ""}
                  onChange={(e) => updateProject(index, "name", e.target.value)}
                  type="text"
                  placeholder="Project Name"
                  className="w-full px-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <input
                  value={project.type || ""}
                  onChange={(e) => updateProject(index, "type", e.target.value)}
                  type="text"
                  placeholder="Project Type"
                  className="w-full px-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <textarea
                  rows={4}
                  value={project.description || ""}
                  onChange={(e) => updateProject(index, "description", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Describe your project..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectForm