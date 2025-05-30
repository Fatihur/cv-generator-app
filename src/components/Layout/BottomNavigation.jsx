import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Home, FileText, Bot, User, Plus, Settings, Info, LogOut, Moon, Sun, ChevronUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const BottomNavigation = () => {
  const { user, logout, isGuestMode } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef(null);
  const location = useLocation();

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const mainNavItems = [
    {
      to: '/dashboard',
      icon: Home,
      label: 'Home'
    },
    {
      to: '/dashboard/saved-cvs',
      icon: FileText,
      label: 'CVs'
    },
    {
      to: '/dashboard/create-cv',
      icon: Plus,
      label: 'Create'
    },
    {
      to: '/dashboard/ai-tools',
      icon: Bot,
      label: 'AI'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 md:hidden z-50">
      <div className="flex items-center justify-around py-2 relative">
        {/* Main Navigation Items */}
        {mainNavItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}

        {/* More Menu */}
        <div className="relative" ref={moreMenuRef}>
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              showMoreMenu || ['/dashboard/profile', '/dashboard/about'].includes(location.pathname)
                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                : 'text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400'
            }`}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">More</span>
          </button>

          {/* More Menu Dropdown */}
          {showMoreMenu && (
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg shadow-lg">
              <div className="py-2">
                {/* User Info */}
                {!isGuestMode && (
                  <div className="px-4 py-2 border-b border-secondary-200 dark:border-secondary-700">
                    <p className="text-sm font-medium text-secondary-900 dark:text-white">
                      {user?.displayName || 'User'}
                    </p>
                    <p className="text-xs text-secondary-600 dark:text-secondary-400">
                      {user?.email}
                    </p>
                  </div>
                )}

                {/* Profile Settings */}
                {!isGuestMode && (
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setShowMoreMenu(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Profile Settings</span>
                  </Link>
                )}

                {/* About */}
                <Link
                  to="/dashboard/about"
                  onClick={() => setShowMoreMenu(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                >
                  <Info className="w-4 h-4" />
                  <span>About</span>
                </Link>

                {/* Theme Toggle */}
                <button
                  onClick={() => {
                    toggleTheme();
                    setShowMoreMenu(false);
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

                {/* Sign Out */}
                <div className="border-t border-secondary-200 dark:border-secondary-700 mt-2 pt-2">
                  <button
                    onClick={() => {
                      logout();
                      setShowMoreMenu(false);
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
      </div>
    </nav>
  );
};

export default BottomNavigation;
