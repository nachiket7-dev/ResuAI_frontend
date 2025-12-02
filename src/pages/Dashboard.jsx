import { FilePenLineIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'


const Dashboard = () => {

    const {token, user} = useSelector((state) => state.auth);


    const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"]
    const [allResumes, setAllResumes] = useState([])
    const [showCreateResume, setShowCreateResume] = useState(false)
    const [showUploadResume, setShowUploadResume] = useState(false)
    const [title, setTitle] = useState('')
    const [resume, setResume] = useState(null)
    const [editResumeId, setEditResumeId] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    // Search, Sort, Pagination State
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('newest')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [debouncedSearch, setDebouncedSearch] = useState(search)

    const navigate = useNavigate()

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(1) // Reset to page 1 on new search
        }, 500)
        return () => clearTimeout(timer)
    }, [search])

    const loadAllResumes = useCallback(async () => {
        try {
            if (token) {
                const {data} = await api.get(`/api/users/resumes?search=${debouncedSearch}&sort=${sort}&page=${page}&limit=6`, {headers: {Authorization: token}})
                setAllResumes(data.resumes || [])
                setTotalPages(data.totalPages || 1)
            }
        } catch (error) {
            console.error('Error loading resumes:', error)
            setAllResumes([])
    }   
    }, [token, debouncedSearch, sort, page])   
    const createResume = async (event) => {
        try {
            event.preventDefault()
            const {data} = await api.post('/api/resumes/create', {title}, {headers: {Authorization: token}})
            setTitle('')
            setShowCreateResume(false)
            toast.success('Resume created successfully')
            navigate(`/app/builder/${data.resume._id}`)
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }
    const uploadResume = async (event) => {
        event.preventDefault()
        
        if (!resume) {
            toast.error('Please select a PDF file')
            return
        }
        
        if (!title) {
            toast.error('Please enter a resume title')
            return
        }
        
        setIsLoading(true)
        try {
            const resumeText = await pdfToText(resume)
            if (!resumeText || resumeText.trim().length === 0) {
                toast.error('Failed to extract text from PDF. Please ensure the file is a valid PDF.')
                setIsLoading(false)
                return
            }
            const {data} = await api.post('/api/ai/upload-resume', {title, resumeText}, {headers: {Authorization: token}})
            setTitle('')
            setResume(null)
        setShowUploadResume(false)
            toast.success('Resume uploaded successfully')
            navigate(`/app/builder/${data.resumeId}`)
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || 'Failed to upload resume')
        } finally {
            setIsLoading(false)
        }
    }
    const editTitle = async (event) => {
        try {
        event.preventDefault()
            const currentResume = allResumes.find(resume => resume._id === editResumeId)
            if (!currentResume) {
                toast.error('Resume not found')
                return
            }
            const updatedResume = {...currentResume, title}
            const resumeDataString = JSON.stringify(updatedResume)
            const {data} = await api.put('/api/resumes/update', {
                resumeId: editResumeId, 
                resumeData: resumeDataString
            }, {headers: {Authorization: token}})
            setAllResumes(allResumes.map(resume => resume._id === editResumeId ? {...resume, title} : resume))
            setTitle('')
            setEditResumeId('')
            toast.success(data.message || 'Title updated successfully')
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }
    const deleteResume = async (resumeId) => {
        const confirm = window.confirm("Are you sure you want to delete this resume?")
        if (confirm){
            try {
                await api.delete(`/api/resumes/delete/${resumeId}`, {headers: {Authorization: token}})
            setAllResumes(prev => prev.filter(resume => resume._id !== resumeId))
                toast.success('Resume deleted successfully')
            } catch (error) {
                toast.error(error?.response?.data?.message || error.message)
            }
        }
    }
    useEffect(() => {
        loadAllResumes()
    },[loadAllResumes])
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-emerald-50 to-sky-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        <div className="flex flex-col gap-3">
          <span className="pill w-fit">Resume workspace</span>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
            Welcome back, <span className="text-emerald-600">{user?.name || "User"}</span>
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 max-w-3xl">
            Manage drafts, publish public links, or import a PDF to jump straight into editing.
          </p>
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input 
                    type="text" 
                    placeholder="Search resumes..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-600 dark:text-zinc-400">
                    <Filter className="size-4" />
                    <select 
                        value={sort} 
                        onChange={(e) => setSort(e.target.value)}
                        className="bg-transparent outline-none cursor-pointer"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="a-z">Title (A-Z)</option>
                        <option value="z-a">Title (Z-A)</option>
                    </select>
                </div>
            </div>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <button
            onClick={() => setShowCreateResume(true)}
            className="card px-6 py-7 flex flex-col items-start gap-3 hover:-translate-y-0.5 transition bg-gradient-to-br from-white to-emerald-50 dark:from-zinc-900 dark:to-zinc-800/50 border-emerald-100 dark:border-zinc-700 shadow-sm dark:shadow-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <PlusIcon className="size-5" />
            </div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">Create a Resume</p>
            <p className="text-sm text-slate-500 dark:text-zinc-400">Start with a clean template and customize everything.</p>
          </button>
          <button
            onClick={() => setShowUploadResume(true)}
            className="card px-6 py-7 flex flex-col items-start gap-3 hover:-translate-y-0.5 transition bg-gradient-to-br from-white to-sky-50 dark:from-zinc-900 dark:to-zinc-800/50 border-sky-100 dark:border-zinc-700 shadow-sm dark:shadow-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <UploadCloudIcon className="size-5" />
            </div>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">Upload Existing</p>
            <p className="text-sm text-slate-500 dark:text-zinc-400">Drop in a PDF and we’ll pull out the structured content.</p>
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length];
            return (
              <button
            onClick={() => navigate(`/app/builder/${resume._id}`)}
                key={resume._id}
            className="card relative rounded-[24px] min-h-[200px] p-5 text-left transition hover:-translate-y-0.5 hover:border-emerald-200 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800/80"
                style={{
                  boxShadow: "0 18px 35px rgba(15,23,42,0.08)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <FilePenLineIcon className="text-slate-500" />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteResume(resume._id);
                      }}
                      className="border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 p-2 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
                    >
                      <TrashIcon className="size-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditResumeId(resume._id);
                        setTitle(resume.title);
                      }}
                      className="border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 p-2 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-800 transition"
                    >
                      <PencilIcon className="size-4" />
                    </button>
                  </div>
                </div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{resume.title}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
                <div
                  className="absolute inset-x-6 bottom-6 h-1 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${baseColor}, ${baseColor}55)` }}
                />
              </button>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
                <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition text-zinc-600 dark:text-zinc-400"
                >
                    <ChevronLeft className="size-5" />
                </button>
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Page {page} of {totalPages}
                </span>
                <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition text-zinc-600 dark:text-zinc-400"
                >
                    <ChevronRight className="size-5" />
                </button>
            </div>
        )}

        {(showCreateResume || showUploadResume || editResumeId) && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            {showCreateResume && (
              <form
                onSubmit={createResume}
                onClick={(e) => e.stopPropagation()}
                className="card w-full max-w-lg p-8 space-y-6 dark:bg-zinc-900 dark:border-zinc-800"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Create new workspace</p>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Create a Resume</h2>
                </div>
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  type="text"
                  placeholder="Enter Resume Title"
                  className="w-full px-4 py-3 text-sm bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-2xl text-slate-900 dark:text-white"
                  required
                />
                <div className="flex gap-3 flex-wrap">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-emerald-500 text-white font-semibold shadow-[0_20px_35px_rgba(16,185,129,0.35)]"
                  >
                    Create Resume
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateResume(false);
                      setTitle("");
                    }}
                    className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {showUploadResume && (
              <form
                onSubmit={(event) => {
                  event.stopPropagation();
                  uploadResume(event);
                }}
                className="card w-full max-w-lg p-8 space-y-6 dark:bg-zinc-900 dark:border-zinc-800"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Upload existing PDF</p>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Upload Resume</h2>
                </div>
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  type="text"
                  placeholder="Enter Resume Title"
                  className="w-full px-4 py-3 text-sm bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-2xl text-slate-900 dark:text-white"
                  required
                />
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">
                    Select Resume File
                  </label>
                  <label
                    htmlFor="resume-input"
                    className="flex flex-col items-center gap-3 border-2 border-dashed border-slate-200 dark:border-zinc-700 rounded-3xl p-6 text-sm text-slate-500 dark:text-zinc-400 hover:border-emerald-300 transition bg-slate-50/50 dark:bg-zinc-900/50"
                  >
                    {resume ? (
                      <p className="text-emerald-600 font-semibold">{resume.name}</p>
                    ) : (
                      <>
                        <UploadCloud className="size-16 stroke-1 text-slate-400" />
                        <p>Click to upload PDF</p>
                      </>
                    )}
                  </label>
                  <input type="file" id="resume-input" accept=".pdf" hidden onChange={(e) => setResume(e.target.files[0])} />
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-emerald-500 text-white font-semibold shadow-[0_20px_35px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading && <LoaderCircleIcon className="animate-spin size-5" />}
                    {isLoading ? "Processing..." : "Upload Resume"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadResume(false);
                      setTitle("");
                    }}
                    className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {editResumeId && (
              <form
                onSubmit={(event) => {
                  event.stopPropagation();
                  editTitle(event);
                }}
                className="card w-full max-w-lg p-8 space-y-6 dark:bg-zinc-900 dark:border-zinc-800"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Edit title</p>
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Update Resume</h2>
                </div>
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  type="text"
                  placeholder="Enter Resume Title"
                  className="w-full px-4 py-3 text-sm bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-2xl text-slate-900 dark:text-white"
                  required
                />
                <div className="flex gap-3 flex-wrap">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl bg-emerald-500 text-white font-semibold shadow-[0_20px_35px_rgba(16,185,129,0.35)]"
                  >
                    Update Title
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditResumeId("");
                      setTitle("");
                    }}
                    className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard