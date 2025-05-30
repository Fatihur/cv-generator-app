import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, ArrowLeft, Mail, Phone, MapPin, Globe } from 'lucide-react';
import exportService from '../services/exportService';
import useDocumentTitle from '../hooks/useDocumentTitle';
import toast from 'react-hot-toast';

const SharedCV = () => {
  const { shareId } = useParams();
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dynamic title based on CV data
  const cvTitle = cvData?.personal?.fullName
    ? `${cvData.personal.fullName}'s CV`
    : 'Shared Professional CV';
  useDocumentTitle(cvTitle);

  useEffect(() => {
    const loadSharedCV = async () => {
      try {
        if (!shareId) {
          throw new Error('No share ID provided in the URL');
        }

        console.log('Loading shared CV from Firebase with ID:', shareId);

        // Validate share ID format (should be 8 characters)
        if (shareId.length !== 8) {
          throw new Error('Invalid share ID format. Share links should contain an 8-character ID.');
        }

        // Get CV data using Firebase
        const sharedCVData = await exportService.getSharedCV(shareId);
        console.log('Loaded shared CV data:', sharedCVData);

        if (!sharedCVData) {
          throw new Error('CV not found. The link may be invalid, expired, or the CV may have been removed.');
        }

        setCvData(sharedCVData);
      } catch (err) {
        console.error('Error loading shared CV:', err);

        // More specific error messages
        let errorMessage = 'Failed to load CV. ';
        if (err.message.includes('expired')) {
          errorMessage += 'This share link has expired. Share links are valid for 30 days.';
        } else if (err.message.includes('not found') || err.message.includes('Invalid share ID')) {
          errorMessage += 'The link may be invalid or the CV may have been removed.';
        } else if (err.message.includes('Network')) {
          errorMessage += 'Please check your internet connection and try again.';
        } else {
          errorMessage += err.message || 'Please try again later.';
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadSharedCV();
  }, [shareId]);

  const handleExportPDF = async () => {
    if (!cvData) return;

    try {
      const filename = cvData.personal?.fullName ?
        cvData.personal.fullName.replace(/\s+/g, '_') : 'CV';
      await exportService.exportToPDF(cvData, filename);
      toast.success('CV exported to PDF successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to export PDF');
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">CV Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to CV Generator</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!cvData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No CV Data</h1>
          <p className="text-gray-600 mb-6">The CV data could not be loaded.</p>
          <Link
            to="/"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to CV Generator</span>
          </Link>
        </div>
      </div>
    );
  }

  const { personal = {}, experience = [], education = [], skills = [] } = cvData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-800 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="text-center flex-1 mx-4">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {personal?.fullName || 'Professional CV'}
              </h1>
              <p className="text-xs text-gray-600">Shared CV</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleExportPDF}
              className="btn-primary flex-1 flex items-center justify-center space-x-2 py-2 text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <Link
              to="/"
              className="btn-secondary flex-1 flex items-center justify-center py-2 text-sm"
            >
              Create Your CV
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-800 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {personal?.fullName || 'Professional CV'}
              </h1>
              <p className="text-sm text-gray-600">Shared CV</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportPDF}
              className="btn-primary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <Link
              to="/"
              className="btn-secondary"
            >
              Create Your CV
            </Link>
          </div>
        </div>
      </div>

      {/* CV Content */}
      <div className="max-w-4xl mx-auto p-4 lg:p-8">
        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-8" style={{ minHeight: '297mm' }}>
          {/* Header Section */}
          <div className="text-center mb-6 lg:mb-8 pb-4 lg:pb-6 border-b-2 border-gray-200">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 lg:mb-2">
              {personal?.fullName || 'Professional Name'}
            </h1>

            <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-center gap-2 sm:gap-4 text-gray-600 text-sm lg:text-base">
              {personal?.email && (
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="break-all">{personal.email}</span>
                </div>
              )}
              {personal?.phone && (
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{personal.phone}</span>
                </div>
              )}
              {personal?.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-center">{personal.location}</span>
                </div>
              )}
              {personal?.website && (
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <span className="break-all">{personal.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {personal?.summary && (
            <div className="mb-6 lg:mb-8">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 pb-1 border-b border-gray-300">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                {personal.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {experience.length > 0 && (
            <div className="mb-6 lg:mb-8">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 pb-1 border-b border-gray-300">
                Work Experience
              </h2>
              <div className="space-y-4 lg:space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                      <div className="flex-1">
                        <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                          {exp.position || 'Position Title'}
                        </h3>
                        <p className="text-gray-700 font-medium text-sm lg:text-base">
                          {exp.company || 'Company Name'}
                        </p>
                      </div>
                      <div className="text-xs lg:text-sm text-gray-600 sm:text-right sm:ml-4 flex-shrink-0">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </div>
                    </div>
                    {exp.description && (
                      <div className="text-gray-700 leading-relaxed text-sm lg:text-base mt-2">
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
            <div className="mb-6 lg:mb-8">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 pb-1 border-b border-gray-300">
                Education
              </h2>
              <div className="space-y-3 lg:space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
                    <div className="flex-1">
                      <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                        {edu.degree || 'Degree'}
                        {edu.field && ` in ${edu.field}`}
                      </h3>
                      <p className="text-gray-700 text-sm lg:text-base">
                        {edu.institution || 'Institution Name'}
                      </p>
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600 sm:text-right sm:ml-4 flex-shrink-0">
                      {edu.graduationYear || formatDateRange(edu.startDate, edu.endDate, edu.current)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6 lg:mb-8">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 pb-1 border-b border-gray-300">
                Skills
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                {skills.map((skill, index) => (
                  <div key={index} className="flex justify-between items-center p-2 lg:p-0">
                    <span className="text-gray-900 font-medium text-sm lg:text-base">
                      {skill.name || 'Skill Name'}
                    </span>
                    <span className="text-xs lg:text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded ml-2 flex-shrink-0">
                      {skill.level || 'Intermediate'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 lg:mt-8 py-4 lg:py-6 border-t border-gray-200">
          <p className="text-gray-600 mb-3 lg:mb-4 text-sm lg:text-base">
            Want to create your own professional CV?
          </p>
          <Link
            to="/"
            className="btn-primary inline-flex items-center space-x-2 text-sm lg:text-base"
          >
            <span>Create Your CV</span>
          </Link>
          <p className="text-xs text-gray-500 mt-4">
            Made with ❤️ by Fatih
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedCV;
