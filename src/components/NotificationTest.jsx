import React, { useState } from 'react';
import { Bell, Mail, Send, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import notificationService from '../services/notificationService';
import toast from 'react-hot-toast';

const NotificationTest = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const { user, isGuestMode } = useAuth();

  const testNotifications = [
    {
      id: 'email',
      title: 'Email Notification Test',
      description: 'Test email notification functionality',
      icon: Mail,
      color: 'blue',
      test: async () => {
        const result = await notificationService.sendEmailNotification(user?.uid || 'guest', {
          to: user?.email || 'guest@example.com',
          subject: 'Test Email from CV Generator',
          message: 'This is a test email notification. Your email notifications are working correctly!',
          template: 'test-email'
        });
        return result;
      }
    },
    {
      id: 'template',
      title: 'Template Notification Test',
      description: 'Test template-based notifications',
      icon: Send,
      color: 'purple',
      test: async () => {
        const result = await notificationService.sendTemplateNotification(
          user?.uid || 'guest',
          'profileUpdated',
          {
            email: {
              to: user?.email || 'guest@example.com'
            }
          }
        );
        return result;
      }
    }
  ];

  const runTest = async (testItem) => {
    setLoading(true);
    try {
      const result = await testItem.test();
      const newResult = {
        id: testItem.id,
        title: testItem.title,
        success: true,
        result: result,
        timestamp: new Date().toLocaleTimeString()
      };
      setTestResults(prev => [newResult, ...prev.filter(r => r.id !== testItem.id)]);
      toast.success(`${testItem.title} completed successfully!`);
    } catch (error) {
      const newResult = {
        id: testItem.id,
        title: testItem.title,
        success: false,
        error: error.message,
        timestamp: new Date().toLocaleTimeString()
      };
      setTestResults(prev => [newResult, ...prev.filter(r => r.id !== testItem.id)]);
      toast.error(`${testItem.title} failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults([]);

    for (const testItem of testNotifications) {
      try {
        const result = await testItem.test();
        const newResult = {
          id: testItem.id,
          title: testItem.title,
          success: true,
          result: result,
          timestamp: new Date().toLocaleTimeString()
        };
        setTestResults(prev => [newResult, ...prev]);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between tests
      } catch (error) {
        const newResult = {
          id: testItem.id,
          title: testItem.title,
          success: false,
          error: error.message,
          timestamp: new Date().toLocaleTimeString()
        };
        setTestResults(prev => [newResult, ...prev]);
      }
    }

    setLoading(false);
    toast.success('All notification tests completed!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
                Notification Test Center
              </h2>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Test all notification types
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
          {/* User Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Test Configuration</h3>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <p><strong>User:</strong> {isGuestMode ? 'Guest Mode' : user?.email || 'Unknown'}</p>
              <p><strong>User ID:</strong> {user?.uid || 'guest'}</p>
              <p><strong>Browser:</strong> {navigator.userAgent.split(' ')[0]}</p>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                Individual Tests
              </h3>
              <button
                onClick={runAllTests}
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Running Tests...' : 'Run All Tests'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testNotifications.map((testItem) => {
                const Icon = testItem.icon;
                const result = testResults.find(r => r.id === testItem.id);

                return (
                  <div key={testItem.id} className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 rounded-lg bg-${testItem.color}-100 dark:bg-${testItem.color}-900/20`}>
                        <Icon className={`w-5 h-5 text-${testItem.color}-600 dark:text-${testItem.color}-400`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-secondary-900 dark:text-white">
                          {testItem.title}
                        </h4>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          {testItem.description}
                        </p>
                      </div>
                    </div>

                    {result && (
                      <div className={`mb-3 p-2 rounded text-sm ${
                        result.success
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                      }`}>
                        <div className="flex items-center space-x-1">
                          {result.success ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          <span>{result.success ? 'Success' : 'Failed'}</span>
                          <span className="text-xs opacity-75">({result.timestamp})</span>
                        </div>
                        {result.error && (
                          <p className="mt-1 text-xs">{result.error}</p>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => runTest(testItem)}
                      disabled={loading}
                      className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Testing...' : 'Test'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                Test Results
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div
                    key={`${result.id}-${index}`}
                    className={`p-3 rounded-lg border ${
                      result.success
                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                        : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-secondary-900 dark:text-white">
                        {result.title}
                      </span>
                      <span className="text-xs text-secondary-500 dark:text-secondary-400">
                        {result.timestamp}
                      </span>
                    </div>
                    {result.error && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        {result.error}
                      </p>
                    )}
                    {result.result && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        {JSON.stringify(result.result, null, 2)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-secondary-200 dark:border-secondary-700 p-6">
          <div className="flex justify-end">
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationTest;
