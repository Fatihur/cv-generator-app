import React, { useState, useEffect } from 'react';
import { RefreshCw, Trash2, Eye, Copy, Database } from 'lucide-react';
import exportService from '../services/exportService';
import shareService from '../services/shareService';
import toast from 'react-hot-toast';

const ShareDebug = () => {
  const [sharedCVs, setSharedCVs] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSharedCVs = async () => {
    setLoading(true);
    try {
      const shares = await exportService.getAllSharedCVs();
      setSharedCVs(shares);
      console.log('All shared CVs from Firebase:', shares);
    } catch (error) {
      console.error('Error loading shared CVs:', error);
      toast.error('Failed to load shared CVs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSharedCVs();
  }, []);

  const handleCleanup = async () => {
    setLoading(true);
    try {
      const cleanedCount = await exportService.cleanupExpiredShares();
      loadSharedCVs();
      toast.success(`Cleanup completed. Removed ${cleanedCount} expired shares.`);
    } catch (error) {
      console.error('Cleanup error:', error);
      toast.error('Cleanup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (shareId) => {
    try {
      await shareService.deleteShare(shareId);
      loadSharedCVs();
      toast.success('Share deleted from Firebase');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete share');
    }
  };

  const handleCopyLink = (shareId) => {
    const url = `${window.location.origin}/shared/${shareId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const handleTestShare = async () => {
    setLoading(true);
    try {
      console.log('Creating test share in Firebase...');

      const testCV = {
        personal: {
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          location: 'New York, NY',
          website: 'https://johndoe.com'
        },
        experience: [
          {
            position: 'Senior Developer',
            company: 'Tech Corp',
            startDate: '2023-01-01',
            current: true,
            description: 'Leading development of web applications using React and Node.js'
          }
        ],
        education: [
          {
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            institution: 'University of Technology',
            graduationYear: '2022'
          }
        ],
        skills: [
          { name: 'JavaScript', level: 'Advanced' },
          { name: 'React', level: 'Advanced' },
          { name: 'Node.js', level: 'Intermediate' }
        ],
        template: 'modern',
        cvName: 'John Doe CV'
      };

      console.log('Test CV data:', testCV);
      const shareUrl = await exportService.generateShareableLink(testCV);
      console.log('Generated Firebase test share URL:', shareUrl);

      // Copy to clipboard
      navigator.clipboard.writeText(shareUrl);

      toast.success(`Test share created in Firebase: ${shareUrl.split('/').pop()}`);
      loadSharedCVs();
    } catch (error) {
      console.error('Test share error:', error);
      toast.error('Failed to create test share');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-secondary-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Firebase Share Debug Panel</span>
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleTestShare}
            disabled={loading}
            className="btn-secondary text-sm"
          >
            Create Test Share
          </button>
          <button
            onClick={() => window.shareTest?.runFullTest()}
            disabled={loading}
            className="btn-secondary text-sm"
          >
            Run Full Test
          </button>
          <button
            onClick={handleCleanup}
            disabled={loading}
            className="btn-secondary text-sm flex items-center space-x-1"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Cleanup</span>
          </button>
          <button
            onClick={loadSharedCVs}
            disabled={loading}
            className="btn-primary text-sm flex items-center space-x-1"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-secondary-600 dark:text-secondary-400">
          Total shared CVs: {sharedCVs.length}
        </div>

        {sharedCVs.length === 0 ? (
          <div className="text-center py-8 text-secondary-500 dark:text-secondary-400">
            No shared CVs found
          </div>
        ) : (
          <div className="space-y-3">
            {sharedCVs.map((share) => (
              <div
                key={share.id}
                className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded">
                        {share.id}
                      </span>
                      <span className="text-sm text-secondary-600 dark:text-secondary-400">
                        {share.cvData?.personal?.fullName || 'Unknown'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        share.source === 'firebase'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {share.source || 'unknown'}
                      </span>
                    </div>
                    <div className="text-xs text-secondary-500 dark:text-secondary-500 mt-1">
                      Created: {new Date(share.createdAt).toLocaleString()}
                    </div>
                    <div className="text-xs text-secondary-500 dark:text-secondary-500">
                      Expires: {new Date(share.expiresAt).toLocaleString()}
                    </div>
                    {share.lastAccessed && (
                      <div className="text-xs text-secondary-500 dark:text-secondary-500">
                        Last accessed: {new Date(share.lastAccessed).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopyLink(share.id)}
                      className="p-2 text-secondary-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Copy Link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => window.open(`/shared/${share.id}`, '_blank')}
                      className="p-2 text-secondary-600 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      title="Open"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(share.id)}
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
        )}
      </div>
    </div>
  );
};

export default ShareDebug;
