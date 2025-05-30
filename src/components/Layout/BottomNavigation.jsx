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
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-secondary-800/95 backdrop-blur-lg border-t border-secondary-200 dark:border-secondary-700 md:hidden z-50 safe-area-pb bottom-nav-enter">
      <div className="flex items-center justify-around px-4 py-2 relative max-w-md mx-auto">
        {/* Main Navigation Items */}
        {mainNavItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center py-3 px-2 min-w-[60px] rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-6 h-6 mb-1 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                <span className="text-xs font-medium leading-tight">{label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* More Menu */}
        <div className="relative" ref={moreMenuRef}>
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex flex-col items-center py-3 px-2 min-w-[60px] rounded-xl transition-all duration-200 ${
              showMoreMenu || ['/dashboard/profile', '/dashboard/about'].includes(location.pathname)
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400'
            }`}
          >
            <User className={`w-6 h-6 mb-1 transition-transform duration-200 ${
              showMoreMenu || ['/dashboard/profile', '/dashboard/about'].includes(location.pathname) ? 'scale-110' : ''
            }`} />
            <span className="text-xs font-medium leading-tight">More</span>
          </button>

          {/* More Menu Dropdown */}
          {showMoreMenu && (
            <div className="absolute bottom-full right-0 mb-6 w-56 bg-white/95 dark:bg-secondary-800/95 backdrop-blur-lg border border-secondary-200 dark:border-secondary-700 rounded-xl shadow-xl bottom-nav-menu-enter bottom-nav-dropdown">
              <div className="py-3">
                {/* User Info */}
                {!isGuestMode && (
                  <div className="px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                        {user?.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt="Profile"
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                          {user?.displayName || 'User'}
                        </p>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Guest Mode Info */}
                {isGuestMode && (
                  <div className="px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-secondary-900 dark:text-white">
                          Guest Mode
                        </p>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400">
                          Limited features
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Menu Items */}
                <div className="py-2">
                  {/* Profile Settings */}
                  {!isGuestMode && (
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setShowMoreMenu(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 transition-colors rounded-lg mx-3"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Profile Settings</span>
                    </Link>
                  )}

                  {/* About */}
                  <Link
                    to="/dashboard/about"
                    onClick={() => setShowMoreMenu(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 transition-colors rounded-lg mx-3"
                  >
                    <Info className="w-5 h-5" />
                    <span>About</span>
                  </Link>

                  {/* Theme Toggle */}
                  <button
                    onClick={() => {
                      toggleTheme();
                      setShowMoreMenu(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700/50 transition-colors w-full text-left rounded-lg mx-3"
                  >
                    {isDarkMode ? (
                      <>
                        <Sun className="w-5 h-5" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-5 h-5" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Sign Out */}
                <div className="border-t border-secondary-200 dark:border-secondary-700 pt-3 pb-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowMoreMenu(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left rounded-lg mx-3"
                  >
                    <LogOut className="w-5 h-5" />
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
