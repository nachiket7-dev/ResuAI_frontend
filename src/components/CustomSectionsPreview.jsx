import React from 'react';

const CustomSectionsPreview = ({sections = [], accentColor, compact = false}) => (
    sections.filter((section) => section?.title || section?.content).map((section, index) => (
        <section key={`${section.title}-${index}`} className={compact ? 'mb-8' : 'mb-6'}>
            <h2 className="text-sm uppercase tracking-widest font-semibold mb-3" style={{color: accentColor}}>
                {section.title || 'Additional Information'}
            </h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {section.content}
            </div>
        </section>
    ))
);

export default CustomSectionsPreview;
