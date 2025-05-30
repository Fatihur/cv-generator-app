import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, User, LogOut, Info, Settings, ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout, isGuestMode } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 sticky top-0 z-50 md:block hidden">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <h1 className="text-xl font-bold text-secondary-900 dark:text-white">
              CV Generator
            </h1>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-700 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
            ) : (
              <Moon className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
            )}
          </button>

          {/* Profile Menu */}
          {(user || isGuestMode) && (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg bg-secondary-100 dark:bg-secondary-700 hover:bg-secondary-200 dark:hover:bg-secondary-600 transition-colors"
              >
                <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  )}
                </div>
                <span className="text-sm text-secondary-700 dark:text-secondary-300 hidden sm:block">
                  {isGuestMode ? 'Guest' : (user?.displayName || user?.email?.split('@')[0])}
                </span>
                <ChevronDown className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    {!isGuestMode && (
                      <>
                        <div className="px-4 py-2 border-b border-secondary-200 dark:border-secondary-700">
                          <p className="text-sm font-medium text-secondary-900 dark:text-white">
                            {user?.displayName || 'User'}
                          </p>
                          <p className="text-xs text-secondary-600 dark:text-secondary-400">
                            {user?.email}
                          </p>
                        </div>
                        <Link
                          to="/dashboard/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Profile Settings</span>
                        </Link>
                      </>
                    )}
                    <Link
                      to="/dashboard/about"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                    >
                      <Info className="w-4 h-4" />
                      <span>About</span>
                    </Link>
                    <button
                      onClick={() => {
                        toggleTheme();
                        setShowProfileMenu(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors w-full text-left"
                    >
                      {isDarkMode ? (
                        <>
                          <Sun className="w-4 h-4" />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-4 h-4" />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </button>
                    <div className="border-t border-secondary-200 dark:border-secondary-700 mt-2 pt-2">
                      <button
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
