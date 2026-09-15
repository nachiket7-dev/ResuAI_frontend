import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, PenLine, Share2Icon, Sparkles, User, WandSparkles } from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import DesignSelector from '../components/DesignSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import CustomSectionsForm from '../components/CustomSectionsForm'
import AtsScore from '../components/AtsScore'
import JobMatchPanel from '../components/JobMatchPanel'
import CoverLetterPanel from '../components/CoverLetterPanel'
import TargetProfilePanel from '../components/TargetProfilePanel'
import AIHistoryPanel from '../components/AIHistoryPanel'
import AIQuotaBadge from '../components/AIQuotaBadge'
import TailorResumePanel from '../components/TailorResumePanel'
import InterviewPrepPanel from '../components/InterviewPrepPanel'
import VersionHistory from '../components/VersionHistory'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import {DEFAULT_DESIGN} from '../configs/designPresets'

const getResumeSnapshot = (resume) => {
    const snapshot = structuredClone(resume);
    if (typeof snapshot.personal_info?.image === 'object') {
        delete snapshot.personal_info.image;
    }
    return JSON.stringify(snapshot);
};

const isSectionComplete = (sectionId, resume) => {
    if (sectionId === 'personal') return Boolean(resume.personal_info?.fullName && resume.personal_info?.email);
    if (sectionId === 'summary') return Boolean(resume.professional_summary?.trim());
    if (sectionId === 'experience') return resume.experience?.some((item) => item.company || item.position || item.description);
    if (sectionId === 'education') return resume.education?.some((item) => item.institution || item.degree);
    if (sectionId === 'projects') return resume.project?.some((item) => item.name || item.description);
    if (sectionId === 'skills') return resume.skills?.length > 0;
    if (sectionId === 'customSections') return resume.custom_sections?.some((item) => item.title || item.content);
    return false;
};

const ResumeBuilder = () => {
    const { resumeId } = useParams()
    const {token} = useSelector((state) => state.auth);
    const [resumeData,setResumeData] = useState({
        _id : '',
        title : '',
        personal_info : {},
        professional_summary: "",
        experience : [],
        education : [],
        project : [],
        skills : [],
        custom_sections: [],
        template : "classic",
        accent_color : "#166534",
        design: DEFAULT_DESIGN,
        public : false,
    })
    const loadExistingResume = useCallback(async () => {
        try {
            const {data} = await api.get(`/api/resumes/get/${resumeId}`,{headers: {Authorization: token}});
            if(data.resume){
                const loadedResume = {
                    ...data.resume,
                    custom_sections: data.resume.custom_sections || [],
                    design: {...DEFAULT_DESIGN, ...(data.resume.design || {}), layout: data.resume.design?.layout || data.resume.template || DEFAULT_DESIGN.layout},
                };
                setResumeData(loadedResume)
                lastSavedSnapshotRef.current = getResumeSnapshot(loadedResume)
                hasLoadedResumeRef.current = true
                setSaveState('saved')
                document.title = data.resume.title
            }
        } catch (error) {
            setLoadError(error?.response?.data?.message || 'Unable to load this resume.')
        }
    }, [resumeId, token])

    const [activeSectionIndex,setActiveSectionIndex] = useState(0)
    const [removeBackground,setRemoveBackground] = useState(false)
    const [saveState, setSaveState] = useState('loading')
    const [isExporting, setIsExporting] = useState(false)
    const [latexTemplate, setLatexTemplate] = useState('academic')
    const [showMobilePreview, setShowMobilePreview] = useState(false)
    const [workspaceTab, setWorkspaceTab] = useState('editor')
    const [targetProfile, setTargetProfile] = useState(null)
    const [loadError, setLoadError] = useState('')
    const lastSavedSnapshotRef = useRef('')
    const hasLoadedResumeRef = useRef(false)
    const editVersionRef = useRef(0)

    const sectionDefinitions = {
        summary: {id: 'summary', name: 'Summary', icon: FileText},
        experience: {id: 'experience', name: 'Experience', icon: Briefcase},
        education: {id: 'education', name: 'Education', icon: GraduationCap},
        projects: {id: 'projects', name: 'Projects', icon: FolderIcon},
        skills: {id: 'skills', name: 'Skills', icon: Sparkles},
        customSections: {id: 'customSections', name: 'Custom sections', icon: FileText},
    };
    const sections = [
        {id: 'personal', name: 'Personal info', icon: User},
        ...(resumeData.design?.sectionOrder || DEFAULT_DESIGN.sectionOrder)
            .map((sectionId) => sectionDefinitions[sectionId])
            .filter(Boolean),
    ];

    const activeSections = sections[activeSectionIndex]

    useEffect(() => {
        setActiveSectionIndex((index) => Math.min(index, sections.length - 1));
    }, [sections.length])

    useEffect(() => {
        loadExistingResume()
    },[loadExistingResume])

    useEffect(() => {
        if (!hasLoadedResumeRef.current || !resumeData._id) return;
        editVersionRef.current += 1;
        if (getResumeSnapshot(resumeData) !== lastSavedSnapshotRef.current) {
            setSaveState((state) => state === 'saving' ? state : 'unsaved');
        } else {
            setSaveState('saved');
        }
    }, [resumeData])

    const changeResumeVisibility = async () => {
        try {
            const updatedResumeData = {...resumeData, public: !resumeData.public};
            const formData = new FormData();
            formData.append('resumeId', resumeId);
            formData.append('resumeData', JSON.stringify(updatedResumeData));
            const {data} = await api.put('/api/resumes/update', formData, {headers: {Authorization: token}});
            lastSavedSnapshotRef.current = getResumeSnapshot(data.resume)
            setResumeData(data.resume);
            setSaveState('saved')
            toast.success(data.message)
        } catch (error) {
            console.error("Error saving resume:", error)
            toast.error(error?.response?.data?.message || error.message)
        }
    }
    
    const handleShare = () => {
        const frontendUrl = window.location.href.split('/app')[0]
        const resumeUrl = frontendUrl + '/view/' + resumeId
        
        if (navigator.share) {
            navigator.share({url: resumeUrl,text: 'My resume'})
        }else{
            alert("Share not supported on this browser")
        }
    }

    const downloadResume = async () => {
        setIsExporting(true);
        let exportElement;
        try {
            const html2pdfModule = await import('html2pdf.js');
            const html2pdf = html2pdfModule.default || html2pdfModule;
            exportElement = document.getElementById('resume-preview');
            if (!exportElement) throw new Error('Resume preview is not ready');

            if (document.fonts?.ready) await document.fonts.ready;
            await Promise.all(Array.from(exportElement.querySelectorAll('img')).map((image) => image.complete
                ? Promise.resolve()
                : new Promise((resolve) => {
                    image.addEventListener('load', resolve, {once: true});
                    image.addEventListener('error', resolve, {once: true});
                })));

            document.body.classList.add('pdf-exporting');
            const safeTitle = (resumeData.title || 'resume').replace(/[^a-z0-9-_]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();

            await html2pdf()
                .set({
                    margin: [0.25, 0.35, 0.25, 0.35],
                    filename: `${safeTitle || 'resume'}.pdf`,
                    image: {type: 'jpeg', quality: 0.98},
                    html2canvas: {scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false, windowWidth: exportElement.scrollWidth},
                    jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'},
                    pagebreak: {mode: ['css', 'legacy'], avoid: ['section', '.resume-entry']},
                })
                .from(exportElement)
                .save();
        } catch (error) {
            console.error('PDF export failed:', error);
            toast.error('PDF export failed. Opening the print dialog instead.');
            window.print();
        } finally {
            document.body.classList.remove('pdf-exporting');
            setIsExporting(false);
        }
    };

    const downloadLatex = async () => {
        try {
            const {data} = await api.get(`/api/resumes/export/${resumeId}/latex?template=${latexTemplate}`, {headers: {Authorization: token}, responseType: 'blob'});
            const blobUrl = URL.createObjectURL(new Blob([data], {type: 'application/x-tex'}));
            const link = document.createElement('a');
            const safeTitle = (resumeData.title || 'resume').replace(/[^a-z0-9-_]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
            link.href = blobUrl;
            link.download = `${safeTitle || 'resume'}.tex`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(blobUrl);
            toast.success('LaTeX source downloaded');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'LaTeX export failed');
        }
    };

    const saveResume = useCallback(async () => {
        const versionAtStart = editVersionRef.current;
        try {
            let updatedResumeData = structuredClone(resumeData);
            setSaveState('saving');

            //remove image from updatedResumeData
            if(typeof resumeData.personal_info.image === 'object'){
                delete updatedResumeData.personal_info.image;
            }

            const formData = new FormData();
            formData.append('resumeId', resumeId);
            formData.append('resumeData', JSON.stringify(updatedResumeData));
            removeBackground && formData.append('removeBackground', 'yes');
            typeof resumeData.personal_info.image === 'object' && formData.append('image', resumeData.personal_info.image);

            const {data} = await api.put('/api/resumes/update', formData, {headers: {Authorization: token}});
            lastSavedSnapshotRef.current = getResumeSnapshot(data.resume);
            if (editVersionRef.current === versionAtStart) {
                setResumeData(data.resume);
                setSaveState('saved');
            } else {
                setSaveState('unsaved');
            }
            return data;
        } catch (error) {
            console.error("Error saving resume:", error)
            setSaveState('error');
            throw error;
        }
    }, [removeBackground, resumeData, resumeId, token])

    useEffect(() => {
        if (saveState !== 'unsaved') return undefined;

        const timer = setTimeout(() => {
            saveResume().catch(() => {});
        }, 1800);

        return () => clearTimeout(timer);
    }, [saveResume, saveState])

  return (
    <main className='dashboard-surface min-h-screen'>
        <div className='animate-fade-in mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8'>
            <Link to={'/app'} className='inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:-translate-x-0.5 hover:text-slate-900'>
                <ArrowLeftIcon className='size-4' /> Back to Dashboard
            </Link>
            <div className='flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm lg:hidden' role='tablist' aria-label='Builder view'>
                <button type='button' role='tab' aria-selected={!showMobilePreview && workspaceTab === 'editor'} onClick={() => {setShowMobilePreview(false); setWorkspaceTab('editor')}} className={`rounded-lg px-3 py-2 text-xs font-semibold ${!showMobilePreview && workspaceTab === 'editor' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>Editor</button>
                <button type='button' role='tab' aria-selected={!showMobilePreview && workspaceTab === 'optimize'} onClick={() => {setShowMobilePreview(false); setWorkspaceTab('optimize')}} className={`rounded-lg px-3 py-2 text-xs font-semibold ${!showMobilePreview && workspaceTab === 'optimize' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>Optimize</button>
                <button type='button' role='tab' aria-selected={showMobilePreview} onClick={() => setShowMobilePreview(true)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${showMobilePreview ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>Preview</button>
            </div>
        </div>

        <div className='mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8'>
            <div className='animate-rise-in mb-7 flex flex-col gap-2 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between'><div><p className='text-xs font-semibold uppercase tracking-[0.22em] text-green-700'>Resume studio</p><h1 className='mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950'>{resumeData.title || 'Untitled resume'}</h1><p className='mt-2 text-sm text-slate-500'>Shape the story on the left. See the document come together on the right.</p></div><div className='hidden items-center gap-2 text-xs font-medium text-slate-500 sm:flex'><span className='size-2 rounded-full bg-green-500' /> {saveState === 'saved' ? 'All changes saved' : saveState === 'saving' ? 'Saving changes' : 'Draft in progress'}</div></div>
            {loadError && <div className='mb-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'><span>{loadError}</span><Link to='/app' className='font-semibold underline'>Return to dashboard</Link></div>}
            <div className='grid items-start gap-6 lg:grid-cols-12 lg:gap-8'>
                {/* Left Panel - Form */}
                <div className={`${showMobilePreview ? 'hidden lg:block' : 'block'} relative z-20 rounded-2xl lg:col-span-5`}>
                    <div className='animate-rise-in rounded-2xl border border-slate-200 bg-white p-4 pt-1 shadow-sm sm:p-6 sm:pt-1'>
                        {/* progress bar using activeSectionIndex */}
                        {workspaceTab === 'editor' && <><hr className='absolute top-0 left-0 right-0 border-2 border-gray-200' /><hr className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000' style={{width: `${activeSectionIndex * 100 / (sections.length - 1)}%`}} /></>}

                        {/* Section Navigation */}
                        <div className='flex flex-wrap justify-between items-center gap-3 mb-6 border-b border-gray-300 py-1'>

                            <div className='flex items-center gap-2'>
                                <DesignSelector design={resumeData.design} onChange={(design) => setResumeData(prev => ({...prev, design, template: design.layout}))} />
                                <ColorPicker selectedColor={resumeData.accent_color} onChange={(color) => setResumeData(prev => ({...prev,accent_color : color}))} />
                                <VersionHistory
                                    resumeId={resumeId}
                                    onRestored={(restoredResume) => {
                                        const restored = {
                                            ...restoredResume,
                                            custom_sections: restoredResume.custom_sections || [],
                                            design: {...DEFAULT_DESIGN, ...(restoredResume.design || {})},
                                        };
                                        lastSavedSnapshotRef.current = getResumeSnapshot(restored);
                                        setResumeData(restored);
                                        setSaveState('saved');
                                    }}
                                />
                            </div>

                            {workspaceTab === 'editor' && <div className='flex items-center'>
                                {activeSectionIndex !== 0 && (
                                    <button type='button' onClick={() => setActiveSectionIndex((prevIndex) => Math.max(prevIndex - 1,0))} className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all' disabled={activeSectionIndex === 0}>
                                        <ChevronLeft className='size-4' /> Previous
                                    </button>
                                )}
                                <button type='button' onClick={() => setActiveSectionIndex((prevIndex) => Math.min(prevIndex + 1,sections.length - 1))} className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`} disabled={activeSectionIndex === sections.length - 1}>
                                        Next <ChevronRight className='size-4' />
                                    </button>
                            </div>}
                        </div>

                        <div className='mb-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1' role='tablist' aria-label='Resume workspace'>
                            <button type='button' role='tab' aria-selected={workspaceTab === 'editor'} onClick={() => setWorkspaceTab('editor')} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${workspaceTab === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}><PenLine className='size-3.5' /> Build</button>
                            <button type='button' role='tab' aria-selected={workspaceTab === 'optimize'} onClick={() => setWorkspaceTab('optimize')} className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${workspaceTab === 'optimize' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}><WandSparkles className='size-3.5' /> Optimize</button>
                        </div>

                        <div className='mb-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5'>
                            <button type='button' disabled={saveState === 'saving'} onClick={() => toast.promise(saveResume(), {loading: "Saving...", success: "Saved", error: "Unable to save changes"})} className='glow-button rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white ring-1 ring-green-500 transition-all hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50'>
                                {saveState === 'saving' ? 'Saving...' : 'Save changes'}
                            </button>
                            <span className={`text-xs ${saveState === 'error' ? 'text-red-600' : 'text-slate-500'}`} aria-live='polite'>
                                {saveState === 'loading' && 'Loading resume...'}
                                {saveState === 'saved' && 'All changes saved'}
                                {saveState === 'unsaved' && 'Autosaving...'}
                                {saveState === 'saving' && 'Saving changes...'}
                                {saveState === 'error' && 'Save failed — try again'}
                            </span>
                        </div>

                        {workspaceTab === 'editor' && <>
                        <div className='mb-6 flex gap-2 overflow-x-auto pb-1' aria-label='Resume sections'>
                            {sections.map((section, index) => {
                                const SectionIcon = section.icon;
                                const complete = isSectionComplete(section.id, resumeData);
                                return <button type='button' key={section.id} onClick={() => setActiveSectionIndex(index)} aria-current={activeSectionIndex === index ? 'step' : undefined} title={section.name} className={`interactive-card relative flex min-w-max items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium ${activeSectionIndex === index ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}><SectionIcon className='size-3.5' /><span>{section.name}</span>{complete && <span className={`size-1.5 rounded-full ${activeSectionIndex === index ? 'bg-green-300' : 'bg-green-500'}`} aria-label='Complete' />}</button>;
                            })}
                        </div>

                        {/* Form Content */}
                        <div className='space-y-6'>
                            {activeSections.id === 'personal' && (
                                <PersonalInfoForm data={resumeData.personal_info} onChange={(data) => setResumeData(prev => ({...prev,personal_info : data}))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                            )}
                            {activeSections.id === 'summary' && (
                                <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data) => setResumeData(prev => ({...prev,professional_summary : data}))} setResumeData={setResumeData}/>
                            )}
                            {activeSections.id === 'experience' && (
                                <ExperienceForm resumeId={resumeId} data={resumeData.experience} onChange={(data) => setResumeData(prev => ({...prev, experience : data}))} />
                            )}
                            {activeSections.id === 'education' && (
                                <EducationForm data={resumeData.education} onChange={(data) => setResumeData(prev => ({...prev, education : data}))} />
                            )}
                            {activeSections.id === 'projects' && (
                                <ProjectForm data={resumeData.project} onChange={(data) => setResumeData(prev => ({...prev, project : data}))} />
                            )}
                            {activeSections.id === 'skills' && (
                                <SkillsForm data={resumeData.skills} onChange={(data) => setResumeData(prev => ({...prev, skills : data}))} />
                            )}
                            {activeSections.id === 'customSections' && (
                                <CustomSectionsForm data={resumeData.custom_sections} onChange={(data) => setResumeData(prev => ({...prev, custom_sections: data}))} />
                            )}
                        </div>
                        </>}

                        {workspaceTab === 'optimize' && <div className='space-y-5'>
                            <div className='rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-green-950 p-5 text-white shadow-lg shadow-slate-900/10'>
                                <div className='flex items-start justify-between gap-4'><div><p className='flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-green-300'><Sparkles className='size-3.5' /> Optimization workspace</p><h2 className='mt-2 text-xl font-semibold tracking-tight'>Make this version more targeted.</h2><p className='mt-2 max-w-md text-xs leading-5 text-slate-300'>Use the tools below to sharpen your positioning, compare roles, and prepare your application.</p></div><div className='hidden size-10 items-center justify-center rounded-2xl bg-white/10 sm:flex'><WandSparkles className='size-5 text-green-300' /></div></div>
                                <div className='mt-4 grid grid-cols-3 gap-2 text-center'><div className='rounded-xl bg-white/10 px-2 py-2'><p className='text-lg font-semibold'>{resumeData.experience?.length || 0}</p><p className='text-[10px] text-slate-300'>Roles</p></div><div className='rounded-xl bg-white/10 px-2 py-2'><p className='text-lg font-semibold'>{resumeData.skills?.length || 0}</p><p className='text-[10px] text-slate-300'>Skills</p></div><div className='rounded-xl bg-white/10 px-2 py-2'><p className='text-lg font-semibold'>{resumeData.project?.length || 0}</p><p className='text-[10px] text-slate-300'>Projects</p></div></div>
                            </div>
                            <TargetProfilePanel onSelect={setTargetProfile} />
                            <TailorResumePanel resume={resumeData} targetProfile={targetProfile} onApplied={(updatedResume) => {setResumeData(updatedResume); lastSavedSnapshotRef.current = getResumeSnapshot(updatedResume); setSaveState('saved')}} />
                            <InterviewPrepPanel resume={resumeData} targetProfile={targetProfile} />
                            <AtsScore resume={resumeData} />
                            <AIQuotaBadge />
                            <JobMatchPanel resume={resumeData} targetProfile={targetProfile} />
                            <CoverLetterPanel resume={resumeData} targetProfile={targetProfile} />
                            <AIHistoryPanel resumeId={resumeId} />
                        </div>}
                    </div>
                </div>

                {/* Right Panel - Preview */}
                <div className={`${showMobilePreview ? 'block' : 'hidden lg:block'} animate-slide-right relative z-10 lg:sticky lg:top-24 lg:col-span-7`}>
                    <div className='mb-3 flex flex-wrap items-center justify-end gap-2'>
                            {resumeData.public && (
                                <button type='button' onClick={handleShare} className='flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700 ring-1 ring-blue-200 transition hover:-translate-y-0.5 hover:ring-blue-400'>
                                    <Share2Icon className='size-4' /> Share
                                </button>
                            )}
                            <button type='button' onClick={changeResumeVisibility} className='flex items-center gap-2 rounded-xl bg-purple-50 px-4 py-2 text-xs font-medium text-purple-700 ring-1 ring-purple-200 transition hover:-translate-y-0.5 hover:ring-purple-400'>
                                {resumeData.public ? <EyeIcon className='size-4' /> : <EyeOffIcon className='size-4' />}
                                {resumeData.public ? "Public" : "Private"}
                            </button>
                            <div className='flex items-center gap-1 rounded-xl bg-slate-100 p-1 ring-1 ring-slate-200'>
                                <select aria-label='LaTeX export template' value={latexTemplate} onChange={(event) => setLatexTemplate(event.target.value)} className='border-0 bg-transparent px-2 py-1.5 text-xs font-medium text-slate-700 focus:ring-0'><option value='academic'>Academic</option><option value='technical'>Technical</option></select>
                                <button type='button' onClick={downloadLatex} className='flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-200'><FileText className='size-3.5' /> .tex</button>
                            </div>
                            <button type='button' disabled={isExporting} onClick={downloadResume} className='glow-button flex items-center gap-2 rounded-xl bg-green-600 px-6 py-2 text-xs font-medium text-white ring-1 ring-green-500 transition hover:bg-green-700 disabled:cursor-wait disabled:opacity-50'>
                                <DownloadIcon className='size-4' /> {isExporting ? 'Creating PDF...' : 'Download PDF'}
                            </button>
                    </div>
                    <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} design={resumeData.design} />
                </div>
            </div>
        </div>
    </main>
  )
}

export default ResumeBuilder
