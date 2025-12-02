import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User } from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'

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
        template : "classic",
        accent_color : "#3B82F6",
        public : false,
    })
    const loadExistingResume = async () => {
        try {
            const {data} = await api.get(`/api/resumes/get/${resumeId}`,{headers: {Authorization: token}});
            if(data.resume){
                setResumeData(data.resume)
                document.title = data.resume.title
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const [activeSectionIndex,setActiveSectionIndex] = useState(0)
    const [removeBackground,setRemoveBackground] = useState(false)

    const sections = [
        { id : "personal", name : "Personal info", icon : User },
        { id : "summary", name : "Summary", icon : FileText },
        { id : "experience", name : "Experience", icon : Briefcase },
        { id : "education", name : "Education", icon : GraduationCap },
        { id : "projects", name : "Projects", icon : FolderIcon },
        { id : "skills", name : "Skills", icon : Sparkles },
    ]

    const activeSections = sections[activeSectionIndex]

    useEffect(() => {
        loadExistingResume()
    },[])

    const changeResumeVisibility = async () => {
        try {
            const updatedResumeData = {...resumeData, public: !resumeData.public};
            const formData = new FormData();
            formData.append('resumeId', resumeId);
            formData.append('resumeData', JSON.stringify(updatedResumeData));
            const {data} = await api.put('/api/resumes/update', formData, {headers: {Authorization: token}});
            setResumeData(data.resume);
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

    const downloadResume = () => {
        window.print();
    };

    const saveResume = async () => {
        try {
            let updatedResumeData = structuredClone(resumeData);

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
            setResumeData(data.resume);
            toast.success(data.message)
        } catch (error) {
            console.error("Error saving resume:", error)
        }
    }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between text-sm text-slate-500">
        <Link to="/app" className="inline-flex gap-2 items-center text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all font-medium">
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
        <div className="text-xs uppercase tracking-[0.4em] text-zinc-400">
          Workspace · {resumeData.title || "Untitled"}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 pb-10">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="relative lg:col-span-5">
            <div className="card relative rounded-xl p-6 overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-6">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((activeSectionIndex + 1) / sections.length) * 100}%`,
                    background: "linear-gradient(90deg, #34d399, #0ea5e9)",
                  }}
                />
              </div>
              <div className="flex flex-wrap justify-between items-center gap-3 mb-6 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) => setResumeData((prev) => ({ ...prev, template }))}
                  />
                  <ColorPicker
                    selectedColor={resumeData.accent_color}
                    onChange={(color) => setResumeData((prev) => ({ ...prev, accent_color: color }))}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() => setActiveSectionIndex((prev) => Math.max(prev - 1, 0))}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-700 transition hover:-translate-y-0.5"
                    >
                      <ChevronLeft className="size-4" /> Previous
                    </button>
                  )}
                  <button
                    onClick={() => setActiveSectionIndex((prev) => Math.min(prev + 1, sections.length - 1))}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition hover:-translate-y-0.5 ${activeSectionIndex === sections.length - 1 ? "opacity-60 cursor-not-allowed" : ""}`}
                    disabled={activeSectionIndex === sections.length - 1}
                  >
                    Next <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                {activeSections.id === "personal" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, personal_info: data }))}
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {activeSections.id === "summary" && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, professional_summary: data }))}
                    setResumeData={setResumeData}
                  />
                )}
                {activeSections.id === "experience" && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, experience: data }))}
                  />
                )}
                {activeSections.id === "education" && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, education: data }))}
                  />
                )}
                {activeSections.id === "projects" && (
                  <ProjectForm
                    data={resumeData.project}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, project: data }))}
                  />
                )}
                {activeSections.id === "skills" && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) => setResumeData((prev) => ({ ...prev, skills: data }))}
                  />
                )}
              </div>
              <button
                onClick={() => toast.promise(saveResume, { loading: "Saving..." })}
                className="mt-6 w-full py-3 rounded-md bg-indigo-600 hover:bg-indigo-700  text-white font-semibold shadow-sm hover:shadow-md transition"
              >
                Save Changes
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex flex-wrap justify-end gap-3 mb-5 text-sm">
              {resumeData.public && (
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition hover:-translate-y-0.5"
                >
                  <Share2Icon className="size-4" /> Share
                </button>
              )}
              <button
                onClick={changeResumeVisibility}
                className="flex items-center gap-2 px-4 py-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition hover:-translate-y-0.5"
              >
                {resumeData.public ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
                {resumeData.public ? "Public" : "Private"}
              </button>
              <button
                onClick={downloadResume}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition hover:-translate-y-0.5"
              >
                <DownloadIcon className="size-4" /> Download
              </button>
            </div>
            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder