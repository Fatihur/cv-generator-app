import React, { useState } from 'react';
import { Check } from 'lucide-react';

const TemplateSelector = ({ selectedTemplate, onTemplateChange }) => {
  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean and contemporary design with subtle colors',
      preview: '/templates/modern-preview.png',
      colors: {
        primary: '#3B82F6',
        secondary: '#64748B',
        accent: '#F1F5F9'
      }
    },
    {
      id: 'classic',
      name: 'Classic Traditional',
      description: 'Traditional layout perfect for conservative industries',
      preview: '/templates/classic-preview.png',
      colors: {
        primary: '#1F2937',
        secondary: '#6B7280',
        accent: '#F9FAFB'
      }
    },
    {
      id: 'creative',
      name: 'Creative Bold',
      description: 'Eye-catching design for creative professionals',
      preview: '/templates/creative-preview.png',
      colors: {
        primary: '#7C3AED',
        secondary: '#A78BFA',
        accent: '#F3F4F6'
      }
    },
    {
      id: 'minimal',
      name: 'Minimal Clean',
      description: 'Minimalist approach focusing on content',
      preview: '/templates/minimal-preview.png',
      colors: {
        primary: '#059669',
        secondary: '#6B7280',
        accent: '#FFFFFF'
      }
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
          Choose Template
        </h3>
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          Select a template that best fits your industry and personal style
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
              selectedTemplate === template.id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600'
            }`}
          >
            {/* Selection Indicator */}
            {selectedTemplate === template.id && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Template Preview */}
            <div className="p-4">
              <div 
                className="w-full h-32 rounded-lg mb-3 flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: template.colors.primary }}
              >
                {template.name.split(' ')[0]}
              </div>

              {/* Template Info */}
              <div className="space-y-2">
                <h4 className="font-semibold text-secondary-900 dark:text-white">
                  {template.name}
                </h4>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  {template.description}
                </p>

                {/* Color Palette */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-secondary-500 dark:text-secondary-500">Colors:</span>
                  <div className="flex space-x-1">
                    <div 
                      className="w-4 h-4 rounded-full border border-secondary-200"
                      style={{ backgroundColor: template.colors.primary }}
                      title="Primary Color"
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-secondary-200"
                      style={{ backgroundColor: template.colors.secondary }}
                      title="Secondary Color"
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-secondary-200"
                      style={{ backgroundColor: template.colors.accent }}
                      title="Accent Color"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Template Features */}
      <div className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-4">
        <h4 className="font-medium text-secondary-900 dark:text-white mb-2">
          Template Features
        </h4>
        <ul className="text-sm text-secondary-600 dark:text-secondary-400 space-y-1">
          <li>• ATS-friendly formatting</li>
          <li>• Professional typography</li>
          <li>• Responsive design</li>
          <li>• Print-optimized layout</li>
          <li>• Customizable colors</li>
        </ul>
      </div>
    </div>
  );
};

export default TemplateSelector;
