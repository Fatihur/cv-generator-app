import React, { useState } from 'react';
import { X, Download, FileText, Code, File, Image } from 'lucide-react';
import exportService from '../services/exportService';
import toast from 'react-hot-toast';

const ExportModal = ({ isOpen, onClose, cvData }) => {
  const [exporting, setExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  if (!isOpen) return null;

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF Standard',
      description: 'Professional PDF format, ATS-friendly',
      icon: FileText,
      extension: '.pdf'
    },
    {
      id: 'pdf-compact',
      name: 'PDF Compact',
      description: 'Condensed layout, fits more content',
      icon: FileText,
      extension: '.pdf'
    },
    {
      id: 'pdf-detailed',
      name: 'PDF Detailed',
      description: 'Expanded layout with more spacing',
      icon: FileText,
      extension: '.pdf'
    },
    {
      id: 'pdf-visual',
      name: 'PDF Visual',
      description: 'Visual layout with icons and styling preserved',
      icon: Image,
      extension: '.pdf'
    },
    {
      id: 'txt',
      name: 'Plain Text',
      description: 'Simple text format, universal compatibility',
      icon: File,
      extension: '.txt'
    },
    {
      id: 'json',
      name: 'JSON Data',
      description: 'Raw data format for backup/import',
      icon: Code,
      extension: '.json'
    }
  ];

  const handleExport = async () => {
    if (!cvData) return;

    setExporting(true);
    try {
      const filename = cvData.cvName ||
        cvData.personal?.fullName?.replace(/\s+/g, '_') || 'CV';

      await exportService.exportToFormat(cvData, filename, selectedFormat);

      const formatName = exportFormats.find(f => f.id === selectedFormat)?.name || 'file';
      toast.success(`CV exported as ${formatName} successfully!`);
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error.message || 'Failed to export CV');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
          <div>
            <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
              Export CV
            </h2>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
              Choose your preferred export format
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-3">
            {exportFormats.map((format) => {
              const Icon = format.icon;
              return (
                <div
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedFormat === format.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      selectedFormat === format.id
                        ? 'bg-primary-100 dark:bg-primary-900/40'
                        : 'bg-secondary-100 dark:bg-secondary-700'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        selectedFormat === format.id
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-secondary-600 dark:text-secondary-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-secondary-900 dark:text-white">
                          {format.name}
                        </h3>
                        <span className="text-xs text-secondary-500 dark:text-secondary-500 bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded">
                          {format.extension}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                        {format.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Preview Info */}
          <div className="mt-6 p-4 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
            <h4 className="font-medium text-secondary-900 dark:text-white mb-2">
              Export Preview
            </h4>
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              <p><strong>CV Name:</strong> {cvData?.cvName || cvData?.personal?.fullName || 'Untitled CV'}</p>
              <p><strong>Format:</strong> Professional Layout</p>
              <p><strong>Sections:</strong> {[
                cvData?.personal?.fullName && 'Personal Info',
                cvData?.experience?.length > 0 && 'Experience',
                cvData?.education?.length > 0 && 'Education',
                cvData?.skills?.length > 0 && 'Skills',
                cvData?.achievements?.length > 0 && 'Achievements',
                cvData?.certificates?.length > 0 && 'Certificates'
              ].filter(Boolean).join(', ') || 'None'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-secondary-200 dark:border-secondary-700">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'Exporting...' : 'Export CV'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
