import React, { useState } from 'react';
import { X, Bot, Send, Copy, RefreshCw, Lightbulb } from 'lucide-react';
import aiService from '../services/aiService';
import toast from 'react-hot-toast';

const AIModal = ({ isOpen, onClose, onApply, type = 'improve', initialText = '', placeholder = '' }) => {
  const [inputText, setInputText] = useState(initialText);
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);

  const modalTitles = {
    improve: 'AI Text Improvement',
    skills: 'AI Skill Suggestions',
    ats: 'ATS Optimization',
    summary: 'AI Summary Generator'
  };

  const modalDescriptions = {
    improve: 'Get AI-powered suggestions to make your text more professional and impactful',
    skills: 'Get relevant skill recommendations based on your role or field',
    ats: 'Optimize your content for Applicant Tracking Systems',
    summary: 'Generate a professional summary based on your information'
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text first');
      return;
    }

    setLoading(true);
    try {
      const result = await aiService.generateContent(type, inputText);
      setOutputText(result);
      toast.success('AI content generated successfully!');
    } catch (error) {
      console.error('AI Generation Error:', error);
      toast.error(error.message || 'Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast.success('Copied to clipboard!');
  };

  const handleApply = () => {
    if (outputText && onApply) {
      onApply(outputText);
      toast.success('Applied to form!');
      onClose();
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const suggestions = aiService.getQuickSuggestions(type);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 pb-8 modal-container">
      <div className="bg-white dark:bg-secondary-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden modal-content">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
                {modalTitles[type]}
              </h2>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                {modalDescriptions[type]}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Your Content
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={placeholder || `Enter your ${type === 'skills' ? 'job title or field' : 'text'} here...`}
                  rows={8}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                />
              </div>

              {/* Quick Tips */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Quick Tips
                  </span>
                </div>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  {suggestions.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleGenerate}
                  disabled={loading || !inputText.trim()}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{loading ? 'Generating...' : 'Generate'}</span>
                </button>

                <button
                  onClick={handleClear}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  AI Generated Content
                </label>
                {outputText && (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCopy}
                      className="btn-secondary flex items-center space-x-2 text-xs"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={handleApply}
                      className="btn-primary flex items-center space-x-2 text-xs"
                    >
                      <span>Apply</span>
                    </button>
                  </div>
                )}
              </div>

              {outputText ? (
                <div className="bg-secondary-50 dark:bg-secondary-700 rounded-lg p-4 border border-secondary-200 dark:border-secondary-600">
                  <pre className="whitespace-pre-wrap text-secondary-800 dark:text-secondary-200 text-sm font-sans">
                    {outputText}
                  </pre>
                </div>
              ) : (
                <div className="bg-secondary-50 dark:bg-secondary-700 rounded-lg p-8 text-center border border-secondary-200 dark:border-secondary-600">
                  <Bot className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                  <p className="text-secondary-600 dark:text-secondary-400">
                    Enter your content and click "Generate" to see AI-improved version
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900">
          <div className="text-xs text-secondary-500 dark:text-secondary-400">
            💡 AI suggestions are meant to inspire. Always review and customize the content.
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Close
            </button>
            {outputText && (
              <button
                onClick={handleApply}
                className="btn-primary"
              >
                Apply to Form
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModal;
