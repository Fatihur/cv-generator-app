import React, { useState } from 'react';
import { Mail, Check, X, Loader, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import emailService from '../services/emailService';
import notificationService from '../services/notificationService';
import welcomeService from '../services/welcomeService';
import toast from 'react-hot-toast';

const EmailDebug = ({ isOpen, onClose }) => {
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const { user } = useAuth();

  const emailTests = [
    {
      id: 'direct-emailjs',
      title: 'Direct EmailJS Test',
      description: 'Test EmailJS directly with simple message',
      test: async () => {
        const result = await emailService.sendEmail({
          to: user?.email || 'test@example.com',
          subject: 'Direct EmailJS Test',
          message: 'This is a direct test of EmailJS functionality.',
          template: 'test-email'
        });
        return result;
      }
    },
    {
      id: 'notification-service',
      title: 'Notification Service Test',
      description: 'Test via notification service',
      test: async () => {
        const result = await notificationService.sendTemplateNotification(
          user?.uid || 'guest',
          'test-email',
          {
            email: {
              to: user?.email || 'test@example.com'
            }
          }
        );
        return result;
      }
    },
    {
      id: 'cv-created-test',
      title: 'CV Created Email Test',
      description: 'Test CV created notification',
      test: async () => {
        const result = await notificationService.sendTemplateNotification(
          user?.uid || 'guest',
          'cv-created',
          {
            email: {
              to: user?.email || 'test@example.com',
              cvName: 'Debug Test CV - Software Engineer'
            }
          }
        );
        return result;
      }
    },
    {
      id: 'welcome-email-test',
      title: 'Welcome Email Test',
      description: 'Test welcome email for new users',
      test: async () => {
        const result = await notificationService.sendTemplateNotification(
          user?.uid || 'guest',
          'welcome',
          {
            email: {
              to: user?.email || 'test@example.com',
              userName: user?.displayName || user?.email?.split('@')[0] || 'there'
            }
          }
        );
        return result;
      }
    }
  ];

  const runTest = async (testItem) => {
    setTesting(true);
    try {
      console.log(`🧪 Running test: ${testItem.title}`);
      const result = await testItem.test();

      setTestResults(prev => [...prev, {
        id: testItem.id,
        title: testItem.title,
        success: true,
        result,
        timestamp: new Date().toLocaleTimeString()
      }]);

      toast.success(`${testItem.title} completed successfully!`);
    } catch (error) {
      console.error(`❌ Test failed: ${testItem.title}`, error);

      setTestResults(prev => [...prev, {
        id: testItem.id,
        title: testItem.title,
        success: false,
        error: error.message,
        timestamp: new Date().toLocaleTimeString()
      }]);

      toast.error(`${testItem.title} failed: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const showEmailConfig = () => {
    console.log('📧 EmailJS Configuration:', {
      serviceId: emailService.emailJSConfig.serviceId,
      templateId: emailService.emailJSConfig.templateId,
      publicKey: emailService.emailJSConfig.publicKey.substring(0, 8) + '...',
      useRealEmail: emailService.useRealEmail,
      fromEmail: emailService.fromEmail,
      fromName: emailService.fromName
    });
    toast.success('EmailJS config logged to console');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center space-x-3">
            <Mail className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
              Email Debug Center
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Config Info */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                EmailJS Configuration
              </h3>
              <button
                onClick={showEmailConfig}
                className="btn-secondary flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Show Config</span>
              </button>
            </div>

            <div className="bg-secondary-50 dark:bg-secondary-700 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-secondary-700 dark:text-secondary-300">Status:</span>
                  <span className="ml-2 text-green-600 dark:text-green-400">
                    {emailService.useRealEmail ? 'Real Email Mode' : 'Mock Mode'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-secondary-700 dark:text-secondary-300">Service:</span>
                  <span className="ml-2 text-secondary-900 dark:text-white">EmailJS</span>
                </div>
                <div>
                  <span className="font-medium text-secondary-700 dark:text-secondary-300">From:</span>
                  <span className="ml-2 text-secondary-900 dark:text-white">{emailService.fromEmail}</span>
                </div>
                <div>
                  <span className="font-medium text-secondary-700 dark:text-secondary-300">Test Email:</span>
                  <span className="ml-2 text-secondary-900 dark:text-white">{user?.email || 'Not logged in'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                Email Tests
              </h3>
              <button
                onClick={clearResults}
                className="btn-secondary"
                disabled={testResults.length === 0}
              >
                Clear Results
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {emailTests.map((test) => (
                <div key={test.id} className="card p-4">
                  <h4 className="font-medium text-secondary-900 dark:text-white mb-2">
                    {test.title}
                  </h4>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
                    {test.description}
                  </p>
                  <button
                    onClick={() => runTest(test)}
                    disabled={testing}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {testing ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    <span>{testing ? 'Testing...' : 'Run Test'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                Test Results
              </h3>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.success
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {result.success ? (
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                      <span className={`font-medium ${
                        result.success
                          ? 'text-green-900 dark:text-green-100'
                          : 'text-red-900 dark:text-red-100'
                      }`}>
                        {result.title}
                      </span>
                      <span className="text-xs text-secondary-500 dark:text-secondary-400">
                        {result.timestamp}
                      </span>
                    </div>

                    {result.success ? (
                      <div className="text-sm text-green-800 dark:text-green-200">
                        ✅ Email sent successfully! Check your inbox.
                        {result.result?.messageId && (
                          <div className="mt-1 font-mono text-xs">
                            Message ID: {result.result.messageId}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-red-800 dark:text-red-200">
                        ❌ Error: {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailDebug;
