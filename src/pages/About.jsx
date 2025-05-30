import React from 'react';
import { Heart, Zap, Shield, Users, Star, Mail, Globe } from 'lucide-react';
import BackButton from '../components/BackButton';

const About = () => {
  const features = [
    {
      icon: Zap,
      title: 'AI-Powered',
      description: 'Advanced AI assistance using Gemini API to improve your CV content and make it more professional.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is secure with Firebase authentication and encrypted storage. Guest mode for privacy.'
    },
    {
      icon: Users,
      title: 'User-Friendly',
      description: 'Intuitive interface designed for everyone, from students to professionals.'
    },
    {
      icon: Star,
      title: 'Professional Templates',
      description: 'Beautiful, ATS-friendly templates that help you stand out to employers.'
    }
  ];

  const technologies = [
    { name: 'React', description: 'Modern UI library' },
    { name: 'Firebase', description: 'Authentication & Database' },
    { name: 'Gemini AI', description: 'AI content generation' },
    { name: 'Tailwind CSS', description: 'Styling framework' },
    { name: 'Vite', description: 'Build tool' },
    { name: 'React Router', description: 'Navigation' }
  ];

  return (
    <div className="space-y-12">
      {/* Back Button */}
      <div>
        <BackButton to="/dashboard" label="Back to Dashboard" />
      </div>

      {/* Hero Section */}
      <div className="text-center">
        <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-3xl">CV</span>
        </div>
        <h1 className="text-4xl font-bold text-secondary-900 dark:text-white mb-4">
          About CV Generator
        </h1>
        <p className="text-xl text-secondary-600 dark:text-secondary-400 max-w-3xl mx-auto">
          A modern, AI-powered CV generator that helps you create professional resumes
          with ease. Built with cutting-edge technology and designed for the modern job seeker.
        </p>
      </div>

      {/* Features Section */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-8 text-center">
          Why Choose Our CV Generator?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-secondary-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-8 text-center">
          Built With Modern Technology
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {technologies.map((tech, index) => (
            <div key={index} className="text-center p-4 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
              <h3 className="font-semibold text-secondary-900 dark:text-white mb-1">
                {tech.name}
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Developer Section */}
      <div className="card p-8 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-primary-200 dark:border-primary-800">
        <div className="text-center">
          <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">F</span>
          </div>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
            Meet the Developer
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-lg text-secondary-700 dark:text-secondary-300">Made with</span>
            <Heart className="w-5 h-5 text-red-500 fill-current" />
            <span className="text-lg text-secondary-700 dark:text-secondary-300">by</span>
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">Fatih</span>
          </div>
          <p className="text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto mb-6">
            Passionate full-stack developer dedicated to creating tools that help people
            advance their careers. This CV generator combines modern web technologies
            with AI to provide the best user experience.
          </p>

          {/* Social Links */}
          <div className="flex justify-center space-x-3">
            <a
              href="https://fatih-porto.my.id"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white dark:bg-secondary-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-600 transition-colors group"
              title="Portfolio - fatih-porto.my.id"
            >
              <Globe className="w-5 h-5 text-secondary-600 dark:text-secondary-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
            </a>
            <a
              href="https://github.com/Fatihur"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white dark:bg-secondary-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-600 transition-colors group"
              title="GitHub - Fatihur"
            >
              <svg className="w-5 h-5 text-secondary-600 dark:text-secondary-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/fatihur-royyan-111a84190/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white dark:bg-secondary-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-600 transition-colors group"
              title="LinkedIn - Fatihur Royyan"
            >
              <svg className="w-5 h-5 text-secondary-600 dark:text-secondary-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="mailto:fatihur17@gmail.com"
              className="p-3 bg-white dark:bg-secondary-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-600 transition-colors group"
              title="Email - fatihur17@gmail.com"
            >
              <Mail className="w-5 h-5 text-secondary-600 dark:text-secondary-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
            </a>
          </div>
        </div>
      </div>



      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4">
          Ready to Create Your Professional CV?
        </h2>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          Join thousands of professionals who have already created their perfect CV.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/create-cv"
            className="btn-primary inline-flex items-center justify-center"
          >
            Create Your CV Now
          </a>
          <a
            href="/ai-tools"
            className="btn-secondary inline-flex items-center justify-center"
          >
            Try AI Tools
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
