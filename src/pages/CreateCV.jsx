import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Save, Eye, Bot, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AIModal from '../components/AIModal';
import CVPreview from '../components/CVPreview';
import BackButton from '../components/BackButton';
import TemplateSelector from '../components/TemplateSelector';
import cvService from '../services/cvService';
import exportService from '../services/exportService';
import toast from 'react-hot-toast';

const CreateCV = () => {
  const [activeSection, setActiveSection] = useState('template');
  const [loading, setSaving] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [aiModalType, setAiModalType] = useState('improve');
  const [aiModalField, setAiModalField] = useState('');
  const [aiModalInitialText, setAiModalInitialText] = useState('');
  const { user, isGuestMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're editing an existing CV
  const [isEditing, setIsEditing] = useState(false);
  const [editingCVId, setEditingCVId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      cvName: '',
      personal: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        summary: ''
      },
      experience: [],
      education: [],
      skills: []
    }
  });

  const sections = [
    { id: 'template', label: 'Template', icon: '🎨' },
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'skills', label: 'Skills', icon: '⚡' }
  ];

  const watchedData = watch();

  // Load CV data if editing
  useEffect(() => {
    const state = location.state;
    if (state && state.cvData) {
      setIsEditing(true);
      setEditingCVId(state.cvId);

      // Populate form with existing data
      Object.keys(state.cvData).forEach(key => {
        setValue(key, state.cvData[key]);
      });

      // Set template if exists
      if (state.cvData.template) {
        setSelectedTemplate(state.cvData.template);
      }

      toast.success('CV loaded for editing');
    }
  }, [location.state, setValue]);

  const addExperience = () => {
    const currentExp = watchedData.experience || [];
    setValue('experience', [...currentExp, {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }]);
  };

  const removeExperience = (index) => {
    const currentExp = watchedData.experience || [];
    setValue('experience', currentExp.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    const currentEdu = watchedData.education || [];
    setValue('education', [...currentEdu, {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false
    }]);
  };

  const removeEducation = (index) => {
    const currentEdu = watchedData.education || [];
    setValue('education', currentEdu.filter((_, i) => i !== index));
  };

  const addSkill = () => {
    const currentSkills = watchedData.skills || [];
    setValue('skills', [...currentSkills, { name: '', level: 'Intermediate' }]);
  };

  const removeSkill = (index) => {
    const currentSkills = watchedData.skills || [];
    setValue('skills', currentSkills.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      // Validate CV data
      const validation = cvService.validateCVData(data);
      if (!validation.isValid) {
        validation.errors.forEach(error => toast.error(error));
        setSaving(false);
        return;
      }

      // Clean the data and add template
      const cleanedData = cvService.cleanCVData({
        ...data,
        template: selectedTemplate
      });

      if (isEditing && editingCVId) {
        // Update existing CV
        if (isGuestMode) {
          const savedCV = cvService.updateGuestCV(editingCVId, cleanedData);
          toast.success('CV updated locally (Guest Mode)');
        } else {
          const savedCV = await cvService.updateCV(editingCVId, cleanedData, user.uid);
          toast.success('CV updated successfully!');
        }
      } else {
        // Create new CV
        if (isGuestMode) {
          const savedCV = cvService.saveGuestCV(cleanedData);
          toast.success('CV saved locally (Guest Mode)');
        } else {
          const savedCV = await cvService.saveCV(cleanedData, user.uid);
          toast.success('CV saved successfully!');
        }
      }

      navigate('/saved-cvs');
    } catch (error) {
      toast.error(error.message || 'Failed to save CV');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  // AI Modal handlers
  const openAIModal = (type, field, initialText = '') => {
    setAiModalType(type);
    setAiModalField(field);
    setAiModalInitialText(initialText);
    setShowAIModal(true);
  };

  const handleAIApply = (generatedText) => {
    if (aiModalField) {
      setValue(aiModalField, generatedText);
      toast.success('AI content applied!');
    }
    setShowAIModal(false);
  };

  // Preview handlers
  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleExport = async (type) => {
    try {
      if (type === 'pdf') {
        const filename = watchedData.cvName ||
          watchedData.personal?.fullName?.replace(/\s+/g, '_') || 'CV';
        await exportService.exportToPDF(watchedData, filename);
        toast.success('CV exported to PDF successfully!');
      } else if (type === 'share') {
        const shareUrl = exportService.generateShareableLink(watchedData);
        await exportService.copyToClipboard(shareUrl);
        toast.success('Share link copied to clipboard!');
      }
    } catch (error) {
      toast.error(error.message || 'Export failed');
    }
  };

  const renderTemplate = () => (
    <div className="space-y-6">
      {/* CV Name */}
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          CV Information
        </h3>
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            CV Name *
          </label>
          <input
            {...register('cvName', { required: 'CV name is required' })}
            className="input-field"
            placeholder="e.g., Software Engineer Resume, Marketing Manager CV"
          />
          {errors.cvName && (
            <p className="text-red-500 text-sm mt-1">{errors.cvName.message}</p>
          )}
          <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
            This will be used as the filename when downloading your CV
          </p>
        </div>
      </div>

      {/* Template Selection */}
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Choose Template
        </h3>
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
        />
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
        Personal Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Full Name *
          </label>
          <input
            {...register('personal.fullName', { required: 'Full name is required' })}
            className="input-field"
            placeholder="John Doe"
          />
          {errors.personal?.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.personal.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            {...register('personal.email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address'
              }
            })}
            className="input-field"
            placeholder="john@example.com"
          />
          {errors.personal?.email && (
            <p className="text-red-500 text-sm mt-1">{errors.personal.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Phone
          </label>
          <input
            {...register('personal.phone')}
            className="input-field"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Location
          </label>
          <input
            {...register('personal.location')}
            className="input-field"
            placeholder="New York, NY"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Website/Portfolio
          </label>
          <input
            {...register('personal.website')}
            className="input-field"
            placeholder="https://johndoe.com"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Professional Summary
            <button
              type="button"
              onClick={() => openAIModal('improve', 'personal.summary', watchedData.personal?.summary)}
              className="ml-2 text-primary-600 hover:text-primary-700 transition-colors"
              title="Get AI help"
            >
              <Bot className="w-4 h-4 inline" />
            </button>
          </label>
          <textarea
            {...register('personal.summary')}
            rows={4}
            className="input-field"
            placeholder="Write a brief summary of your professional background and goals..."
          />
        </div>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
          Work Experience
        </h3>
        <button
          type="button"
          onClick={addExperience}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {(watchedData.experience || []).map((exp, index) => (
        <div key={index} className="card p-6 relative">
          <button
            type="button"
            onClick={() => removeExperience(index)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Company *
              </label>
              <input
                {...register(`experience.${index}.company`, { required: 'Company is required' })}
                className="input-field"
                placeholder="Company Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Position *
              </label>
              <input
                {...register(`experience.${index}.position`, { required: 'Position is required' })}
                className="input-field"
                placeholder="Job Title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Start Date
              </label>
              <input
                type="month"
                {...register(`experience.${index}.startDate`)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                End Date
              </label>
              <input
                type="month"
                {...register(`experience.${index}.endDate`)}
                className="input-field"
                disabled={watchedData.experience?.[index]?.current}
              />
              <label className="flex items-center mt-2">
                <input
                  type="checkbox"
                  {...register(`experience.${index}.current`)}
                  className="mr-2"
                />
                <span className="text-sm text-secondary-600 dark:text-secondary-400">
                  Currently working here
                </span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Description
                <button
                  type="button"
                  onClick={() => openAIModal('improve', `experience.${index}.description`, watchedData.experience?.[index]?.description)}
                  className="ml-2 text-primary-600 hover:text-primary-700 transition-colors"
                  title="Get AI help"
                >
                  <Bot className="w-4 h-4 inline" />
                </button>
              </label>
              <textarea
                {...register(`experience.${index}.description`)}
                rows={3}
                className="input-field"
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
          </div>
        </div>
      ))}

      {(!watchedData.experience || watchedData.experience.length === 0) && (
        <div className="text-center py-8 text-secondary-500 dark:text-secondary-400">
          No work experience added yet. Click "Add Experience" to get started.
        </div>
      )}
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
          Education
        </h3>
        <button
          type="button"
          onClick={addEducation}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      {(watchedData.education || []).map((edu, index) => (
        <div key={index} className="card p-6 relative">
          <button
            type="button"
            onClick={() => removeEducation(index)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Institution *
              </label>
              <input
                {...register(`education.${index}.institution`, { required: 'Institution is required' })}
                className="input-field"
                placeholder="University Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Degree *
              </label>
              <input
                {...register(`education.${index}.degree`, { required: 'Degree is required' })}
                className="input-field"
                placeholder="Bachelor's, Master's, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Field of Study
              </label>
              <input
                {...register(`education.${index}.field`)}
                className="input-field"
                placeholder="Computer Science, Business, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Graduation Year
              </label>
              <input
                type="number"
                {...register(`education.${index}.graduationYear`)}
                className="input-field"
                placeholder="2023"
                min="1950"
                max="2030"
              />
            </div>
          </div>
        </div>
      ))}

      {(!watchedData.education || watchedData.education.length === 0) && (
        <div className="text-center py-8 text-secondary-500 dark:text-secondary-400">
          No education added yet. Click "Add Education" to get started.
        </div>
      )}
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
          Skills
        </h3>
        <button
          type="button"
          onClick={addSkill}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(watchedData.skills || []).map((skill, index) => (
          <div key={index} className="card p-4 relative">
            <button
              type="button"
              onClick={() => removeSkill(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Skill Name *
                </label>
                <input
                  {...register(`skills.${index}.name`, { required: 'Skill name is required' })}
                  className="input-field"
                  placeholder="JavaScript, Project Management, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Proficiency Level
                </label>
                <select
                  {...register(`skills.${index}.level`)}
                  className="input-field"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!watchedData.skills || watchedData.skills.length === 0) && (
        <div className="text-center py-8 text-secondary-500 dark:text-secondary-400">
          No skills added yet. Click "Add Skill" to get started.
        </div>
      )}
    </div>
  );

  const renderCurrentSection = () => {
    switch (activeSection) {
      case 'template':
        return renderTemplate();
      case 'personal':
        return renderPersonalInfo();
      case 'experience':
        return renderExperience();
      case 'education':
        return renderEducation();
      case 'skills':
        return renderSkills();
      default:
        return renderTemplate();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <BackButton to="/" label="Back to Dashboard" />
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
          {isEditing ? 'Edit Your CV' : 'Create Your CV'}
        </h1>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handlePreview}
            className="btn-secondary flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save CV'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Section Navigation */}
        <div className="lg:col-span-1">
          <div className="card p-4 sticky top-24">
            <h2 className="font-semibold text-secondary-900 dark:text-white mb-4">
              CV Sections
            </h2>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'hover:bg-secondary-100 dark:hover:bg-secondary-700 text-secondary-700 dark:text-secondary-300'
                  }`}
                >
                  <span className="mr-3">{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <form className="card p-8">
            {renderCurrentSection()}
          </form>
        </div>
      </div>

      {/* AI Modal */}
      <AIModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onApply={handleAIApply}
        type={aiModalType}
        initialText={aiModalInitialText}
        placeholder={
          aiModalType === 'skills'
            ? 'Enter your job title or field (e.g., Data Scientist, Marketing Manager)...'
            : 'Enter your text here...'
        }
      />

      {/* CV Preview Modal */}
      <CVPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        cvData={watchedData}
        onExport={handleExport}
      />
    </div>
  );
};

export default CreateCV;
