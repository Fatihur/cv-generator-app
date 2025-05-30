import React, { useState } from 'react';
import { Mail, Check, X, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import notificationService from '../services/notificationService';
import toast from 'react-hot-toast';

const EmailTestButton = () => {
  const [testing, setTesting] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const { user, isGuestMode } = useAuth();

  const testEmailNotification = async () => {
    setTesting(true);
    try {
      const result = await notificationService.sendEmailNotification(
        user?.uid || 'guest',
        {
          to: user?.email || 'test@example.com',
          subject: 'Test Email from CV Generator',
          message: 'This is a test email notification. Your email notifications are working correctly!',
          template: 'test-email'
        }
      );
      
      setLastResult({ success: true, result });
      toast.success('Test email sent successfully! Check console for details.');
    } catch (error) {
      setLastResult({ success: false, error: error.message });
      toast.error(`Test email failed: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={testEmailNotification}
        disabled={testing}
        className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {testing ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Mail className="w-4 h-4" />
        )}
        <span>{testing ? 'Testing...' : 'Test Email'}</span>
      </button>

      {lastResult && (
        <div className={`flex items-center space-x-1 text-sm ${
          lastResult.success 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          {lastResult.success ? (
            <Check className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}
          <span>
            {lastResult.success ? 'Success' : 'Failed'}
          </span>
        </div>
      )}
    </div>
  );
};

export default EmailTestButton;
