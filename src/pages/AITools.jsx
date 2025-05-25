import React, { useState } from 'react';
import { Bot, Sparkles, Target, FileText, Send, Copy, RefreshCw } from 'lucide-react';
import BackButton from '../components/BackButton';
import toast from 'react-hot-toast';

const AITools = () => {
  const [activeTab, setActiveTab] = useState('improve');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);

  const tools = [
    {
      id: 'improve',
      title: 'Improve Text',
      description: 'Make your descriptions more professional and impactful',
      icon: Sparkles,
      placeholder: 'Paste your job description or experience text here...',
      prompt: 'Please improve this text to make it more professional and impactful for a CV:'
    },
    {
      id: 'skills',
      title: 'Skill Recommendations',
      description: 'Get relevant skills for your role',
      icon: Target,
      placeholder: 'Enter your job title or field (e.g., Data Scientist, Marketing Manager)...',
      prompt: 'Suggest relevant skills for this role:'
    },
    {
      id: 'ats',
      title: 'ATS Optimization',
      description: 'Optimize your CV for Applicant Tracking Systems',
      icon: FileText,
      placeholder: 'Paste your CV content or job description...',
      prompt: 'Optimize this CV content for ATS (Applicant Tracking Systems):'
    }
  ];

  const currentTool = tools.find(tool => tool.id === activeTab);

  const generateContent = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text first');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual AI API call (OpenAI/Gemini)
      // For now, simulate AI response
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResponses = {
        improve: `Here's an improved version of your text:

• Spearheaded cross-functional initiatives that resulted in 25% increase in operational efficiency
• Collaborated with stakeholders to implement strategic solutions, driving measurable business outcomes
• Demonstrated leadership capabilities by mentoring junior team members and facilitating knowledge transfer
• Utilized data-driven approaches to optimize processes and enhance overall performance metrics`,

        skills: `Recommended skills for your role:

Technical Skills:
• Python, R, SQL
• Machine Learning (TensorFlow, PyTorch)
• Data Visualization (Tableau, Power BI)
• Statistical Analysis
• Big Data Technologies (Hadoop, Spark)

Soft Skills:
• Problem-solving
• Communication
• Project Management
• Team Leadership
• Critical Thinking`,

        ats: `ATS-Optimized version:

PROFESSIONAL EXPERIENCE
Software Engineer | ABC Company | 2020-2023
• Developed and maintained web applications using JavaScript, React, and Node.js
• Collaborated with cross-functional teams to deliver high-quality software solutions
• Implemented automated testing procedures, reducing bug reports by 40%
• Participated in code reviews and mentored junior developers

TECHNICAL SKILLS
Programming Languages: JavaScript, Python, Java
Frameworks: React, Node.js, Express
Databases: MySQL, MongoDB
Tools: Git, Docker, AWS`
      };

      setOutputText(mockResponses[activeTab] || 'AI response generated successfully!');
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    toast.success('Copied to clipboard!');
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div>
        <BackButton to="/" label="Back to Dashboard" />
      </div>

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
          AI Assistant
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 text-lg">
          Enhance your CV with AI-powered tools
        </p>
      </div>

      {/* Tool Tabs */}
      <div className="flex flex-wrap gap-4 justify-center">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => {
              setActiveTab(tool.id);
              setInputText('');
              setOutputText('');
            }}
            className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition-all ${
              activeTab === tool.id
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-primary-50 dark:hover:bg-secondary-700 border border-secondary-200 dark:border-secondary-700'
            }`}
          >
            <tool.icon className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">{tool.title}</div>
              <div className="text-xs opacity-80">{tool.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <currentTool.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              {currentTool.title}
            </h3>
          </div>

          <p className="text-secondary-600 dark:text-secondary-400 mb-4">
            {currentTool.description}
          </p>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={currentTool.placeholder}
            rows={8}
            className="input-field mb-4"
          />

          <div className="flex space-x-3">
            <button
              onClick={generateContent}
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
              onClick={clearAll}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
              AI Generated Content
            </h3>
            {outputText && (
              <button
                onClick={copyToClipboard}
                className="btn-secondary flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </button>
            )}
          </div>

          {outputText ? (
            <div className="bg-secondary-50 dark:bg-secondary-700 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-secondary-800 dark:text-secondary-200 text-sm">
                {outputText}
              </pre>
            </div>
          ) : (
            <div className="bg-secondary-50 dark:bg-secondary-700 rounded-lg p-8 text-center">
              <Bot className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <p className="text-secondary-600 dark:text-secondary-400">
                Enter your text and click "Generate" to see AI-improved content
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="card p-6 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-primary-200 dark:border-primary-800">
        <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">
          💡 AI Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-2">
              Be Specific
            </h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Provide detailed context for better AI suggestions
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-2">
              Review & Edit
            </h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Always review and customize AI-generated content
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-2">
              Use Keywords
            </h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              Include industry-relevant keywords for better ATS optimization
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon Features */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-4">
          🚀 Coming Soon
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-secondary-700 dark:text-secondary-300">
              Cover Letter Generation
            </span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-secondary-700 dark:text-secondary-300">
              Interview Question Prep
            </span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-secondary-700 dark:text-secondary-300">
              Salary Negotiation Tips
            </span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-secondary-700 dark:text-secondary-300">
              LinkedIn Profile Optimization
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITools;
