import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import Header from './Header';
import Footer from '../Footer';
import { useAuth } from '../../contexts/AuthContext';

const MainLayout = () => {
  const location = useLocation();
  const { user, isGuestMode } = useAuth();

  // Hide bottom navigation on auth pages
  const hideBottomNav = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  // Show layout only if user is authenticated or in guest mode
  const showLayout = user || isGuestMode;

  if (!showLayout) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-secondary-900 flex flex-col">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <Outlet />
        </div>
      </main>

      <Footer />

      {!hideBottomNav && <BottomNavigation />}
    </div>
  );
};

export default MainLayout;
