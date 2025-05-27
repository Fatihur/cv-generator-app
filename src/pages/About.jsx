import React from 'react';
import { Heart, Zap, Shield, Users, Star, Github, Linkedin, Mail } from 'lucide-react';
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
          <div className="flex justify-center space-x-4">
            <a
              href="#"
              className="p-3 bg-white dark:bg-secondary-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-600 transition-colors"
              title="GitHub"
            >
              <Github className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
            </a>
            <a
              href="#"
              className="p-3 bg-white dark:bg-secondary-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-600 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
            </a>
            <a
              href="#"
              className="p-3 bg-white dark:bg-secondary-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-600 transition-colors"
              title="Email"
            >
              <Mail className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="card p-8">
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6 text-center">
          Our Mission
        </h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-secondary-700 dark:text-secondary-300 leading-relaxed mb-6">
            We believe that everyone deserves a professional, well-crafted CV that showcases
            their skills and experience effectively. Our mission is to democratize access to
            professional CV creation tools by combining artificial intelligence with
            user-friendly design.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                10K+
              </div>
              <div className="text-sm text-secondary-600 dark:text-secondary-400">
                CVs Created
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                95%
              </div>
              <div className="text-sm text-secondary-600 dark:text-secondary-400">
                User Satisfaction
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                24/7
              </div>
              <div className="text-sm text-secondary-600 dark:text-secondary-400">
                AI Assistance
              </div>
            </div>
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
