import { useState } from 'react';
import { X, Download, Share, Mail, Phone, MapPin, Globe, Copy, MessageCircle, ExternalLink } from 'lucide-react';
import exportService from '../services/exportService';

import toast from 'react-hot-toast';

const CVPreview = ({ isOpen, onClose, cvData, onExport }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [exporting, setExporting] = useState(false);

  if (!isOpen || !cvData) return null;

  const { personal, experience = [], education = [], skills = [], achievements = [], certificates = [] } = cvData;

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
      // Use text-based PDF export for better compatibility
      await exportService.exportToPDF(cvData, filename, 'standard');
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
          const shareUrl = await exportService.generateShareableLink(cvData);
          await exportService.copyToClipboard(shareUrl);
          toast.success('Share link copied to clipboard!');
          break;
        case 'email':
          await exportService.shareViaEmail(cvData);
          toast.success('Email client opened!');
          break;
        case 'whatsapp':
          await exportService.shareViaWhatsApp(cvData);
          toast.success('WhatsApp opened!');
          break;
        case 'linkedin':
          await exportService.shareViaLinkedIn(cvData);
          toast.success('LinkedIn opened!');
          break;
        case 'native':
          const shared = await exportService.shareViaWebAPI(cvData);
          if (shared) {
            toast.success('Shared successfully!');
          } else {
            // Fallback to copy link
            const shareUrl = await exportService.generateShareableLink(cvData);
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
                      <ExternalLink className="w-4 h-4" />
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
        <div className="flex-1 overflow-y-auto bg-white">
          <style>
            {`
            .cv-container {
              padding: 2rem;
              max-width: none;
              margin: 0;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
              line-height: 1.6;
              color: #374151;
            }
            .cv-header {
              margin-bottom: 2rem;
              padding-bottom: 1.5rem;
              border-bottom: 3px solid #e5e7eb;
              text-align: center;
            }
            .cv-name {
              font-size: 2.8rem;
              font-weight: 700;
              color: #111827;
              margin: 0 0 1rem 0;
              letter-spacing: -0.025em;
            }
            .cv-contact {
              display: flex;
              justify-content: center;
              flex-wrap: wrap;
              gap: 2rem;
              color: #6b7280;
              font-size: 0.95rem;
            }
            .contact-item {
              display: flex;
              align-items: center;
              gap: 0.5rem;
            }
            .cv-section {
              margin-bottom: 2.5rem;
            }
            .cv-section-title {
              font-size: 1.4rem;
              font-weight: 700;
              color: #111827;
              margin: 0 0 1.5rem 0;
              padding-bottom: 0.5rem;
              border-bottom: 2px solid #e5e7eb;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .cv-item-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 1.5rem;
              table-layout: fixed;
            }
            .cv-item-table:last-child {
              margin-bottom: 0;
            }
            .cv-item-row {
              border-bottom: 1px solid #f3f4f6;
            }
            .cv-item-row:last-child {
              border-bottom: none;
            }
            .cv-item-header {
              padding: 1rem 0;
              vertical-align: top;
            }
            .cv-item-left {
              width: 70%;
              padding-right: 2rem;
              vertical-align: top;
            }
            .cv-item-right {
              width: 30%;
              text-align: right;
              vertical-align: top;
              padding-left: 1rem;
            }
            .cv-item-title {
              font-size: 1.2rem;
              font-weight: 600;
              color: #111827;
              margin: 0 0 0.25rem 0;
            }
            .cv-item-subtitle {
              font-size: 1rem;
              font-weight: 500;
              color: #4b5563;
              margin: 0 0 0.75rem 0;
            }
            .cv-item-date {
              font-size: 0.9rem;
              color: #6b7280;
              font-weight: 600;
              white-space: nowrap;
              text-align: right;
              display: block;
            }
            .cv-item-description {
              color: #374151;
              line-height: 1.6;
              margin-top: 0.5rem;
            }
            .cv-skills-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 1rem;
            }
            .cv-skill {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 1rem;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 0.5rem;
              transition: all 0.2s ease;
            }
            .cv-skill:hover {
              background: #f1f5f9;
              border-color: #cbd5e1;
            }
            .cv-skill-name {
              font-weight: 600;
              color: #1e293b;
            }
            .cv-skill-level {
              font-size: 0.85rem;
              color: #64748b;
              background: #e2e8f0;
              padding: 0.25rem 0.75rem;
              border-radius: 1rem;
              font-weight: 500;
            }
            `}
          </style>
          <div className="cv-container">
            {/* Header Section */}
            <div className="cv-header">
              <h1 className="cv-name">
                {personal?.fullName || 'Your Name'}
              </h1>

              <div className="cv-contact">
                {personal?.email && (
                  <div className="contact-item">
                    <Mail className="w-4 h-4" />
                    <span>{personal.email}</span>
                  </div>
                )}
                {personal?.phone && (
                  <div className="contact-item">
                    <Phone className="w-4 h-4" />
                    <span>{personal.phone}</span>
                  </div>
                )}
                {personal?.location && (
                  <div className="contact-item">
                    <MapPin className="w-4 h-4" />
                    <span>{personal.location}</span>
                  </div>
                )}
                {personal?.website && (
                  <div className="contact-item">
                    <Globe className="w-4 h-4" />
                    <span>{personal.website}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Summary */}
            {personal?.summary && (
              <div className="cv-section">
                <h2 className="cv-section-title">
                  Professional Summary
                </h2>
                <p style={{ lineHeight: '1.6' }}>
                  {personal.summary}
                </p>
              </div>
            )}

            {/* Work Experience */}
            {experience.length > 0 && (
              <div className="cv-section">
                <h2 className="cv-section-title">
                  Work Experience
                </h2>
                {experience.map((exp, index) => (
                  <table key={index} className="cv-item-table">
                    <tbody>
                      <tr className="cv-item-row">
                        <td className="cv-item-header cv-item-left">
                          <h3 className="cv-item-title">
                            {exp.position || 'Position Title'}
                          </h3>
                          <p className="cv-item-subtitle">
                            {exp.company || 'Company Name'}
                          </p>
                          {exp.description && (
                            <div className="cv-item-description">
                              {exp.description.split('\n').map((line, lineIndex) => (
                                <p key={lineIndex} style={{ margin: '0.25rem 0' }}>
                                  {line}
                                </p>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="cv-item-header cv-item-right">
                          <div className="cv-item-date">
                            {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ))}
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div className="cv-section">
                <h2 className="cv-section-title">
                  Education
                </h2>
                {education.map((edu, index) => (
                  <table key={index} className="cv-item-table">
                    <tbody>
                      <tr className="cv-item-row">
                        <td className="cv-item-header cv-item-left">
                          <h3 className="cv-item-title">
                            {edu.degree || 'Degree'}
                            {edu.field && ` in ${edu.field}`}
                          </h3>
                          <p className="cv-item-subtitle">
                            {edu.institution || 'Institution Name'}
                          </p>
                        </td>
                        <td className="cv-item-header cv-item-right">
                          <div className="cv-item-date">
                            {edu.graduationYear || formatDateRange(edu.startDate, edu.endDate, edu.current)}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ))}
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="cv-section">
                <h2 className="cv-section-title">
                  Skills
                </h2>
                <div className="cv-skills-grid">
                  {skills.map((skill, index) => (
                    <div key={index} className="cv-skill">
                      <span className="cv-skill-name">
                        {skill.name || 'Skill Name'}
                      </span>
                      <span className="cv-skill-level">
                        {skill.level || 'Intermediate'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <div className="cv-section">
                <h2 className="cv-section-title">
                  Achievements & Awards
                </h2>
                {achievements.map((achievement, index) => (
                  <table key={index} className="cv-item-table">
                    <tbody>
                      <tr className="cv-item-row">
                        <td className="cv-item-header cv-item-left">
                          <h3 className="cv-item-title">
                            {achievement.title || 'Achievement Title'}
                          </h3>
                          {achievement.organization && (
                            <p className="cv-item-subtitle">
                              {achievement.organization}
                            </p>
                          )}
                          {achievement.description && (
                            <div className="cv-item-description">
                              {achievement.description.split('\n').map((line, lineIndex) => (
                                <p key={lineIndex} style={{ margin: '0.25rem 0' }}>
                                  {line}
                                </p>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="cv-item-header cv-item-right">
                          {achievement.date && (
                            <div className="cv-item-date">
                              {formatDate(achievement.date)}
                            </div>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ))}
              </div>
            )}

            {/* Certificates */}
            {certificates.length > 0 && (
              <div className="cv-section">
                <h2 className="cv-section-title">
                  Certificates & Licenses
                </h2>
                {certificates.map((certificate, index) => (
                  <table key={index} className="cv-item-table">
                    <tbody>
                      <tr className="cv-item-row">
                        <td className="cv-item-header cv-item-left">
                          <h3 className="cv-item-title">
                            {certificate.name || 'Certificate Name'}
                          </h3>
                          {certificate.issuer && (
                            <p className="cv-item-subtitle">
                              {certificate.issuer}
                            </p>
                          )}
                          <div className="cv-item-description">
                            {certificate.credentialId && (
                              <p style={{ margin: '0.25rem 0', fontSize: '0.875rem', color: '#666' }}>
                                ID: {certificate.credentialId}
                              </p>
                            )}
                            {certificate.url && (
                              <p style={{ margin: '0.25rem 0' }}>
                                <a
                                  href={certificate.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm"
                                >
                                  View Certificate
                                </a>
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="cv-item-header cv-item-right">
                          <div className="cv-item-date">
                            {certificate.date && (
                              <div>Issued: {formatDate(certificate.date)}</div>
                            )}
                            {certificate.expiryDate && (
                              <div>Expires: {formatDate(certificate.expiryDate)}</div>
                            )}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!personal?.fullName && experience.length === 0 && education.length === 0 && skills.length === 0 && achievements.length === 0 && certificates.length === 0 && (
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
