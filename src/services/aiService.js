// AI Service for handling AI-powered features
import toast from 'react-hot-toast';

class AIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
  }

  // Mock AI responses for demonstration
  getMockResponse(type, input) {
    const responses = {
      improve: {
        summary: `Enhanced Professional Summary:

• Results-driven professional with proven track record of delivering exceptional outcomes in dynamic environments
• Demonstrated expertise in cross-functional collaboration, driving strategic initiatives that increase operational efficiency by 25%
• Strong analytical and problem-solving capabilities with experience in data-driven decision making
• Excellent communication skills with ability to present complex information to diverse stakeholders
• Committed to continuous learning and professional development in emerging industry trends`,

        experience: `Enhanced Work Experience Description:

• Spearheaded cross-functional initiatives that resulted in 25% increase in operational efficiency and cost reduction
• Collaborated with stakeholders across multiple departments to implement strategic solutions, driving measurable business outcomes
• Demonstrated leadership capabilities by mentoring 5+ junior team members and facilitating knowledge transfer sessions
• Utilized data-driven approaches to optimize processes, resulting in 30% improvement in overall performance metrics
• Successfully managed multiple projects simultaneously while maintaining high quality standards and meeting tight deadlines`,

        default: `Enhanced Professional Content:

• Transformed routine tasks into strategic initiatives that delivered measurable business value
• Demonstrated exceptional problem-solving skills by identifying and resolving complex operational challenges
• Built strong relationships with internal and external stakeholders to drive collaborative success
• Implemented innovative solutions that improved efficiency and reduced costs by 20%
• Maintained high performance standards while adapting to changing business requirements and priorities`
      },

      skills: {
        'data scientist': `Recommended Skills for Data Scientist:

Technical Skills:
• Programming: Python, R, SQL, Scala
• Machine Learning: TensorFlow, PyTorch, Scikit-learn, Keras
• Data Visualization: Tableau, Power BI, Matplotlib, Seaborn
• Big Data: Hadoop, Spark, Kafka, Hive
• Cloud Platforms: AWS, Azure, Google Cloud Platform
• Databases: PostgreSQL, MongoDB, Cassandra
• Statistical Analysis: Hypothesis Testing, A/B Testing, Regression Analysis

Soft Skills:
• Problem-solving and Critical Thinking
• Communication and Presentation
• Project Management
• Team Collaboration
• Business Acumen`,

        'software engineer': `Recommended Skills for Software Engineer:

Technical Skills:
• Programming Languages: JavaScript, Python, Java, C++, Go
• Frontend: React, Vue.js, Angular, HTML5, CSS3
• Backend: Node.js, Express, Django, Spring Boot
• Databases: MySQL, PostgreSQL, MongoDB, Redis
• Cloud Services: AWS, Azure, Google Cloud
• DevOps: Docker, Kubernetes, Jenkins, Git
• Testing: Jest, Cypress, Selenium, Unit Testing

Soft Skills:
• Problem-solving
• Code Review and Collaboration
• Agile/Scrum Methodologies
• Technical Documentation
• Continuous Learning`,

        'marketing manager': `Recommended Skills for Marketing Manager:

Technical Skills:
• Digital Marketing: SEO, SEM, Social Media Marketing
• Analytics: Google Analytics, Adobe Analytics, Tableau
• Marketing Automation: HubSpot, Marketo, Salesforce
• Content Management: WordPress, Drupal, Contentful
• Design Tools: Adobe Creative Suite, Canva, Figma
• Email Marketing: Mailchimp, Constant Contact
• CRM Systems: Salesforce, HubSpot, Pipedrive

Soft Skills:
• Strategic Planning
• Creative Thinking
• Data Analysis and Interpretation
• Project Management
• Team Leadership
• Communication and Presentation`,

        default: `Recommended Professional Skills:

Technical Skills:
• Microsoft Office Suite (Excel, PowerPoint, Word)
• Project Management Tools (Asana, Trello, Monday.com)
• Communication Platforms (Slack, Microsoft Teams)
• Data Analysis (Excel, Google Analytics)
• Social Media Platforms
• Customer Relationship Management (CRM)

Soft Skills:
• Communication and Interpersonal Skills
• Problem-solving and Critical Thinking
• Time Management and Organization
• Adaptability and Flexibility
• Team Collaboration
• Leadership and Initiative`
      },

      ats: `ATS-Optimized Content:

PROFESSIONAL SUMMARY
Results-driven professional with 5+ years of experience in project management and team leadership. Proven track record of delivering projects on time and within budget while maintaining high quality standards. Strong analytical skills with expertise in data analysis and process improvement.

KEY ACHIEVEMENTS
• Increased operational efficiency by 25% through implementation of streamlined processes
• Led cross-functional teams of 10+ members to deliver complex projects worth $2M+
• Reduced costs by 15% while improving service quality and customer satisfaction ratings
• Implemented data-driven solutions that improved decision-making accuracy by 30%

CORE COMPETENCIES
Project Management | Team Leadership | Data Analysis | Process Improvement | Strategic Planning | Stakeholder Management | Budget Management | Quality Assurance | Risk Management | Change Management

TECHNICAL SKILLS
Microsoft Office Suite | Project Management Software | Data Analysis Tools | CRM Systems | Database Management | Reporting and Analytics | Process Documentation | Quality Control Systems`
    };

    const category = type.toLowerCase();
    if (responses[category]) {
      if (typeof responses[category] === 'object') {
        // For skills, try to match the input
        const inputLower = input.toLowerCase();
        for (const [key, value] of Object.entries(responses[category])) {
          if (inputLower.includes(key)) {
            return value;
          }
        }
        return responses[category].default;
      }
      return responses[category];
    }
    
    return responses.improve.default;
  }

  async generateContent(type, input, context = '') {
    try {
      // For now, use mock responses
      // In production, you would make an actual API call to OpenAI
      
      if (!input.trim()) {
        throw new Error('Please provide some text to improve');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const response = this.getMockResponse(type, input);
      return response;

      // Uncomment below for real OpenAI integration:
      /*
      if (!this.apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const prompt = this.buildPrompt(type, input, context);
      
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional CV writing assistant. Help users improve their CV content to be more professional, impactful, and ATS-friendly.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
      */
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  buildPrompt(type, input, context) {
    const prompts = {
      improve: `Please improve this CV content to make it more professional, impactful, and ATS-friendly. Use action verbs and quantify achievements where possible:\n\n${input}`,
      
      skills: `Based on this job title or field: "${input}", suggest relevant technical and soft skills that would be valuable for this role. Format as a clear list.`,
      
      ats: `Optimize this CV content for ATS (Applicant Tracking Systems). Make it keyword-rich and properly formatted:\n\n${input}`,
      
      summary: `Create a professional summary based on this information:\n\n${input}\n\nContext: ${context}`
    };

    return prompts[type] || prompts.improve;
  }

  // Quick suggestions for common improvements
  getQuickSuggestions(type) {
    const suggestions = {
      summary: [
        "Start with your years of experience",
        "Mention your key expertise areas",
        "Include 1-2 major achievements",
        "End with your career objective"
      ],
      experience: [
        "Use action verbs (Led, Managed, Developed, Implemented)",
        "Quantify your achievements with numbers",
        "Focus on results and impact",
        "Keep descriptions concise but specific"
      ],
      skills: [
        "Include both technical and soft skills",
        "Match skills to job requirements",
        "Group similar skills together",
        "Be honest about your proficiency level"
      ]
    };

    return suggestions[type] || suggestions.experience;
  }
}

export default new AIService();
