import React, { useState } from 'react';
import { Database, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import cvService from '../services/cvService';
import shareService from '../services/shareService';
import toast from 'react-hot-toast';

const FirebaseTest = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState({});

  const testCV = {
    cvName: 'Firebase Test CV',
    personal: {
      fullName: 'Firebase Test User',
      email: 'test@firebase.com',
      phone: '+1234567890',
      location: 'Firebase City, FC'
    },
    experience: [
      {
        position: 'Firebase Developer',
        company: 'Test Company',
        startDate: '2023-01-01',
        current: true,
        description: 'Testing Firebase integration'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Firebase',
        field: 'Database Management',
        institution: 'Firebase University',
        graduationYear: '2022'
      }
    ],
    skills: [
      { name: 'Firebase', level: 'Expert' },
      { name: 'Firestore', level: 'Advanced' }
    ],
    template: 'modern'
  };

  const runTest = async (testName, testFunction) => {
    try {
      console.log(`🧪 Running ${testName}...`);
      const result = await testFunction();
      setResults(prev => ({
        ...prev,
        [testName]: { success: true, result, error: null }
      }));
      console.log(`✅ ${testName} passed:`, result);
      return result;
    } catch (error) {
      console.error(`❌ ${testName} failed:`, error);
      setResults(prev => ({
        ...prev,
        [testName]: { success: false, result: null, error: error.message }
      }));
      throw error;
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setResults({});
    
    try {
      console.log('🚀 Starting Firebase integration tests...');

      // Test 1: Guest CV Save
      const guestCV = await runTest('Guest CV Save', async () => {
        return await cvService.saveGuestCV(testCV);
      });

      // Test 2: Guest CV Retrieve
      await runTest('Guest CV Retrieve', async () => {
        const cvs = await cvService.getGuestCVs();
        if (cvs.length === 0) throw new Error('No guest CVs found');
        return cvs;
      });

      // Test 3: Guest CV Update
      await runTest('Guest CV Update', async () => {
        const updatedData = {
          ...testCV,
          personal: {
            ...testCV.personal,
            fullName: 'Updated Firebase Test User'
          }
        };
        return await cvService.updateGuestCV(guestCV.id, updatedData);
      });

      // Test 4: Share CV
      const shareUrl = await runTest('Share CV', async () => {
        return await shareService.createShare(testCV);
      });

      // Test 5: Retrieve Shared CV
      await runTest('Retrieve Shared CV', async () => {
        const shareId = shareUrl.split('/').pop();
        return await shareService.getShare(shareId);
      });

      // Test 6: Get All Shares
      await runTest('Get All Shares', async () => {
        return await shareService.getAllShares();
      });

      // Test 7: Guest CV Delete
      await runTest('Guest CV Delete', async () => {
        return await cvService.deleteGuestCV(guestCV.id);
      });

      console.log('🎉 All Firebase tests completed!');
      toast.success('All Firebase tests passed!');

    } catch (error) {
      console.error('❌ Firebase tests failed:', error);
      toast.error('Some Firebase tests failed. Check console for details.');
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (testName) => {
    const result = results[testName];
    if (!result) return <RefreshCw className="w-4 h-4 text-gray-400" />;
    return result.success 
      ? <CheckCircle className="w-4 h-4 text-green-500" />
      : <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusColor = (testName) => {
    const result = results[testName];
    if (!result) return 'text-gray-500';
    return result.success ? 'text-green-600' : 'text-red-600';
  };

  const testCases = [
    'Guest CV Save',
    'Guest CV Retrieve', 
    'Guest CV Update',
    'Share CV',
    'Retrieve Shared CV',
    'Get All Shares',
    'Guest CV Delete'
  ];

  return (
    <div className="p-6 bg-white dark:bg-secondary-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Firebase Integration Test</span>
        </h3>
        <button
          onClick={runAllTests}
          disabled={testing}
          className="btn-primary flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
          <span>{testing ? 'Testing...' : 'Run Tests'}</span>
        </button>
      </div>

      <div className="space-y-3">
        {testCases.map((testName) => (
          <div
            key={testName}
            className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(testName)}
              <span className={`font-medium ${getStatusColor(testName)}`}>
                {testName}
              </span>
            </div>
            
            {results[testName] && (
              <div className="text-sm">
                {results[testName].success ? (
                  <span className="text-green-600 dark:text-green-400">
                    ✓ Passed
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400" title={results[testName].error}>
                    ✗ Failed
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {Object.keys(results).length > 0 && (
        <div className="mt-6 p-4 bg-secondary-100 dark:bg-secondary-700 rounded-lg">
          <h4 className="font-semibold text-secondary-900 dark:text-white mb-2">
            Test Summary
          </h4>
          <div className="text-sm text-secondary-600 dark:text-secondary-400">
            <div>
              ✅ Passed: {Object.values(results).filter(r => r.success).length}
            </div>
            <div>
              ❌ Failed: {Object.values(results).filter(r => !r.success).length}
            </div>
            <div>
              📊 Total: {Object.keys(results).length}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-secondary-500 dark:text-secondary-400">
        <p>This test suite verifies Firebase Firestore integration for:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Guest CV operations (CRUD)</li>
          <li>Share CV functionality</li>
          <li>Data persistence and retrieval</li>
          <li>Error handling and fallbacks</li>
        </ul>
      </div>
    </div>
  );
};

export default FirebaseTest;
