import React, { useState, useEffect } from 'react';
import { X, Monitor, Smartphone, Tablet, MapPin, Clock, Trash2, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import profileService from '../services/profileService';
import toast from 'react-hot-toast';

const SessionsModal = ({ isOpen, onClose }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      loadSessions();
    }
  }, [isOpen, user]);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const userSessions = await profileService.getUserSessions(user.uid);
      
      // Add mock current session if no sessions exist
      if (userSessions.length === 0) {
        const mockSessions = [
          {
            id: 'current',
            deviceType: 'desktop',
            browser: 'Chrome',
            os: 'Windows 10',
            location: 'New York, US',
            ipAddress: '192.168.1.1',
            lastActive: new Date(),
            isCurrent: true
          },
          {
            id: 'mobile-1',
            deviceType: 'mobile',
            browser: 'Safari',
            os: 'iOS 17',
            location: 'New York, US',
            ipAddress: '192.168.1.2',
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            isCurrent: false
          },
          {
            id: 'tablet-1',
            deviceType: 'tablet',
            browser: 'Chrome',
            os: 'Android 13',
            location: 'Boston, US',
            ipAddress: '10.0.0.1',
            lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            isCurrent: false
          }
        ];
        setSessions(mockSessions);
      } else {
        setSessions(userSessions);
      }
    } catch (error) {
      toast.error('Failed to load sessions');
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    if (sessions.find(s => s.id === sessionId)?.isCurrent) {
      toast.error('Cannot revoke current session');
      return;
    }

    try {
      await profileService.revokeSession(sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
      toast.success('Session revoked successfully');
    } catch (error) {
      toast.error('Failed to revoke session');
      console.error('Error revoking session:', error);
    }
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Tablet;
      default:
        return Monitor;
    }
  };

  const formatLastActive = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
                Active Sessions
              </h2>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Manage your account sessions across devices
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-600 dark:text-secondary-400">
                    No active sessions found
                  </p>
                </div>
              ) : (
                sessions.map((session) => {
                  const DeviceIcon = getDeviceIcon(session.deviceType);
                  return (
                    <div
                      key={session.id}
                      className={`border rounded-lg p-4 ${
                        session.isCurrent
                          ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                          : 'border-secondary-200 dark:border-secondary-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            session.isCurrent
                              ? 'bg-green-100 dark:bg-green-900/40'
                              : 'bg-secondary-100 dark:bg-secondary-700'
                          }`}>
                            <DeviceIcon className={`w-5 h-5 ${
                              session.isCurrent
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-secondary-600 dark:text-secondary-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-secondary-900 dark:text-white">
                                {session.browser} on {session.os}
                              </h3>
                              {session.isCurrent && (
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-secondary-600 dark:text-secondary-400">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{session.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatLastActive(session.lastActive)}</span>
                              </div>
                            </div>
                            <p className="text-xs text-secondary-500 dark:text-secondary-500 mt-1">
                              IP: {session.ipAddress}
                            </p>
                          </div>
                        </div>
                        {!session.isCurrent && (
                          <button
                            onClick={() => handleRevokeSession(session.id)}
                            className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Revoke session"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-secondary-200 dark:border-secondary-700 p-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Security Tips:</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Revoke sessions from devices you no longer use</li>
              <li>• Check for unfamiliar locations or devices</li>
              <li>• Sign out from public or shared computers</li>
            </ul>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionsModal;
