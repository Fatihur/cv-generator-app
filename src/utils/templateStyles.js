// Template styles and configurations
export const templateStyles = {
  modern: {
    name: 'Modern Professional',
    colors: {
      primary: '#3B82F6',
      secondary: '#64748B',
      accent: '#F1F5F9',
      text: '#1F2937',
      textLight: '#6B7280'
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif'
    },
    layout: {
      headerStyle: 'center',
      sectionSpacing: '2rem',
      borderStyle: 'modern'
    }
  },
  classic: {
    name: 'Classic Traditional',
    colors: {
      primary: '#1F2937',
      secondary: '#6B7280',
      accent: '#F9FAFB',
      text: '#111827',
      textLight: '#6B7280'
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'Times New Roman, serif'
    },
    layout: {
      headerStyle: 'left',
      sectionSpacing: '1.5rem',
      borderStyle: 'classic'
    }
  },
  creative: {
    name: 'Creative Bold',
    colors: {
      primary: '#7C3AED',
      secondary: '#A78BFA',
      accent: '#F3F4F6',
      text: '#1F2937',
      textLight: '#6B7280'
    },
    fonts: {
      heading: 'Montserrat, sans-serif',
      body: 'Open Sans, sans-serif'
    },
    layout: {
      headerStyle: 'center',
      sectionSpacing: '2.5rem',
      borderStyle: 'creative'
    }
  },
  minimal: {
    name: 'Minimal Clean',
    colors: {
      primary: '#059669',
      secondary: '#6B7280',
      accent: '#FFFFFF',
      text: '#111827',
      textLight: '#6B7280'
    },
    fonts: {
      heading: 'Helvetica, Arial, sans-serif',
      body: 'Helvetica, Arial, sans-serif'
    },
    layout: {
      headerStyle: 'left',
      sectionSpacing: '1.8rem',
      borderStyle: 'minimal'
    }
  }
};

// Get template style
export const getTemplateStyle = (templateId) => {
  return templateStyles[templateId] || templateStyles.modern;
};

// Generate CSS styles for template
export const generateTemplateCSS = (templateId) => {
  const style = getTemplateStyle(templateId);
  
  return `
    .cv-container {
      font-family: ${style.fonts.body};
      color: ${style.colors.text};
      line-height: 1.6;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20mm;
      background: white;
    }
    
    .cv-header {
      text-align: ${style.layout.headerStyle};
      margin-bottom: ${style.layout.sectionSpacing};
      padding-bottom: 1rem;
      border-bottom: ${getBorderStyle(style.layout.borderStyle, style.colors.primary)};
    }
    
    .cv-name {
      font-family: ${style.fonts.heading};
      font-size: 2.5rem;
      font-weight: bold;
      color: ${style.colors.primary};
      margin-bottom: 0.5rem;
    }
    
    .cv-contact {
      color: ${style.colors.textLight};
      font-size: 0.9rem;
    }
    
    .cv-section {
      margin-bottom: ${style.layout.sectionSpacing};
    }
    
    .cv-section-title {
      font-family: ${style.fonts.heading};
      font-size: 1.4rem;
      font-weight: bold;
      color: ${style.colors.primary};
      margin-bottom: 1rem;
      padding-bottom: 0.3rem;
      border-bottom: ${getSectionBorder(style.layout.borderStyle, style.colors.secondary)};
    }
    
    .cv-item {
      margin-bottom: 1.5rem;
    }
    
    .cv-item-title {
      font-weight: bold;
      color: ${style.colors.text};
      font-size: 1.1rem;
    }
    
    .cv-item-subtitle {
      color: ${style.colors.textLight};
      font-style: italic;
      margin-bottom: 0.3rem;
    }
    
    .cv-item-date {
      color: ${style.colors.textLight};
      font-size: 0.9rem;
    }
    
    .cv-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    
    .cv-skill {
      background: ${style.colors.accent};
      color: ${style.colors.text};
      padding: 0.3rem 0.8rem;
      border-radius: 0.3rem;
      font-size: 0.9rem;
      border: 1px solid ${style.colors.secondary}20;
    }
  `;
};

// Helper functions
const getBorderStyle = (borderStyle, color) => {
  switch (borderStyle) {
    case 'modern':
      return `2px solid ${color}`;
    case 'classic':
      return `1px solid ${color}`;
    case 'creative':
      return `3px solid ${color}`;
    case 'minimal':
      return `1px solid ${color}40`;
    default:
      return `2px solid ${color}`;
  }
};

const getSectionBorder = (borderStyle, color) => {
  switch (borderStyle) {
    case 'modern':
      return `1px solid ${color}40`;
    case 'classic':
      return `1px solid ${color}`;
    case 'creative':
      return `2px solid ${color}60`;
    case 'minimal':
      return `1px solid ${color}20`;
    default:
      return `1px solid ${color}40`;
  }
};
