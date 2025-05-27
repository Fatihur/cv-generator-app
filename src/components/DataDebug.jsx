import React, { useState, useEffect } from 'react';
import { Bug, Database, RefreshCw, User, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import cvService from '../services/cvService';
import toast from 'react-hot-toast';

const DataDebug = () => {
  const { user, isGuestMode } = useAuth();
  const [debugData, setDebugData] = useState({});
  const [loading, setLoading] = useState(false);

  const runDebug = async () => {
    setLoading(true);
    const debug = {
      timestamp: new Date().toISOString(),
      auth: {
        isGuestMode,
        user: user ? {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        } : null
      },
      localStorage: {},
      firebase: {},
      errors: []
    };

    try {
      // Check localStorage
      console.log('🔍 Checking localStorage...');
      
      // Guest CVs in localStorage
      try {
        const guestCVsLocal = localStorage.getItem('guestCVs');
        debug.localStorage.guestCVs = guestCVsLocal ? JSON.parse(guestCVsLocal) : [];
        debug.localStorage.guestCVsCount = debug.localStorage.guestCVs.length;
      } catch (error) {
        debug.errors.push(`localStorage guestCVs error: ${error.message}`);
      }

      // User CVs in localStorage
      if (user) {
        try {
          const userCVsLocal = localStorage.getItem(`userCVs_${user.uid}`);
          debug.localStorage.userCVs = userCVsLocal ? JSON.parse(userCVsLocal) : [];
          debug.localStorage.userCVsCount = debug.localStorage.userCVs.length;
        } catch (error) {
          debug.errors.push(`localStorage userCVs error: ${error.message}`);
        }
      }

      // Guest ID
      debug.localStorage.guestId = localStorage.getItem('guestId');

      // Check Firebase
      console.log('🔍 Checking Firebase...');
      
      if (isGuestMode) {
        try {
          const guestCVsFirebase = await cvService.getGuestCVs();
          debug.firebase.guestCVs = guestCVsFirebase;
          debug.firebase.guestCVsCount = guestCVsFirebase.length;
          debug.firebase.guestCVsSource = guestCVsFirebase.map(cv => cv.source);
        } catch (error) {
          debug.errors.push(`Firebase guestCVs error: ${error.message}`);
        }
      } else if (user) {
        try {
          const userCVsFirebase = await cvService.getUserCVs(user.uid);
          debug.firebase.userCVs = userCVsFirebase;
          debug.firebase.userCVsCount = userCVsFirebase.length;
          debug.firebase.userCVsSource = userCVsFirebase.map(cv => cv.source);
        } catch (error) {
          debug.errors.push(`Firebase userCVs error: ${error.message}`);
        }
      }

      console.log('🔍 Debug data collected:', debug);
      setDebugData(debug);

    } catch (error) {
      debug.errors.push(`General error: ${error.message}`);
      setDebugData(debug);
    } finally {
      setLoading(false);
    }
  };

  const createTestData = async () => {
    try {
      const testCV = {
        cvName: 'Debug Test CV',
        personal: {
          fullName: 'Debug Test User',
          email: 'debug@test.com',
          phone: '+1234567890'
        },
        experience: [],
        education: [],
        skills: [],
        template: 'modern'
      };

      if (isGuestMode) {
        const result = await cvService.saveGuestCV(testCV);
        toast.success(`Test guest CV created: ${result.id}`);
      } else if (user) {
        const result = await cvService.saveCV(testCV, user.uid);
        toast.success(`Test user CV created: ${result.id}`);
      }

      // Refresh debug data
      runDebug();
    } catch (error) {
      toast.error(`Failed to create test CV: ${error.message}`);
    }
  };

  const clearLocalStorage = () => {
    try {
      // Clear guest CVs
      localStorage.removeItem('guestCVs');
      
      // Clear user CVs
      if (user) {
        localStorage.removeItem(`userCVs_${user.uid}`);
      }
      
      // Clear guest ID
      localStorage.removeItem('guestId');
      
      toast.success('localStorage cleared');
      runDebug();
    } catch (error) {
      toast.error(`Failed to clear localStorage: ${error.message}`);
    }
  };

  useEffect(() => {
    runDebug();
  }, [user, isGuestMode]);

  return (
    <div className="p-6 bg-white dark:bg-secondary-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white flex items-center space-x-2">
          <Bug className="w-5 h-5" />
          <span>Data Debug Panel</span>
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={createTestData}
            className="btn-secondary text-sm"
          >
            Create Test CV
          </button>
          <button
            onClick={clearLocalStorage}
            className="btn-secondary text-sm"
          >
            Clear localStorage
          </button>
          <button
            onClick={runDebug}
            disabled={loading}
            className="btn-primary text-sm flex items-center space-x-1"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {debugData.timestamp && (
        <div className="space-y-6">
          {/* Auth Status */}
          <div className="p-4 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
            <h4 className="font-semibold text-secondary-900 dark:text-white mb-2 flex items-center space-x-2">
              {isGuestMode ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
              <span>Authentication Status</span>
            </h4>
            <div className="text-sm space-y-1">
              <div>Mode: <span className="font-mono">{isGuestMode ? 'Guest' : 'Authenticated'}</span></div>
              {user && (
                <>
                  <div>User ID: <span className="font-mono">{user.uid}</span></div>
                  <div>Email: <span className="font-mono">{user.email}</span></div>
                </>
              )}
              {isGuestMode && debugData.localStorage.guestId && (
                <div>Guest ID: <span className="font-mono">{debugData.localStorage.guestId}</span></div>
              )}
            </div>
          </div>

          {/* localStorage Data */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h4 className="font-semibold text-secondary-900 dark:text-white mb-2">
              localStorage Data
            </h4>
            <div className="text-sm space-y-1">
              {isGuestMode ? (
                <div>Guest CVs: <span className="font-mono">{debugData.localStorage.guestCVsCount || 0}</span></div>
              ) : (
                <div>User CVs: <span className="font-mono">{debugData.localStorage.userCVsCount || 0}</span></div>
              )}
            </div>
          </div>

          {/* Firebase Data */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-semibold text-secondary-900 dark:text-white mb-2 flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Firebase Data</span>
            </h4>
            <div className="text-sm space-y-1">
              {isGuestMode ? (
                <>
                  <div>Guest CVs: <span className="font-mono">{debugData.firebase.guestCVsCount || 0}</span></div>
                  {debugData.firebase.guestCVsSource && (
                    <div>Sources: <span className="font-mono">{debugData.firebase.guestCVsSource.join(', ')}</span></div>
                  )}
                </>
              ) : (
                <>
                  <div>User CVs: <span className="font-mono">{debugData.firebase.userCVsCount || 0}</span></div>
                  {debugData.firebase.userCVsSource && (
                    <div>Sources: <span className="font-mono">{debugData.firebase.userCVsSource.join(', ')}</span></div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Errors */}
          {debugData.errors.length > 0 && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                Errors ({debugData.errors.length})
              </h4>
              <div className="text-sm space-y-1">
                {debugData.errors.map((error, index) => (
                  <div key={index} className="text-red-700 dark:text-red-300 font-mono">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Data */}
          <details className="p-4 bg-secondary-100 dark:bg-secondary-700 rounded-lg">
            <summary className="font-semibold text-secondary-900 dark:text-white cursor-pointer">
              Raw Debug Data
            </summary>
            <pre className="mt-2 text-xs overflow-auto bg-secondary-200 dark:bg-secondary-800 p-2 rounded">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default DataDebug;
