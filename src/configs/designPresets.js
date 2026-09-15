export const DESIGN_PRESETS = [
    {
        id: 'ats',
        name: 'ATS Focused',
        bestFor: 'General applications',
        description: 'Clean hierarchy and readable spacing for applicant tracking systems.',
        values: {
            preset: 'ats',
            layout: 'classic',
            density: 'compact',
            font: 'outfit',
            skillsStyle: 'list',
            showPhoto: false,
        },
    },
    {
        id: 'modern-tech',
        name: 'Modern Tech',
        bestFor: 'Tech and product roles',
        description: 'A sharper visual system for software and product roles.',
        values: {
            preset: 'modern-tech',
            layout: 'modern',
            density: 'balanced',
            font: 'inter',
            skillsStyle: 'pills',
            showPhoto: false,
        },
    },
    {
        id: 'executive',
        name: 'Executive',
        bestFor: 'Senior leadership',
        description: 'Spacious typography and restrained color for senior profiles.',
        values: {
            preset: 'executive',
            layout: 'minimal',
            density: 'spacious',
            font: 'serif',
            skillsStyle: 'columns',
            showPhoto: false,
        },
    },
    {
        id: 'creative',
        name: 'Creative Profile',
        bestFor: 'Design and client-facing work',
        description: 'A personal, image-friendly layout for design and client-facing work.',
        values: {
            preset: 'creative',
            layout: 'minimal-image',
            density: 'balanced',
            font: 'outfit',
            skillsStyle: 'pills',
            showPhoto: true,
        },
    },
];

export const DESIGN_OPTIONS = {
    layout: [
        {id: 'classic', name: 'Single column'},
        {id: 'modern', name: 'Modern'},
        {id: 'minimal', name: 'Minimal'},
        {id: 'minimal-image', name: 'Sidebar + photo'},
    ],
    density: [
        {id: 'compact', name: 'Compact'},
        {id: 'balanced', name: 'Balanced'},
        {id: 'spacious', name: 'Spacious'},
    ],
    font: [
        {id: 'outfit', name: 'Avenir / Inter'},
        {id: 'inter', name: 'Inter'},
        {id: 'serif', name: 'Serif'},
    ],
    skillsStyle: [
        {id: 'list', name: 'List'},
        {id: 'pills', name: 'Pills'},
        {id: 'columns', name: 'Columns'},
    ],
};

export const DEFAULT_DESIGN = {
    ...DESIGN_PRESETS[0].values,
    sectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'customSections'],
};
