import React, { useState } from 'react';
import { Mail, Send, Check, X, Loader } from 'lucide-react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

const SimpleEmailTest = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);

  // Direct EmailJS test without any service layers
  const testDirectEmailJS = async () => {
    setTesting(true);
    setResult(null);

    try {
      console.log('🧪 Starting direct EmailJS test...');

      // Check if EmailJS is available
      if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS is not loaded');
      }

      // EmailJS configuration
      const serviceId = 'service_ctpb75g';
      const templateId = 'template_2jvu2bu';
      const publicKey = '5tqswFOrycJTy_tZq';

      console.log('📧 EmailJS Config:', { serviceId, templateId, publicKey: publicKey.substring(0, 8) + '...' });

      // Simple template parameters that match EmailJS template
      const templateParams = {
        to_email: 'fatihur17@gmail.com',
        subject: 'Direct EmailJS Test - CV Generator Pro',
        message: `Hi there!

This is a direct test of EmailJS functionality from CV Generator Pro.

✅ Test Details:
• Service: EmailJS
• Template: Direct test
• Time: ${new Date().toLocaleString()}

If you receive this email, EmailJS is working correctly!

Best regards,
CV Generator Pro Team

---
Made with ❤️ by Fatih`,
        from_name: 'CV Generator Pro',
        reply_to: 'fatihur17@gmail.com',
        user_name: 'Fatih'
      };

      console.log('📧 Template params:', templateParams);

      // Initialize EmailJS if needed
      try {
        emailjs.init(publicKey);
        console.log('✅ EmailJS initialized');
      } catch (initError) {
        console.warn('⚠️ EmailJS init warning:', initError);
      }

      // Send email directly
      console.log('📤 Sending email...');
      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      console.log('✅ EmailJS Response:', response);

      setResult({
        success: true,
        status: response.status,
        text: response.text,
        timestamp: new Date().toLocaleString()
      });

      toast.success('Direct EmailJS test successful! Check fatihur17@gmail.com inbox.');

    } catch (error) {
      console.error('❌ Direct EmailJS test failed:', error);

      setResult({
        success: false,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toLocaleString()
      });

      toast.error('Direct EmailJS test failed: ' + error.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="card p-6 max-w-md mx-auto">
      <div className="flex items-center space-x-3 mb-4">
        <Mail className="w-6 h-6 text-primary-600" />
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
          Simple EmailJS Test
        </h3>
      </div>

      <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
        Test EmailJS directly without any service layers to isolate the issue.
      </p>

      <button
        onClick={testDirectEmailJS}
        disabled={testing}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {testing ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            <span>Testing...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Test Direct EmailJS</span>
          </>
        )}
      </button>

      {result && (
        <div className={`mt-4 p-4 rounded-lg border ${
          result.success
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
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
              {result.success ? 'Success!' : 'Failed!'}
            </span>
          </div>

          <div className={`text-sm ${
            result.success
              ? 'text-green-800 dark:text-green-200'
              : 'text-red-800 dark:text-red-200'
          }`}>
            {result.success ? (
              <div>
                <p>✅ Email sent successfully!</p>
                <p className="mt-1">Status: {result.status}</p>
                <p>Response: {result.text}</p>
                <p className="mt-2 font-medium">Check fatihur17@gmail.com inbox!</p>
              </div>
            ) : (
              <div>
                <p>❌ Error: {result.error}</p>
                {result.stack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs">Stack trace</summary>
                    <pre className="text-xs mt-1 overflow-auto max-h-32 bg-black bg-opacity-10 p-2 rounded">
                      {result.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}
            <p className="mt-2 text-xs opacity-75">
              Time: {result.timestamp}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
        <h4 className="text-sm font-medium text-secondary-900 dark:text-white mb-2">
          Configuration:
        </h4>
        <div className="text-xs text-secondary-600 dark:text-secondary-400 space-y-1">
          <p>Service ID: service_ctpb75g</p>
          <p>Template ID: template_2jvu2bu</p>
          <p>Public Key: 5tqswFOrycJTy_tZq</p>
          <p>To: fatihur17@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleEmailTest;
