// AI Service for handling AI-powered features using Gemini API
import toast from 'react-hot-toast';

class AIService {
  constructor() {
    this.apiKey = 'AIzaSyDxhjzBVsX5pOUmxOEJKiy-TjW4tsjJwhc';
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  }

  // Mock AI responses for demonstration (fallback when API fails)
  getMockResponse(type, input) {
    // For improve type, try to actually improve the input text
    if (type === 'improve') {
      return this.generateMockImprovement(input);
    }

    const responses = {

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

    return this.generateMockImprovement(input);
  }

  // Generate mock improvement based on actual input
  generateMockImprovement(input) {
    if (!input || input.trim().length === 0) {
      return "Silakan masukkan teks yang ingin diperbaiki.";
    }

    const inputLower = input.toLowerCase();

    // Check if user is asking to create content (not just improve existing text)
    const isCreationRequest = inputLower.includes('tuliskan') ||
                             inputLower.includes('buatkan') ||
                             inputLower.includes('tolong tuliskan') ||
                             inputLower.includes('generate') ||
                             inputLower.includes('buat');

    if (isCreationRequest) {
      return this.generateMockContent(input);
    }

    // If it's just text improvement
    let improved = input.trim();

    // Basic improvements for existing text
    const improvements = {
      'saya': 'Saya',
      'bekerja': 'berkontribusi',
      'melakukan': 'menjalankan',
      'membuat': 'mengembangkan',
      'membantu': 'mendukung',
      'belajar': 'menguasai',
      'ikut': 'berpartisipasi dalam',
      'dapat': 'mampu',
      'bisa': 'kompeten dalam',
      'pernah': 'memiliki pengalaman',
      'sudah': 'telah',
      'akan': 'berkomitmen untuk',
      'ingin': 'berfokus pada',
      'mau': 'siap untuk'
    };

    // Apply improvements
    Object.keys(improvements).forEach(weak => {
      const strong = improvements[weak];
      const regex = new RegExp(`\\b${weak}\\b`, 'gi');
      improved = improved.replace(regex, strong);
    });

    // Add professional tone
    if (!improved.endsWith('.')) {
      improved += '.';
    }

    // Capitalize first letter
    improved = improved.charAt(0).toUpperCase() + improved.slice(1);

    return `${improved}\n\n(Catatan: Ini adalah hasil fallback. Untuk hasil terbaik, pastikan koneksi internet stabil untuk menggunakan AI Gemini.)`;
  }

  // Generate content based on user request (fallback)
  generateMockContent(input) {
    const inputLower = input.toLowerCase();

    // Extract key information from the request
    if (inputLower.includes('fresh graduate') && inputLower.includes('teknik industri')) {
      return `Lulusan baru Teknik Industri dengan pengalaman magang di bidang supply chain yang memiliki pemahaman mendalam tentang optimasi proses dan manajemen rantai pasok. Memiliki semangat tinggi untuk berkembang dan berkontribusi dalam industri manufaktur dengan menerapkan pengetahuan analitis dan teknis yang telah dipelajari. Berkomitmen untuk terus mengembangkan keahlian dalam perbaikan berkelanjutan dan inovasi operasional untuk menciptakan nilai tambah bagi perusahaan.

(Catatan: Ini adalah hasil fallback. Untuk hasil terbaik, pastikan koneksi internet stabil untuk menggunakan AI Gemini.)`;
    }

    if (inputLower.includes('developer') || inputLower.includes('programming')) {
      return `Software Developer berpengalaman dengan keahlian dalam teknologi modern dan pengembangan aplikasi full-stack. Memiliki track record dalam membangun solusi digital yang scalable dan user-friendly dengan fokus pada kualitas kode dan best practices. Berkomitmen untuk terus mengikuti perkembangan teknologi terbaru dan berkontribusi dalam menciptakan inovasi digital yang memberikan dampak positif.

(Catatan: Ini adalah hasil fallback. Untuk hasil terbaik, pastikan koneksi internet stabil untuk menggunakan AI Gemini.)`;
    }

    if (inputLower.includes('marketing') || inputLower.includes('digital marketing')) {
      return `Marketing Professional dengan pengalaman dalam strategi digital marketing dan manajemen campaign yang efektif. Memiliki keahlian dalam analisis data, optimasi performa marketing, dan pengembangan strategi yang data-driven untuk meningkatkan brand awareness dan konversi. Berfokus pada inovasi marketing dan penggunaan teknologi terbaru untuk mencapai target bisnis yang optimal.

(Catatan: Ini adalah hasil fallback. Untuk hasil terbaik, pastikan koneksi internet stabil untuk menggunakan AI Gemini.)`;
    }

    // Generic professional summary if no specific field detected
    return `Professional yang berdedikasi dengan pengalaman dan keahlian yang relevan dalam bidangnya. Memiliki kemampuan analitis yang kuat, orientasi pada hasil, dan komitmen tinggi terhadap kualitas kerja. Siap untuk berkontribusi dalam tim dan mengembangkan karir dengan fokus pada pencapaian target dan pertumbuhan berkelanjutan.

(Catatan: Ini adalah hasil fallback. Untuk hasil terbaik, pastikan koneksi internet stabil untuk menggunakan AI Gemini.)`;
  }

  async generateContent(type, input, context = '') {
    try {
      if (!input.trim()) {
        throw new Error('Please provide some text to improve');
      }

      if (!this.apiKey) {
        throw new Error('Gemini API key not configured');
      }

      const prompt = this.buildPrompt(type, input, context);

      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response from Gemini API');
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      // Fallback to mock response if API fails
      console.log('Falling back to mock response...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.getMockResponse(type, input);
    }
  }

  buildPrompt(type, input, context) {
    const prompts = {
      improve: `Anda adalah asisten penulisan CV profesional yang sangat ahli. Analisis input pengguna dan lakukan sesuai dengan permintaan mereka.

CARA KERJA:
1. Baca dan pahami input pengguna dengan teliti
2. Identifikasi apakah ini permintaan untuk membuat konten baru atau memperbaiki teks yang ada
3. Jika user meminta "tuliskan", "buatkan", "generate" → BUAT konten baru sesuai permintaan
4. Jika user memberikan teks untuk diperbaiki → PERBAIKI teks tersebut
5. Gunakan informasi yang diberikan user sebagai dasar
6. Hasilkan konten yang profesional, menarik, dan sesuai standar CV

INPUT PENGGUNA:
"${input}"

INSTRUKSI EKSEKUSI:
- Jika user meminta pembuatan konten (seperti "tuliskan tentang saya", "buatkan summary"), buat konten profesional berdasarkan informasi yang diberikan
- Jika user memberikan teks untuk diperbaiki, tingkatkan kualitas bahasa dan struktur
- Gunakan bahasa Indonesia yang profesional dan formal
- Fokus pada achievement dan value proposition
- Berikan HANYA hasil akhir tanpa penjelasan tambahan

Eksekusi permintaan user sekarang:`,

      skills: `Anda adalah konsultan karir. Berdasarkan posisi atau bidang kerja: "${input}", berikan rekomendasi 8-12 skill yang relevan dan berharga untuk posisi tersebut.

Format jawaban sebagai daftar dengan bullet points, pisahkan menjadi:
1. Technical Skills (6-8 skills)
2. Soft Skills (4-6 skills)

Berikan skill yang spesifik dan sesuai dengan industri.`,

      ats: `Anda adalah ahli optimasi ATS (Applicant Tracking System). Tugas Anda adalah mengoptimalkan konten CV berikut agar lebih ATS-friendly.

INSTRUKSI:
- Gunakan kata kunci yang relevan dengan industri
- Gunakan format yang standar dan mudah dibaca ATS
- Pertahankan informasi asli dari pengguna
- Tingkatkan keyword density tanpa keyword stuffing

KONTEN ASLI:
"${input}"

Berikan HANYA versi yang sudah dioptimalkan tanpa penjelasan.`,

      summary: `Anda adalah penulis CV profesional. Buatlah ringkasan profesional yang menarik berdasarkan informasi berikut:

INFORMASI PENGGUNA:
"${input}"

${context ? `KONTEKS TAMBAHAN: ${context}` : ''}

INSTRUKSI:
- Buat dalam 3-4 kalimat
- Gunakan tone yang sesuai dengan level karir
- Highlight kekuatan dan pengalaman utama
- Buat menarik untuk recruiter
- Gunakan HANYA informasi yang diberikan pengguna

Berikan HANYA ringkasan profesional tanpa teks tambahan.`
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
