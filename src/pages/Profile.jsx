import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Shield, Bell, Palette } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import BackButton from '../components/BackButton';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, isGuestMode } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    darkMode: isDarkMode
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Update user profile in Firebase
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
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

      // TODO: Save preferences to Firebase
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Preferences updated successfully!');
    } catch (error) {
      console.error('Preferences update error:', error);
      toast.error('Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const renderProfileTab = () => (
    <form onSubmit={handleProfileUpdate} className="space-y-6">
      {/* Profile Picture */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            )}
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
            Profile Picture
          </h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            Upload a professional photo for your CV
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
            <input
              type="checkbox"
              checked={preferences.darkMode}
              onChange={(e) => setPreferences({...preferences, darkMode: e.target.checked})}
              className="toggle"
            />
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
          Notifications
        </h3>
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
            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
              className="toggle"
              disabled={isGuestMode}
            />
          </label>

          <label className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              <div>
                <span className="text-secondary-900 dark:text-white">Push Notifications</span>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Get notified about important updates
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.pushNotifications}
              onChange={(e) => setPreferences({...preferences, pushNotifications: e.target.checked})}
              className="toggle"
              disabled={isGuestMode}
            />
          </label>

          <label className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              <div>
                <span className="text-secondary-900 dark:text-white">Marketing Emails</span>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">
                  Receive tips and updates about CV writing
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences.marketingEmails}
              onChange={(e) => setPreferences({...preferences, marketingEmails: e.target.checked})}
              className="toggle"
              disabled={isGuestMode}
            />
          </label>
        </div>
      </div>

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
                    Last changed 30 days ago
                  </p>
                </div>
                <button className="btn-secondary">
                  Change Password
                </button>
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-secondary-900 dark:text-white">Two-Factor Authentication</h4>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <button className="btn-secondary">
                  Enable 2FA
                </button>
              </div>
            </div>

            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-secondary-900 dark:text-white">Login Sessions</h4>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Manage your active sessions
                  </p>
                </div>
                <button className="btn-secondary">
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
    </div>
  );
};

export default Profile;
