import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Plus, Edit, Download, Share, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CVPreview from '../components/CVPreview';
import ExportModal from '../components/ExportModal';
import BackButton from '../components/BackButton';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import cvService from '../services/cvService';
import exportService from '../services/exportService';
import notificationService from '../services/notificationService';
import toast from 'react-hot-toast';

const SavedCVs = () => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportingCV, setExportingCV] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cvToDelete, setCvToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, isGuestMode } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadCVs();
  }, [user, isGuestMode]);

  const loadCVs = async () => {
    setLoading(true);
    try {
      if (isGuestMode) {
        // Load from Firebase/localStorage for guest mode
        const guestCVs = await cvService.getGuestCVs();
        setCvs(guestCVs);
      } else if (user) {
        // Load from Firebase for authenticated users
        const userCVs = await cvService.getUserCVs(user.uid);
        setCvs(userCVs);
      }
    } catch (error) {
      console.error('Error loading CVs:', error);
      toast.error(error.message || 'Failed to load CVs');
    } finally {
      setLoading(false);
    }
  };

  const duplicateCV = async (cv) => {
    try {
      if (isGuestMode) {
        const duplicatedCV = await cvService.duplicateCV(cv, null, true);
        const updatedCVs = await cvService.getGuestCVs();
        setCvs(updatedCVs);
      } else {
        const duplicatedCV = await cvService.duplicateCV(cv, user.uid, false);
        const updatedCVs = await cvService.getUserCVs(user.uid);
        setCvs(updatedCVs);
      }
      toast.success('CV duplicated successfully');
    } catch (error) {
      console.error('Error duplicating CV:', error);
      toast.error(error.message || 'Failed to duplicate CV');
    }
  };

  const exportCV = (cv) => {
    setExportingCV(cv);
    setShowExportModal(true);
  };

  const shareCV = async (cv) => {
    try {
      console.log('Sharing CV to Firebase:', cv);

      const shareUrl = await exportService.generateShareableLink(cv);
      console.log('Generated Firebase share URL:', shareUrl);

      await exportService.copyToClipboard(shareUrl);
      toast.success(`Share link copied to clipboard! Link: ${shareUrl.split('/').pop()}`);

      // Send CV shared email notification
      try {
        if (!isGuestMode && user?.email) {
          await notificationService.sendTemplateNotification(user.uid, 'cv-shared', {
            email: {
              to: user.email,
              cvName: cv.cvName || cv.personal?.fullName || 'Untitled CV',
              shareUrl: shareUrl,
              expiryDate: 'Never'
            }
          });
        }
      } catch (notifError) {
        console.error('Failed to send CV shared notification:', notifError);
      }
    } catch (error) {
      console.error('Share error:', error);
      toast.error(error.message || 'Failed to generate share link');
    }
  };

  const editCV = (cv) => {
    navigate('/dashboard/create-cv', {
      state: {
        cvData: cv,
        cvId: cv.id
      }
    });
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = (cv) => {
    setCvToDelete(cv);
    setShowDeleteModal(true);
  };

  // Handle confirmed deletion
  const handleDeleteConfirmed = async () => {
    if (!cvToDelete) return;

    setIsDeleting(true);
    try {
      const cvName = cvToDelete.cvName || cvToDelete.personal?.fullName || 'Untitled CV';

      if (isGuestMode) {
        // Delete from localStorage for guest users
        await cvService.deleteGuestCV(cvToDelete.id);
        const updatedCVs = await cvService.getGuestCVs();
        setCvs(updatedCVs);
      } else {
        // Delete from Firebase for authenticated users
        await cvService.deleteCV(cvToDelete.id, user.uid);
        const updatedCVs = await cvService.getUserCVs(user.uid);
        setCvs(updatedCVs);
      }

      toast.success('CV deleted successfully');

      // Send CV deleted email notification
      try {
        if (!isGuestMode && user?.email) {
          await notificationService.sendTemplateNotification(user.uid, 'cv-deleted', {
            email: {
              to: user.email,
              cvName: cvName
            }
          });
        }
      } catch (notifError) {
        console.error('Failed to send CV deleted notification:', notifError);
      }

      // Close preview modal if the deleted CV was being previewed
      if (selectedCV && selectedCV.id === cvToDelete.id) {
        setShowPreview(false);
        setSelectedCV(null);
      }

      // Close delete modal
      setShowDeleteModal(false);
      setCvToDelete(null);
    } catch (error) {
      console.error('Error deleting CV:', error);
      toast.error(error.message || 'Failed to delete CV');
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel deletion
  const handleDeleteCancelled = () => {
    setShowDeleteModal(false);
    setCvToDelete(null);
  };

  const previewCV = (cv) => {
    setSelectedCV(cv);
    setShowPreview(true);
  };

  const handleExport = async (type) => {
    if (!selectedCV) return;

    try {
      if (type === 'pdf') {
        const filename = selectedCV.cvName ||
          selectedCV.personal?.fullName?.replace(/\s+/g, '_') || 'CV';
        // Use image-based PDF export for better template support
        await exportService.exportToPDFAsImage(selectedCV, filename);
        toast.success('CV exported to PDF successfully!');
      } else if (type === 'share') {
        const shareUrl = await exportService.generateShareableLink(selectedCV);
        await exportService.copyToClipboard(shareUrl);
        toast.success('Share link copied to clipboard!');

        // Send CV shared email notification
        try {
          if (!isGuestMode && user?.email) {
            await notificationService.sendTemplateNotification(user.uid, 'cv-shared', {
              email: {
                to: user.email,
                cvName: selectedCV.cvName || selectedCV.personal?.fullName || 'Untitled CV',
                shareUrl: shareUrl,
                expiryDate: 'Never'
              }
            });
          }
        } catch (notifError) {
          console.error('Failed to send CV shared notification:', notifError);
        }
      }
    } catch (error) {
      toast.error(error.message || 'Export failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div>
        <BackButton to="/dashboard" label="Back to Dashboard" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
            Saved CVs
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">
            Manage and export your created CVs
          </p>
        </div>
        <Link
          to="/dashboard/create-cv"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New CV</span>
        </Link>
      </div>

      {/* Guest Mode Warning */}
      {isGuestMode && cvs.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              <strong>Guest Mode:</strong> Your CVs are stored locally and will be lost if you clear browser data.
              <Link to="/register" className="underline ml-1">Create an account</Link> to save permanently.
            </p>
          </div>
        </div>
      )}

      {/* CVs Grid */}
      {cvs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map((cv) => (
            <div key={cv.id} className="card p-6 hover:shadow-lg transition-shadow">
              {/* CV Preview */}
              <div className="bg-secondary-50 dark:bg-secondary-700 rounded-lg p-4 mb-4 h-32 flex items-center justify-center">
                <FileText className="w-12 h-12 text-secondary-400" />
              </div>

              {/* CV Info */}
              <div className="space-y-2 mb-4">
                <h3 className="font-semibold text-lg text-secondary-900 dark:text-white truncate">
                  {cv.cvName || cv.personal?.fullName || 'Untitled CV'}
                </h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  {cv.personal?.email || 'No email'}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-500">
                  Updated: {new Date(cv.updatedAt).toLocaleDateString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => previewCV(cv)}
                    className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => editCV(cv)}
                    className="p-2 text-secondary-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => duplicateCV(cv)}
                    className="p-2 text-secondary-600 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    title="Duplicate"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => exportCV(cv)}
                    className="p-2 text-secondary-600 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                    title="Export"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => shareCV(cv)}
                    className="p-2 text-secondary-600 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                    title="Share"
                  >
                    <Share className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => showDeleteConfirmation(cv)}
                    className="p-2 text-secondary-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-secondary-400" />
          </div>
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-2">
            No CVs created yet
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6 max-w-md mx-auto">
            Start building your professional CV with our easy-to-use builder and AI assistance.
          </p>
          <Link
            to="/dashboard/create-cv"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First CV</span>
          </Link>
        </div>
      )}

      {/* Stats */}
      {cvs.length > 0 && (
        <div className="card p-6 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-primary-200 dark:border-primary-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {cvs.length}
              </div>
              <div className="text-sm text-secondary-600 dark:text-secondary-400">
                Total CVs
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {cvs.filter(cv => cv.updatedAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()).length}
              </div>
              <div className="text-sm text-secondary-600 dark:text-secondary-400">
                Updated This Week
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                0
              </div>
              <div className="text-sm text-secondary-600 dark:text-secondary-400">
                Downloads
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CV Preview Modal */}
      <CVPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        cvData={selectedCV}
        onExport={handleExport}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => {
          setShowExportModal(false);
          setExportingCV(null);
        }}
        cvData={exportingCV}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancelled}
        onConfirm={handleDeleteConfirmed}
        cvData={cvToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default SavedCVs;
