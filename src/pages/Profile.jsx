import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Shield, Bell, Palette } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import BackButton from '../components/BackButton';
import ChangePasswordModal from '../components/ChangePasswordModal';
import TwoFactorModal from '../components/TwoFactorModal';
import SessionsModal from '../components/SessionsModal';
import ToggleSwitch from '../components/ToggleSwitch';
import EmailDebug from '../components/EmailDebug';
import SimpleEmailTest from '../components/SimpleEmailTest';
import profileService from '../services/profileService';
import notificationService from '../services/notificationService';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, isGuestMode } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef(null);

  // Modal states
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [showEmailDebug, setShowEmailDebug] = useState(false);

  // Security states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    photoURL: user?.photoURL || ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    darkMode: isDarkMode
  });

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      if (!isGuestMode) {
        loadUserProfile();
        loadUserPreferences();
        load2FAStatus();
      } else {
        // For guest mode, just load default preferences
        loadUserPreferences();
      }
    }
  }, [user, isGuestMode]);

  // Sync preferences with theme context
  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      darkMode: isDarkMode
    }));
  }, [isDarkMode]);

  const loadUserProfile = async () => {
    try {
      const profile = await profileService.getUserProfile(user.uid);
      if (profile) {
        setProfileData(prev => ({ ...prev, ...profile }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadUserPreferences = async () => {
    try {
      const userId = isGuestMode ? null : user?.uid;
      const prefs = await profileService.getUserPreferences(userId);
      setPreferences(prev => ({
        ...prev,
        ...prefs,
        darkMode: isDarkMode // Always sync with current theme
      }));
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const load2FAStatus = async () => {
    try {
      const status = await profileService.get2FAStatus(user.uid);
      setTwoFactorEnabled(status.twoFactorEnabled || false);
    } catch (error) {
      console.error('Error loading 2FA status:', error);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  // Handle profile picture upload
  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setLoading(true);
    try {
      const photoURL = await profileService.uploadProfilePicture(user.uid, file);

      // Update profile data
      const updatedProfile = { ...profileData, photoURL };
      setProfileData(updatedProfile);

      // Update Firebase Auth profile
      await profileService.updateAuthProfile(user, updatedProfile);

      // Update Firestore profile
      await profileService.updateUserProfile(user.uid, updatedProfile);

      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Profile picture upload error:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (isGuestMode) {
      toast.error('Profile editing is disabled in guest mode');
      return;
    }

    setLoading(true);

    try {
      // Validate required fields
      if (!profileData.displayName?.trim()) {
        toast.error('Full name is required');
        setLoading(false);
        return;
      }

      // Update Firebase Auth profile
      await profileService.updateAuthProfile(user, profileData);

      // Update Firestore profile
      await profileService.updateUserProfile(user.uid, profileData);

      // Send notification
      try {
        await notificationService.sendTemplateNotification(user.uid, 'profileUpdated', {
          email: {
            to: user.email
          }
        });
      } catch (notifError) {
        console.error('Failed to send notification:', notifError);
      }

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    setLoading(true);

    try {
      // Update theme if changed
      if (preferences.darkMode !== isDarkMode) {
        toggleTheme();
      }

      // Save preferences to Firebase (only if not guest mode)
      if (!isGuestMode) {
        await profileService.updateUserPreferences(user.uid, preferences);
        toast.success('Preferences updated successfully!');
      } else {
        toast.success('Theme preference updated!');
      }
    } catch (error) {
      console.error('Preferences update error:', error);
      toast.error('Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const handle2FAToggle = async () => {
    if (twoFactorEnabled) {
      // Disable 2FA
      try {
        await profileService.disable2FA(user.uid);
        setTwoFactorEnabled(false);
        toast.success('Two-factor authentication disabled');
      } catch (error) {
        toast.error('Failed to disable 2FA');
      }
    } else {
      // Enable 2FA - show modal
      setShowTwoFactor(true);
    }
  };

  const handle2FAUpdate = () => {
    setTwoFactorEnabled(true);
    load2FAStatus(); // Reload status
  };

  const renderProfileTab = () => (
    <form onSubmit={handleProfileUpdate} className="space-y-6">
      {/* Profile Picture */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center overflow-hidden">
            {profileData.photoURL ? (
              <img
                src={profileData.photoURL}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfilePictureUpload}
            className="hidden"
            disabled={isGuestMode || loading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isGuestMode || loading}
            className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Profile Picture
          </h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            Upload a professional photo for your CV (max 5MB)
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={profileData.displayName}
            onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
            className="input-field"
            placeholder="Your full name"
            disabled={isGuestMode}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
            className="input-field"
            placeholder="your.email@example.com"
            disabled={true} // Email usually can't be changed
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Phone
          </label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
            className="input-field"
            placeholder="+1 (555) 123-4567"
            disabled={isGuestMode}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Location
          </label>
          <input
            type="text"
            value={profileData.location}
            onChange={(e) => setProfileData({...profileData, location: e.target.value})}
            className="input-field"
            placeholder="City, Country"
            disabled={isGuestMode}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
            Bio
          </label>
          <textarea
            value={profileData.bio}
            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
            rows={3}
            className="input-field"
            placeholder="Tell us about yourself..."
            disabled={isGuestMode}
          />
        </div>
      </div>

      {isGuestMode && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            Profile editing is disabled in guest mode. Create an account to save your profile information.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || isGuestMode}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Appearance
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              <div>
                <span className="text-secondary-900 dark:text-white">Dark Mode</span>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Use dark theme for better viewing in low light
                </p>
              </div>
            </div>
            <ToggleSwitch
              checked={preferences.darkMode}
              onChange={(checked) => setPreferences({...preferences, darkMode: checked})}
            />
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Notifications
        </h3>

        {/* Email Status Indicator */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-900 dark:text-green-100">
              Email Status: EmailJS Active
            </span>
          </div>
          <p className="text-xs text-green-800 dark:text-green-200 mt-1">
            Real emails will be sent via EmailJS. Check your inbox after profile updates.
          </p>
          <div className="mt-3 space-x-2">
            <button
              onClick={async () => {
                try {
                  await notificationService.sendTemplateNotification(user?.uid || 'guest', 'test-email', {
                    email: { to: user?.email || 'test@example.com' }
                  });
                  toast.success('Test email sent! Check your inbox.');
                } catch (error) {
                  toast.error('Test email failed: ' + error.message);
                }
              }}
              className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition-colors"
            >
              Send Test Email
            </button>

            <button
              onClick={async () => {
                try {
                  await notificationService.sendTemplateNotification(user?.uid || 'guest', 'cv-created', {
                    email: {
                      to: user?.email || 'test@example.com',
                      cvName: 'Test CV - Software Engineer Resume'
                    }
                  });
                  toast.success('CV Created email sent! Check your inbox.');
                } catch (error) {
                  toast.error('CV Created email failed: ' + error.message);
                }
              }}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors"
            >
              Test CV Created
            </button>

            <button
              onClick={async () => {
                try {
                  await notificationService.sendTemplateNotification(user?.uid || 'guest', 'welcome', {
                    email: {
                      to: user?.email || 'test@example.com',
                      userName: user?.displayName || user?.email?.split('@')[0] || 'there'
                    }
                  });
                  toast.success('Welcome email sent! Check your inbox.');
                } catch (error) {
                  toast.error('Welcome email failed: ' + error.message);
                }
              }}
              className="text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-md transition-colors"
            >
              Test Welcome
            </button>

            <button
              onClick={() => setShowEmailDebug(true)}
              className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md transition-colors"
            >
              Debug Center
            </button>
          </div>
        </div>

        {/* Simple Email Test */}
        <div className="mb-6">
          <SimpleEmailTest />
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              <div>
                <span className="text-secondary-900 dark:text-white">Email Notifications</span>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Receive updates about your CVs and account
                </p>
              </div>
            </div>
            <ToggleSwitch
              checked={preferences.emailNotifications}
              onChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
              disabled={isGuestMode}
            />
          </label>


        </div>
      </div>

      {isGuestMode && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            Some preferences are disabled in guest mode. Create an account to save all your preferences.
          </p>
        </div>
      )}

      <button
        onClick={handlePreferencesUpdate}
        disabled={loading}
        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : 'Save Preferences'}
      </button>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Password & Security
        </h3>

        {isGuestMode ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
            <Shield className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Security Features Unavailable
            </h4>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              Create an account to access password management and security features.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-secondary-900 dark:text-white">Password</h4>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Change your account password
                  </p>
                </div>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="btn-secondary"
                >
                  Change Password
                </button>
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-secondary-900 dark:text-white">Two-Factor Authentication</h4>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {twoFactorEnabled
                      ? 'Your account is protected with 2FA'
                      : 'Add an extra layer of security to your account'
                    }
                  </p>
                </div>
                <button
                  onClick={handle2FAToggle}
                  className={twoFactorEnabled ? "btn-secondary" : "btn-primary"}
                >
                  {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                </button>
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-secondary-900 dark:text-white">Login Sessions</h4>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Manage your active sessions across devices
                  </p>
                </div>
                <button
                  onClick={() => setShowSessions(true)}
                  className="btn-secondary"
                >
                  View Sessions
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div>
        <BackButton to="/dashboard" label="Back to Dashboard" />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
          Profile Settings
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-secondary-100 dark:bg-secondary-800 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors flex-1 justify-center ${
              activeTab === tab.id
                ? 'bg-white dark:bg-secondary-700 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="card p-8">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'preferences' && renderPreferencesTab()}
        {activeTab === 'security' && renderSecurityTab()}
      </div>

      {/* Modals */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />

      <TwoFactorModal
        isOpen={showTwoFactor}
        onClose={() => setShowTwoFactor(false)}
        onUpdate={handle2FAUpdate}
      />

      <SessionsModal
        isOpen={showSessions}
        onClose={() => setShowSessions(false)}
      />

      <EmailDebug
        isOpen={showEmailDebug}
        onClose={() => setShowEmailDebug(false)}
      />
    </div>
  );
};

export default Profile;
