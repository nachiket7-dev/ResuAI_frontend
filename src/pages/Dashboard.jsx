import { ArrowUpRight, FilePenLineIcon, LoaderCircleIcon, PencilIcon, PlusIcon, Search, TrashIcon, UploadCloud, UploadCloudIcon, XIcon } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import ApplicationTracker from '../components/ApplicationTracker'
import EvidenceBank from '../components/EvidenceBank'

const colors = ['#16a34a', '#4f46e5', '#0891b2', '#d97706', '#9333ea']

const getCompletion = (resume) => {
    const checks = [
        Boolean(resume.personal_info?.fullName),
        Boolean(resume.personal_info?.email),
        Boolean(resume.professional_summary),
        resume.experience?.length > 0,
        resume.education?.length > 0,
        resume.project?.length > 0,
        resume.skills?.length >= 3,
    ]
    return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

const getInitials = (title = 'Resume') => title.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase()

const Dashboard = () => {
    const {token, user} = useSelector((state) => state.auth)
    const [allResumes, setAllResumes] = useState([])
    const [showCreateResume, setShowCreateResume] = useState(false)
    const [showUploadResume, setShowUploadResume] = useState(false)
    const [title, setTitle] = useState('')
    const [resume, setResume] = useState(null)
    const [editResumeId, setEditResumeId] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [isLoadingResumes, setIsLoadingResumes] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('updated')
    const navigate = useNavigate()

    const authConfig = useMemo(() => ({headers: {Authorization: token}}), [token])

    const loadAllResumes = useCallback(async () => {
        setIsLoadingResumes(true)
        try {
            const {data} = await api.get('/api/users/resumes', authConfig)
            setAllResumes(data.resumes || [])
        } catch (error) {
            console.error('Error loading resumes:', error)
            setAllResumes([])
        } finally {
            setIsLoadingResumes(false)
        }
    }, [authConfig])

    const createResume = async (event) => {
        event.preventDefault()
        try {
            const {data} = await api.post('/api/resumes/create', {title: title.trim()}, authConfig)
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
        if (!resume) return toast.error('Please select a PDF file')
        if (!title.trim()) return toast.error('Please enter a resume title')

        setIsUploading(true)
        try {
            const {default: pdfToText} = await import('react-pdftotext')
            const resumeText = await pdfToText(resume)
            if (!resumeText?.trim()) return toast.error('Could not extract text from this PDF.')
            const {data} = await api.post('/api/ai/upload-resume', {title: title.trim(), resumeText}, authConfig)
            setTitle('')
            setResume(null)
            setShowUploadResume(false)
            toast.success('Resume uploaded successfully')
            navigate(`/app/builder/${data.resumeId}`)
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || 'Failed to upload resume')
        } finally {
            setIsUploading(false)
        }
    }

    const editTitle = async (event) => {
        event.preventDefault()
        try {
            const currentResume = allResumes.find((item) => item._id === editResumeId)
            if (!currentResume) return toast.error('Resume not found')
            const {data} = await api.put('/api/resumes/update', {
                resumeId: editResumeId,
                resumeData: JSON.stringify({...currentResume, title: title.trim()}),
            }, authConfig)
            setAllResumes((current) => current.map((item) => item._id === editResumeId ? {...item, title: data.resume?.title || title.trim()} : item))
            setTitle('')
            setEditResumeId('')
            toast.success(data.message || 'Title updated successfully')
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    const deleteResume = async (resumeId) => {
        if (!window.confirm('Are you sure you want to delete this resume?')) return
        try {
            await api.delete(`/api/resumes/delete/${resumeId}`, authConfig)
            setAllResumes((current) => current.filter((item) => item._id !== resumeId))
            toast.success('Resume deleted successfully')
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    const visibleResumes = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()
        return [...allResumes]
            .filter((item) => !query || item.title?.toLowerCase().includes(query))
            .sort((a, b) => sortBy === 'name' ? (a.title || '').localeCompare(b.title || '') : new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    }, [allResumes, searchQuery, sortBy])

    useEffect(() => { loadAllResumes() }, [loadAllResumes])

    const closeCreate = () => { setShowCreateResume(false); setTitle('') }
    const closeUpload = () => { setShowUploadResume(false); setTitle(''); setResume(null) }

    return (
        <main className='dashboard-surface min-h-[calc(100vh-4.5rem)]'>
            <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
                <div className='animate-rise-in flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between'>
                    <div>
                        <p className='text-xs font-semibold uppercase tracking-[0.22em] text-green-700'>Workspace / Resumes</p>
                        <h1 className='mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950'>Good to see you, {user?.name?.split(' ')[0] || 'there'}.</h1>
                        <p className='mt-2 max-w-xl text-sm text-slate-500'>Build a focused resume for every opportunity and keep your applications moving.</p>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        <button type='button' onClick={() => setShowUploadResume(true)} className='flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:border-slate-400 hover:bg-slate-50'><UploadCloudIcon className='size-4' /> Upload existing</button>
                        <button type='button' onClick={() => setShowCreateResume(true)} className='glow-button flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-green-200 hover:bg-green-800'><PlusIcon className='size-4' /> New resume <ArrowUpRight className='size-3.5' /></button>
                    </div>
                </div>

                <div className='mt-10 grid gap-4 border-y border-slate-200 py-5 sm:grid-cols-3'>
                    <div className='interactive-card border-l-2 border-green-600 pl-4'><p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>Drafts</p><p className='mt-2 text-3xl font-semibold tracking-tight text-slate-950'>{allResumes.length}</p><p className='mt-1 text-xs text-slate-500'>One version per target role</p></div>
                    <div className='interactive-card border-l-2 border-slate-300 pl-4'><p className='text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'>Average completion</p><p className='mt-2 text-3xl font-semibold tracking-tight text-slate-950'>{allResumes.length ? Math.round(allResumes.reduce((sum, item) => sum + getCompletion(item), 0) / allResumes.length) : 0}%</p><p className='mt-1 text-xs text-slate-500'>Across core sections</p></div>
                    <div className='interactive-card rounded-2xl border border-green-200 bg-green-50/70 p-4'><p className='text-xs font-semibold uppercase tracking-[0.16em] text-green-700'>Next best action</p><p className='mt-2 text-lg font-semibold tracking-tight text-green-950'>{allResumes.length ? 'Polish your strongest version' : 'Create your first resume'}</p><p className='mt-1 text-xs text-green-800/70'>{allResumes.length ? 'Use the ATS checklist inside the builder.' : 'Start with a role-specific title.'}</p></div>
                </div>

                <div className='mt-10 flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div><h2 className='text-xl font-semibold text-slate-950'>Your resumes</h2><p className='mt-1 text-sm text-slate-500'>Open a resume to continue editing.</p></div>
                    <div className='flex flex-col gap-2 sm:flex-row'>
                        <label className='relative'><Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400' /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder='Search resumes' aria-label='Search resumes' className='w-full rounded-xl border-slate-200 bg-white py-2 pl-9 pr-3 text-sm sm:w-52' /></label>
                        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label='Sort resumes' className='rounded-xl border-slate-200 px-3 py-2 text-sm text-slate-600'><option value='updated'>Recently updated</option><option value='name'>Name A–Z</option></select>
                    </div>
                </div>

                {isLoadingResumes ? <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>{[1, 2, 3, 4].map((item) => <div key={item} className='skeleton-shimmer h-56 rounded-2xl border border-slate-200' />)}</div> : visibleResumes.length > 0 ? <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    {visibleResumes.map((item, index) => {
                        const color = colors[index % colors.length]
                        const completion = getCompletion(item)
                        return <article key={item._id} className='interactive-card animate-rise-in group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm' style={{animationDelay: `${index * 70}ms`}}>
                            <Link to={`/app/builder/${item._id}`} className='block p-5'>
                                <div className='flex items-start justify-between'><div className='flex size-12 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm' style={{backgroundColor: color}}>{getInitials(item.title)}</div><FilePenLineIcon className='size-5 text-slate-300 transition group-hover:text-slate-500' /></div>
                                <div className='mt-5 rounded-xl border border-slate-200 bg-[#fbfaf6] p-3'><div className='flex items-center justify-between'><div className='h-1.5 w-16 rounded-full bg-slate-900' /><div className='size-4 rounded-full' style={{backgroundColor: color}} /></div><div className='mt-3 space-y-1.5'><div className='h-1.5 w-full rounded-full bg-slate-200' /><div className='h-1.5 w-10/12 rounded-full bg-slate-200' /><div className='h-1.5 w-8/12 rounded-full bg-slate-200' /></div></div>
                                <h3 className='mt-4 truncate font-semibold text-slate-900' title={item.title}>{item.title || 'Untitled resume'}</h3>
                                <p className='mt-1 text-xs text-slate-500'>Updated {new Date(item.updatedAt || Date.now()).toLocaleDateString()}</p>
                                <div className='mt-5'><div className='flex items-center justify-between text-xs'><span className='text-slate-500'>Completeness</span><span className='font-semibold text-slate-700'>{completion}%</span></div><div className='mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100'><div className='h-full rounded-full bg-green-500 transition-all' style={{width: `${completion}%`}} /></div></div>
                            </Link>
                            <div className='flex items-center justify-end gap-1 border-t border-slate-100 px-4 py-2'><button type='button' onClick={() => {setEditResumeId(item._id); setTitle(item.title || '')}} className='rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700' aria-label={`Rename ${item.title || 'resume'}`}><PencilIcon className='size-4' /></button><button type='button' onClick={() => deleteResume(item._id)} className='rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600' aria-label={`Delete ${item.title || 'resume'}`}><TrashIcon className='size-4' /></button></div>
                        </article>
                    })}
                </div> : <div className='mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center'><div className='mx-auto flex size-14 items-center justify-center rounded-2xl bg-green-50 text-green-600'><FilePenLineIcon className='size-7' /></div><h3 className='mt-4 text-lg font-semibold text-slate-900'>{searchQuery ? 'No matching resumes' : 'Your workspace is ready'}</h3><p className='mx-auto mt-2 max-w-md text-sm text-slate-500'>{searchQuery ? 'Try another search term or clear the search.' : 'Create a resume from scratch or upload an existing PDF to begin.'}</p>{!searchQuery && <div className='mt-5 flex justify-center gap-2'><button type='button' onClick={() => setShowCreateResume(true)} className='rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700'>Create resume</button><button type='button' onClick={() => setShowUploadResume(true)} className='rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50'>Upload PDF</button></div>}</div>}
                <ApplicationTracker resumes={allResumes} />
                <EvidenceBank />
            </div>

            {showCreateResume && <form onSubmit={createResume} onClick={closeCreate} className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm'><div onClick={(event) => event.stopPropagation()} className='animate-modal relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl'><button type='button' onClick={closeCreate} className='absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700' aria-label='Close create resume dialog'><XIcon className='size-4' /></button><p className='text-sm font-medium text-green-700'>New workspace</p><h2 className='mt-1 text-xl font-semibold text-slate-950'>Create a resume</h2><p className='mt-1 text-sm text-slate-500'>Give this version a clear target, such as “Product Designer — 2026”.</p><input autoFocus onChange={(event) => setTitle(event.target.value)} value={title} type='text' placeholder='Resume title' maxLength={120} className='mt-5 w-full px-4 py-3' required /><button type='submit' className='glow-button mt-4 w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700'>Create resume</button></div></form>}

            {showUploadResume && <form onSubmit={uploadResume} onClick={closeUpload} className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm'><div onClick={(event) => event.stopPropagation()} className='animate-modal relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl'><button type='button' onClick={closeUpload} className='absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700' aria-label='Close upload dialog'><XIcon className='size-4' /></button><p className='text-sm font-medium text-purple-700'>Import existing work</p><h2 className='mt-1 text-xl font-semibold text-slate-950'>Upload a resume</h2><p className='mt-1 text-sm text-slate-500'>We’ll extract the content and open it in the editor for refinement.</p><input onChange={(event) => setTitle(event.target.value)} value={title} type='text' placeholder='Resume title' maxLength={120} className='mt-5 w-full px-4 py-3' required /><label htmlFor='resume-input' className='mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 hover:border-green-400 hover:bg-green-50'><UploadCloud className='mb-2 size-8 text-slate-400' />{resume ? <span className='font-medium text-green-700'>{resume.name}</span> : <><span className='font-medium text-slate-700'>Choose a PDF file</span><span className='mt-1 text-xs'>PDF files up to 5 MB</span></>}<input type='file' id='resume-input' accept='.pdf,application/pdf' hidden onChange={(event) => setResume(event.target.files?.[0] || null)} /></label><button disabled={isUploading} type='submit' className='glow-button mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-wait disabled:opacity-50'>{isUploading && <LoaderCircleIcon className='size-4 animate-spin' />}{isUploading ? 'Importing...' : 'Upload and continue'}</button></div></form>}

            {editResumeId && <form onSubmit={editTitle} onClick={() => {setEditResumeId(''); setTitle('')}} className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm'><div onClick={(event) => event.stopPropagation()} className='animate-modal relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl'><button type='button' onClick={() => {setEditResumeId(''); setTitle('')}} className='absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700' aria-label='Close rename dialog'><XIcon className='size-4' /></button><h2 className='text-xl font-semibold text-slate-950'>Rename resume</h2><input autoFocus onChange={(event) => setTitle(event.target.value)} value={title} type='text' maxLength={120} className='mt-5 w-full px-4 py-3' required /><button type='submit' className='glow-button mt-4 w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700'>Save name</button></div></form>}
        </main>
    )
}

export default Dashboard
