import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Bot, Sparkles, TrendingUp, Users, Clock, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import cvService from '../services/cvService';

const Dashboard = () => {
  const { user, isGuestMode } = useAuth();
  const [recentCVs, setRecentCVs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentCVs();
  }, [user, isGuestMode]);

  const loadRecentCVs = async () => {
    try {
      setLoading(true);
      let cvs = [];

      if (isGuestMode) {
        cvs = cvService.getGuestCVs();
      } else if (user) {
        cvs = await cvService.getUserCVs(user.uid);
      }

      // Get only the 3 most recent CVs
      const recent = cvs.slice(0, 3);
      setRecentCVs(recent);
    } catch (error) {
      console.error('Error loading recent CVs:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Create New CV',
      description: 'Start building your professional CV',
      icon: Plus,
      to: '/create-cv',
      color: 'bg-primary-600 hover:bg-primary-700',
      textColor: 'text-white'
    },
    {
      title: 'View Saved CVs',
      description: 'Access your previously created CVs',
      icon: FileText,
      to: '/saved-cvs',
      color: 'bg-green-600 hover:bg-green-700',
      textColor: 'text-white'
    },
    {
      title: 'AI Assistant',
      description: 'Get AI help for your CV content',
      icon: Bot,
      to: '/ai-tools',
      color: 'bg-purple-600 hover:bg-purple-700',
      textColor: 'text-white'
    }
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Content',
      description: 'Generate professional descriptions with AI assistance'
    },
    {
      icon: TrendingUp,
      title: 'ATS Optimization',
      description: 'Optimize your CV to pass Applicant Tracking Systems'
    },
    {
      icon: Users,
      title: 'Multiple Templates',
      description: 'Choose from various professional CV templates'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
          Welcome{user ? `, ${user.displayName || user.email?.split('@')[0]}` : ''}!
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 text-lg">
          {isGuestMode
            ? 'You\'re in guest mode. Create a CV to get started!'
            : 'Ready to create your next professional CV?'
          }
        </p>
      </div>

      {/* Guest Mode Warning */}
      {isGuestMode && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              <strong>Guest Mode:</strong> Your CVs won't be saved permanently.
              <Link to="/register" className="underline ml-1">Create an account</Link> to save your work.
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.to}
            className={`${action.color} ${action.textColor} p-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg`}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <action.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Features Section */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6 text-center">
          Why Choose Our CV Generator?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold text-lg text-secondary-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-secondary-600 dark:text-secondary-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
            Recent Activity
          </h2>
          {recentCVs.length > 0 && (
            <Link
              to="/saved-cvs"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : recentCVs.length > 0 ? (
          <div className="space-y-3">
            {recentCVs.map((cv) => (
              <div key={cv.id} className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-700 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-600 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-900 dark:text-white">
                      {cv.personal?.fullName || 'Untitled CV'}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
                      <Clock className="w-3 h-3" />
                      <span>Updated {new Date(cv.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to="/create-cv"
                    state={{ cvData: cv, cvId: cv.id }}
                    className="p-2 text-secondary-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/saved-cvs"
                    className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <FileText className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-600 dark:text-secondary-400">
              No recent activity. Start by creating your first CV!
            </p>
            <Link
              to="/create-cv"
              className="btn-primary mt-4 inline-block"
            >
              Create Your First CV
            </Link>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="card p-6 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-primary-200 dark:border-primary-800">
        <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">
          💡 Pro Tips
        </h2>
        <ul className="space-y-2 text-secondary-700 dark:text-secondary-300">
          <li>• Use action verbs to describe your achievements</li>
          <li>• Quantify your accomplishments with numbers</li>
          <li>• Tailor your CV for each job application</li>
          <li>• Keep it concise - aim for 1-2 pages</li>
          <li>• Use our AI assistant for professional descriptions</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
