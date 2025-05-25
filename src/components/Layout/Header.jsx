import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, User, LogOut, Info } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout, isGuestMode } = useAuth();

  return (
    <header className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-7xl">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <h1 className="text-xl font-bold text-secondary-900 dark:text-white">
              CV Generator
            </h1>
          </Link>

          {/* About Link */}
          <Link
            to="/about"
            className="hidden md:flex items-center space-x-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <Info className="w-4 h-4" />
            <span>About</span>
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

          {/* User Info */}
          <div className="flex items-center space-x-2">
            {isGuestMode ? (
              <span className="text-sm text-secondary-600 dark:text-secondary-400 bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded-md">
                Guest Mode
              </span>
            ) : user ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  )}
                </div>
                <span className="text-sm text-secondary-700 dark:text-secondary-300 hidden sm:block">
                  {user.displayName || user.email}
                </span>
              </div>
            ) : null}

            {/* Logout Button */}
            {(user || isGuestMode) && (
              <button
                onClick={logout}
                className="p-2 rounded-lg bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
