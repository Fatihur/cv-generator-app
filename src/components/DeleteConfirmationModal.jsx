import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, FileText, Calendar, User } from 'lucide-react';

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  cvData,
  isDeleting = false
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [understood, setUnderstood] = useState(false);

  if (!isOpen || !cvData) return null;

  const cvName = cvData.cvName || cvData.personal?.fullName || 'Untitled CV';
  const requiredText = 'DELETE';
  const canDelete = confirmText === requiredText && understood;

  const handleConfirm = () => {
    if (canDelete) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText('');
      setUnderstood(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pb-8 delete-modal-container">
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl max-w-md w-full my-4 delete-modal-content">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
              Delete CV
            </h2>
          </div>
          {!isDeleting && (
            <button
              onClick={handleClose}
              className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* CV Info */}
          <div className="bg-secondary-50 dark:bg-secondary-700 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-secondary-600 dark:text-secondary-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-secondary-900 dark:text-white mb-2">
                  {cvName}
                </h3>
                <div className="space-y-1 text-sm text-secondary-600 dark:text-secondary-400">
                  {cvData.personal?.email && (
                    <div className="flex items-center space-x-2">
                      <User className="w-3 h-3" />
                      <span>{cvData.personal.email}</span>
                    </div>
                  )}
                  {cvData.updatedAt && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3" />
                      <span>Updated: {new Date(cvData.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
                  This action cannot be undone
                </h4>
                <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                  <li>• Your CV will be permanently deleted</li>
                  <li>• All CV data will be lost forever</li>
                  <li>• Any shared links will stop working</li>
                  <li>• You'll receive an email confirmation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Confirmation Steps */}
          <div className="space-y-4">
            {/* Step 1: Understanding */}
            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={understood}
                  onChange={(e) => setUnderstood(e.target.checked)}
                  disabled={isDeleting}
                  className="mt-1"
                />
                <span className="text-sm text-secondary-700 dark:text-secondary-300">
                  I understand that this action is permanent and cannot be undone
                </span>
              </label>
            </div>

            {/* Step 2: Type DELETE */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Type <span className="font-mono bg-secondary-100 dark:bg-secondary-700 px-1 rounded">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                disabled={isDeleting}
                placeholder="Type DELETE here"
                className="input-field font-mono"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-secondary-200 dark:border-secondary-700 modal-footer">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canDelete || isDeleting}
            className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete CV</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
