import React from 'react'
import ClassicTemplate from './templates/ClassicTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import ModernTemplate from './templates/ModernTemplate'
import {DEFAULT_DESIGN} from '../configs/designPresets'

const ResumePreview = ({data,template,accentColor,design,classes = ""}) => {
    const activeDesign = {
        ...DEFAULT_DESIGN,
        layout: template || DEFAULT_DESIGN.layout,
        showPhoto: template === 'minimal-image',
        ...(design || {}),
    };
    const fontFamilies = {
        outfit: '"Avenir Next", "Inter", system-ui, sans-serif',
        inter: 'Inter, Arial, sans-serif',
        serif: 'Georgia, serif',
    };

    const renderTemplate = () => {
        switch (template) {
            case "modern":
                return <ModernTemplate data={data} accentColor={accentColor} design={activeDesign} />;
            case "minimal":
                return <MinimalTemplate data={data} accentColor={accentColor} design={activeDesign} />;
            case "minimal-image":
                return <MinimalImageTemplate data={data} accentColor={accentColor} design={activeDesign} />;
            default:
                return <ClassicTemplate data={data} accentColor={accentColor} design={activeDesign} />;
        }
    }
  return (
    <div className='resume-preview-shell w-full'>
        <div
            id='resume-preview'
            className={`animate-fade-in resume-preview-page resume-design resume-density-${activeDesign.density} border border-gray-200 print:shadow-none print:border-none ${classes}`}
            style={{'--resume-font-family': fontFamilies[activeDesign.font] || fontFamilies.outfit, '--resume-accent-color': accentColor || '#166534'}}
        >
            {renderTemplate()}
        </div>
        <style>
            {`
                @page{
                    size : letter;
                    margin : 0;
                }
                @media print{
                    html, body {
                        width : auto;
                        min-height : auto;
                        overflow : visible;
                    }
                    body *{
                        visibility : hidden;
                    }
                    #resume-preview, #resume-preview *{
                        visibility : visible;
                    }
                    #resume-preview{
                        position : absolute;
                        left : 0;
                        top : 0;
                        width : 100%;
                        min-height : 0;
                        margin : 0;
                        padding : 0;
                        box-shadow : none !important;
                        border : none !important
                    }
                }
            `}
        </style>
    </div>
  )
}

export default ResumePreview
