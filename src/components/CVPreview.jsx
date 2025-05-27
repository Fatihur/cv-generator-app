import React, { useState } from 'react';
import { X, Download, Share, Mail, Phone, MapPin, Globe, Copy, MessageCircle, Linkedin } from 'lucide-react';
import exportService from '../services/exportService';
import { getTemplateStyle, generateTemplateCSS } from '../utils/templateStyles';
import toast from 'react-hot-toast';

const CVPreview = ({ isOpen, onClose, cvData, onExport }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [exporting, setExporting] = useState(false);

  if (!isOpen || !cvData) return null;

  const { personal, experience = [], education = [], skills = [], achievements = [], template = 'modern' } = cvData;
  const templateStyle = getTemplateStyle(template);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const formatDateRange = (startDate, endDate, isCurrent) => {
    const start = formatDate(startDate);
    const end = isCurrent ? 'Present' : formatDate(endDate);
    return `${start} - ${end}`;
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const filename = cvData?.cvName ||
        personal?.fullName?.replace(/\s+/g, '_') || 'CV';
      await exportService.exportToPDF(cvData, filename);
      toast.success('CV exported to PDF successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  const handleShare = async (method) => {
    try {
      switch (method) {
        case 'link':
          const shareUrl = exportService.generateShareableLink(cvData);
          await exportService.copyToClipboard(shareUrl);
          toast.success('Share link copied to clipboard!');
          break;
        case 'email':
          exportService.shareViaEmail(cvData);
          toast.success('Email client opened!');
          break;
        case 'whatsapp':
          exportService.shareViaWhatsApp(cvData);
          toast.success('WhatsApp opened!');
          break;
        case 'linkedin':
          exportService.shareViaLinkedIn(cvData);
          toast.success('LinkedIn opened!');
          break;
        case 'native':
          const shared = await exportService.shareViaWebAPI(cvData);
          if (shared) {
            toast.success('Shared successfully!');
          } else {
            // Fallback to copy link
            const shareUrl = exportService.generateShareableLink(cvData);
            await exportService.copyToClipboard(shareUrl);
            toast.success('Share link copied to clipboard!');
          }
          break;
        default:
          break;
      }
      setShowShareMenu(false);
    } catch (error) {
      toast.error(error.message || 'Failed to share');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">CV Preview</h2>
            <p className="text-sm text-gray-600">
              {cvData?.cvName || personal?.fullName || 'Untitled CV'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Share className="w-4 h-4" />
                <span>Share</span>
              </button>

              {/* Share Menu */}
              {showShareMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-48">
                  <div className="py-2">
                    <button
                      onClick={() => handleShare('link')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Link</span>
                    </button>
                    <button
                      onClick={() => handleShare('email')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Share via Email</span>
                    </button>
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Share via WhatsApp</span>
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span>Share via LinkedIn</span>
                    </button>
                    {navigator.share && (
                      <button
                        onClick={() => handleShare('native')}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <Share className="w-4 h-4" />
                        <span>Share...</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* CV Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <style>{generateTemplateCSS(template)}</style>
          <div className="cv-container">
            {/* Header Section */}
            <div className="cv-header">
              <h1 className="cv-name">
                {personal?.fullName || 'Your Name'}
              </h1>

              <div className="cv-contact"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: templateStyle.layout.headerStyle === 'center' ? 'center' : 'flex-start',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                {personal?.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{personal.email}</span>
                  </div>
                )}
                {personal?.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{personal.phone}</span>
                  </div>
                )}
                {personal?.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{personal.location}</span>
                  </div>
                )}
                {personal?.website && (
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span>{personal.website}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Summary */}
            {personal?.summary && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3 pb-1 border-b border-gray-300">
                  Professional Summary
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {personal.summary}
                </p>
              </div>
            )}

            {/* Work Experience */}
            {experience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-1 border-b border-gray-300">
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="relative">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {exp.position || 'Position Title'}
                          </h3>
                          <p className="text-gray-700 font-medium">
                            {exp.company || 'Company Name'}
                          </p>
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                        </div>
                      </div>
                      {exp.description && (
                        <div className="text-gray-700 leading-relaxed">
                          {exp.description.split('\n').map((line, lineIndex) => (
                            <p key={lineIndex} className="mb-1">
                              {line}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-1 border-b border-gray-300">
                  Education
                </h2>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {edu.degree || 'Degree'}
                          {edu.field && ` in ${edu.field}`}
                        </h3>
                        <p className="text-gray-700">
                          {edu.institution || 'Institution Name'}
                        </p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {edu.graduationYear || formatDateRange(edu.startDate, edu.endDate, edu.current)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-1 border-b border-gray-300">
                  Skills
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-900 font-medium">
                        {skill.name || 'Skill Name'}
                      </span>
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {skill.level || 'Intermediate'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-1 border-b border-gray-300">
                  Achievements & Awards
                </h2>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="relative">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {achievement.title || 'Achievement Title'}
                          </h3>
                          {achievement.organization && (
                            <p className="text-gray-700 font-medium">
                              {achievement.organization}
                            </p>
                          )}
                        </div>
                        {achievement.date && (
                          <div className="text-sm text-gray-600">
                            {formatDate(achievement.date)}
                          </div>
                        )}
                      </div>
                      {achievement.description && (
                        <div className="text-gray-700 leading-relaxed">
                          {achievement.description.split('\n').map((line, lineIndex) => (
                            <p key={lineIndex} className="mb-1">
                              {line}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!personal?.fullName && experience.length === 0 && education.length === 0 && skills.length === 0 && achievements.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No CV Content
                </h3>
                <p className="text-gray-600">
                  Start filling out your CV information to see the preview
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            💡 This is a preview of your CV. Use the export button to download or share.
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Close Preview
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVPreview;
