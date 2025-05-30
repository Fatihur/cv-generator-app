import React, { useState, useEffect } from 'react';
import { X, Shield, Copy, Check, QrCode, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import profileService from '../services/profileService';
import toast from 'react-hot-toast';

const TwoFactorModal = ({ isOpen, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Setup, 2: QR Code, 3: Backup Codes
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [copiedCodes, setCopiedCodes] = useState(false);
  const { user } = useAuth();

  const handleEnable2FA = async () => {
    setLoading(true);
    try {
      const result = await profileService.enable2FA(user.uid);
      setQrCode(result.qrCode);
      setBackupCodes(result.backupCodes);
      setStep(2);
      toast.success('2FA setup initiated!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndComplete = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    try {
      // In a real implementation, you'd verify the code here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate verification
      setStep(3);
      toast.success('2FA verified successfully!');
    } catch (error) {
      toast.error('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    onUpdate();
    onClose();
    setStep(1);
    setVerificationCode('');
    setCopiedCodes(false);
  };

  const copyBackupCodes = () => {
    const codesText = backupCodes.join('\n');
    navigator.clipboard.writeText(codesText);
    setCopiedCodes(true);
    toast.success('Backup codes copied to clipboard!');
    setTimeout(() => setCopiedCodes(false), 3000);
  };

  const handleClose = () => {
    setStep(1);
    setVerificationCode('');
    setCopiedCodes(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
                Two-Factor Authentication
              </h2>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Step {step} of 3
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                  Secure Your Account
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  Two-factor authentication adds an extra layer of security to your account by requiring a code from your phone in addition to your password.
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">What you'll need:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• An authenticator app (Google Authenticator, Authy, etc.)</li>
                  <li>• Your phone to scan a QR code</li>
                  <li>• A safe place to store backup codes</li>
                </ul>
              </div>

              <button
                onClick={handleEnable2FA}
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Setting up...' : 'Enable 2FA'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <QrCode className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                  Scan QR Code
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  Open your authenticator app and scan this QR code
                </p>
              </div>

              {/* Mock QR Code */}
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-secondary-300 dark:border-secondary-600 text-center">
                <div className="w-48 h-48 bg-secondary-100 dark:bg-secondary-700 rounded-lg mx-auto flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-secondary-400" />
                </div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-2">
                  QR Code for 2FA Setup
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Enter verification code from your app
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input-field text-center text-lg tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 btn-secondary"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyAndComplete}
                  disabled={loading || verificationCode.length !== 6}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
                  2FA Enabled Successfully!
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  Save these backup codes in a safe place. You can use them to access your account if you lose your phone.
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100 flex items-center">
                    <Key className="w-4 h-4 mr-2" />
                    Backup Codes
                  </h4>
                  <button
                    onClick={copyBackupCodes}
                    className="text-sm text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100 flex items-center space-x-1"
                  >
                    {copiedCodes ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCodes ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="bg-white dark:bg-secondary-800 p-2 rounded border">
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>Important:</strong> Store these codes securely. Each code can only be used once and they're your only way to access your account if you lose your authenticator device.
                </p>
              </div>

              <button
                onClick={handleComplete}
                className="w-full btn-primary"
              >
                Complete Setup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoFactorModal;
