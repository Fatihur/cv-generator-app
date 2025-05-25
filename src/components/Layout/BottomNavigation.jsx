import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, Bot, User } from 'lucide-react';

const BottomNavigation = () => {
  const navItems = [
    {
      to: '/',
      icon: Home,
      label: 'Home'
    },
    {
      to: '/saved-cvs',
      icon: FileText,
      label: 'Saved CVs'
    },
    {
      to: '/ai-tools',
      icon: Bot,
      label: 'AI Tools'
    },
    {
      to: '/profile',
      icon: User,
      label: 'Profile'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
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
      </div>
    </nav>
  );
};

export default BottomNavigation;
