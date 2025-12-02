import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import ResumePreview from '../components/ResumePreview'
import { ArrowLeft, Loader } from 'lucide-react'
import api from '../configs/api'

const Preview = () => {
  const {resumeId} = useParams()
  const [isLoading,setIsLoading] = useState(true)
  const [resumeData,setResumeData] = useState(null)
  const loadResume = async () => {
    try {
      const {data} = await api.get(`/api/resumes/public/${resumeId}`)
      setResumeData(data.resume)
    } catch (error) {
      console.log(error.message)
    }finally{
      setIsLoading(false)
    }
  }
  useEffect(() => {
    loadResume()
  },[])
  return resumeData ? (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-12 px-4'>
      <div className='max-w-3xl mx-auto'>
          <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes='py-6 bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl'/>
      </div>
    </div>
  ) : (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center'>
      {isLoading ? <Loader /> : (
        <div className='flex flex-col items-center justify-center text-center px-4'>
          <p className='text-5xl md:text-6xl text-slate-300 dark:text-zinc-700 font-semibold mb-4'>Resume Not Found</p>
          <p className='text-slate-500 dark:text-zinc-400 mb-8 max-w-md'>The resume you're looking for doesn't exist or is set to private.</p>
          <a href="/" className='bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl px-8 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]'>
            <ArrowLeft className='size-5' /> Go to Home Screen
          </a>
        </div>
      )}
    </div>
  )
}

export default Preview