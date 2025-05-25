import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, ArrowLeft, Mail, Phone, MapPin, Globe } from 'lucide-react';
import exportService from '../services/exportService';
import toast from 'react-hot-toast';

const SharedCV = () => {
  const { shareId } = useParams();
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (shareId) {
        // Get CV data using short ID
        const sharedCVData = exportService.getSharedCV(shareId);
        setCvData(sharedCVData);
      } else {
        setError('Invalid share link');
      }
    } catch (err) {
      console.error('Error loading shared CV:', err);
      setError(err.message || 'Failed to load CV. The link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
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
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-sm p-8" style={{ minHeight: '297mm' }}>
          {/* Header Section */}
          <div className="text-center mb-8 pb-6 border-b-2 border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {personal?.fullName || 'Professional Name'}
            </h1>

            <div className="flex flex-wrap justify-center items-center gap-4 text-gray-600">
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
        </div>

        {/* Footer */}
        <div className="text-center mt-8 py-6 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            Want to create your own professional CV?
          </p>
          <Link
            to="/"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Create Your CV</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SharedCV;
