import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import exportService from './services/exportService';
import './utils/shareTest'; // Import test functions
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import CreateCV from './pages/CreateCV';
import SavedCVs from './pages/SavedCVs';
import AITools from './pages/AITools';
import Profile from './pages/Profile';
import About from './pages/About';
import SharedCV from './pages/SharedCV';


// Root Route Component - Check auth status and redirect accordingly
const RootRoute = () => {
  const { user, isGuestMode, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If user is logged in or in guest mode, redirect to dashboard
  if (user || isGuestMode) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not logged in, redirect to login
  return <Navigate to="/login" replace />;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, isGuestMode, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user && !isGuestMode) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { user, isGuestMode, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (user || isGuestMode) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  // Cleanup expired shares on app startup
  useEffect(() => {
    const cleanup = async () => {
      try {
        const cleanedCount = await exportService.cleanupExpiredShares();
        if (cleanedCount > 0) {
          console.log(`Cleaned up ${cleanedCount} expired shares on startup`);
        }
      } catch (error) {
        console.error('Error during startup cleanup:', error);
      }
    };

    cleanup();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Root Route - Auto redirect based on auth status */}
              <Route path="/" element={<RootRoute />} />

              {/* Public Routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
              <Route path="/forgot-password" element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              } />

              {/* Shared CV Route (Public) */}
              <Route path="/shared/:shareId" element={<SharedCV />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="create-cv" element={<CreateCV />} />
                <Route path="saved-cvs" element={<SavedCVs />} />
                <Route path="ai-tools" element={<AITools />} />
                <Route path="profile" element={<Profile />} />
                <Route path="about" element={<About />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
