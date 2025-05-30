# 📄 CV Generator by Fatih

A modern, AI-powered CV generator built with React, Firebase, and Tailwind CSS. Create professional CVs with AI assistance, export to multiple formats, and share with ease.

![CV Generator](https://img.shields.io/badge/React-18+-blue.svg)
![Firebase](https://img.shields.io/badge/Firebase-9+-orange.svg)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3+-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ Features

### 🔐 **Authentication & Security**
- **Email/Password** registration and login with validation
- **Google OAuth** integration for quick access
- **Password reset** functionality with email verification
- **Guest mode** for trying the app without registration
- **Session management** with automatic logout
- **Security features** including password strength validation

### 🎨 **Modern UI/UX**
- **Mobile-first responsive design** with bottom navigation
- **Dark/Light mode toggle** with system preference detection
- **Glassmorphism effects** and modern animations
- **Professional interface** with clean typography
- **Toast notifications** for user feedback
- **Loading states** and smooth transitions
- **Accessibility compliant** design

### 📝 **CV Management**
- **Structured CV builder** with comprehensive sections:
  - Personal Information
  - Work Experience with rich descriptions
  - Education with graduation years
  - Skills with proficiency levels
  - Achievements and accomplishments
  - Certificates and certifications
- **Save CVs** (localStorage for guests, Firebase for users)
- **Edit and update** existing CVs
- **Delete with confirmation** to prevent accidents
- **CV preview** with professional formatting

### 🤖 **AI Assistant (Gemini 2.0 Flash)**
- **Text improvement** for professional descriptions
- **Content generation** based on user context
- **Skill recommendations** for specific roles
- **ATS optimization** suggestions
- **Real-time AI assistance** with Gemini API integration
- **Context-aware suggestions** for different CV sections

### 📤 **Export & Share**
- **PDF export** with professional formatting
- **Multiple export formats** (PDF, DOCX, PNG)
- **Share functionality** with secure links
- **Public CV sharing** with custom URLs
- **Download management** with progress tracking
- **Layout preservation** in exported files

### 👤 **Profile Management**
- **User profile settings** with photo upload
- **Email notification preferences**
- **Theme and display preferences**
- **Account security settings**
- **Session management** and device tracking

## 🚀 **Live Demo**

🌐 **Website**: [fatih-porto.my.id](https://fatih-porto.my.id)
📧 **Contact**: fatihur17@gmail.com
💼 **LinkedIn**: [Fatihur Royyan](https://www.linkedin.com/in/fatihur-royyan-111a84190/)
🐙 **GitHub**: [Fatihur](https://github.com/Fatihur)

## 📱 **Screenshots**

### Desktop View
- Clean dashboard with CV management
- Professional CV builder interface
- AI assistant integration
- Export and share options

### Mobile View
- Responsive bottom navigation
- Touch-optimized forms
- Mobile-friendly modals
- Glassmorphism design

## 🚧 **Future Enhancements**

- **Advanced Templates** - More CV design options
- **Cover Letter Generator** - AI-powered cover letters
- **Interview Preparation** - AI-generated interview questions
- **LinkedIn Integration** - Direct profile import/export
- **Analytics Dashboard** - CV performance insights
- **Team Collaboration** - Share and collaborate on CVs
- **API Integration** - Connect with job boards
- **Premium Features** - Advanced AI capabilities

## 🛠️ **Tech Stack**

### **Frontend**
- **React 18+** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icon library

### **Backend & Services**
- **Firebase Auth** - Authentication and user management
- **Firebase Firestore** - NoSQL database for CV storage
- **Firebase Storage** - File storage for exports
- **Firebase Hosting** - Static site hosting

### **AI & APIs**
- **Google Gemini 2.0 Flash** - AI text generation and improvement
- **Gemini API** - Real-time AI assistance

### **Development Tools**
- **React Hook Form** - Form validation and management
- **React Hot Toast** - Toast notifications
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing

## 📦 **Installation & Setup**

### **Prerequisites**
- Node.js 16+ and npm
- Firebase account
- Google Cloud account (for Gemini API)

### **Quick Start**

1. **Clone the repository**
   ```bash
   git clone https://github.com/Fatihur/cv-generator.git
   cd cv-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id

   # Gemini AI Configuration
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable **Authentication** (Email/Password and Google)
   - Enable **Firestore Database** with security rules
   - Enable **Storage** for file uploads
   - Copy your Firebase config to the `.env` file

5. **Gemini AI Setup**
   - Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add the API key to your `.env` file

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 **Configuration**

### **Firebase Security Rules**

Set up Firestore security rules for proper data access:

```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // CVs are private to the user
    match /cvs/{cvId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }

    // Shared CVs are publicly readable
    match /sharedCVs/{shareId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### **Environment Variables**

All required environment variables:

```env
# Firebase Configuration (Required)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Gemini AI Configuration (Required for AI features)
VITE_GEMINI_API_KEY=your-gemini-api-key

# Optional: Analytics
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## 📱 **Usage Guide**

### **Getting Started**

1. **🔐 Authentication**
   - **Sign Up**: Create account with email/password
   - **Google Login**: Quick access with Google OAuth
   - **Guest Mode**: Try without registration (limited features)

2. **📝 Create Your First CV**
   - Click "Create CV" from dashboard
   - Fill in personal information
   - Add work experience with detailed descriptions
   - Include education and skills
   - Add achievements and certificates

3. **🤖 Use AI Assistant**
   - Click AI button in any text field
   - Get suggestions for professional descriptions
   - Improve existing content with AI
   - Generate skills based on your role

4. **💾 Save & Manage**
   - Save CVs to Firebase (authenticated) or localStorage (guest)
   - Edit existing CVs anytime
   - Delete CVs with confirmation
   - View all saved CVs in dashboard

5. **📤 Export & Share**
   - Export to PDF, DOCX, or PNG
   - Share with public links
   - Download for offline use

### **User Modes**

#### **🔓 Guest Mode**
- ✅ Create and edit CVs
- ✅ AI assistance
- ✅ Export functionality
- ❌ Cloud storage (localStorage only)
- ❌ Cross-device sync
- ❌ Advanced features

#### **🔐 Authenticated Mode**
- ✅ All guest features
- ✅ Cloud storage with Firebase
- ✅ Cross-device synchronization
- ✅ Profile management
- ✅ Email notifications
- ✅ Secure sharing

### **AI Features**

#### **🤖 Text Improvement**
- Enhance job descriptions
- Professional language suggestions
- ATS optimization
- Grammar and style improvements

#### **🎯 Smart Suggestions**
- Skill recommendations based on role
- Industry-specific keywords
- Achievement formatting
- Professional summary generation

## 🎨 **Design System**

### **Color Palette**
- **Primary**: Blue (#3B82F6) - Main brand color
- **Secondary**: Gray (#64748B) - Text and borders
- **Success**: Green (#10B981) - Success states
- **Warning**: Yellow (#F59E0B) - Warning states
- **Error**: Red (#EF4444) - Error states
- **Dark**: (#1F2937) - Dark mode background

### **Typography**
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Responsive**: Mobile-first approach with `lg:` breakpoints

### **Components**
- **Glassmorphism**: Backdrop blur effects with transparency
- **Rounded corners**: Consistent border radius (8px, 12px, 16px)
- **Shadows**: Layered shadow system for depth
- **Animations**: Smooth transitions (200ms duration)

## 📂 **Project Structure**

```
cv-generator/
├── public/
│   ├── favicon.svg              # Custom CV icon
│   ├── favicon-simple.svg       # Simple version
│   └── site.webmanifest        # PWA manifest
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── MainLayout.jsx   # Main app layout
│   │   │   ├── Header.jsx       # Desktop header
│   │   │   └── BottomNavigation.jsx # Mobile navigation
│   │   ├── AIModal.jsx          # AI assistant modal
│   │   ├── ExportModal.jsx      # Export functionality
│   │   ├── DeleteConfirmationModal.jsx
│   │   └── BackButton.jsx       # Reusable back button
│   ├── contexts/
│   │   ├── AuthContext.jsx      # Authentication state
│   │   └── ThemeContext.jsx     # Dark/light mode
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration
│   │   │   └── ForgotPassword.jsx
│   │   ├── Dashboard.jsx        # Main dashboard
│   │   ├── CreateCV.jsx         # CV builder
│   │   ├── SavedCVs.jsx         # CV management
│   │   ├── AITools.jsx          # AI features
│   │   ├── Profile.jsx          # User profile
│   │   ├── About.jsx            # About page
│   │   └── SharedCV.jsx         # Public CV view
│   ├── services/
│   │   ├── cvService.js         # CV CRUD operations
│   │   ├── shareService.js      # Sharing functionality
│   │   ├── exportService.js     # Export to PDF/DOCX
│   │   └── aiService.js         # Gemini AI integration
│   ├── hooks/
│   │   └── useDocumentTitle.js  # Dynamic page titles
│   ├── config/
│   │   └── firebase.js          # Firebase configuration
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles
├── .env                         # Environment variables
├── package.json                 # Dependencies
├── tailwind.config.js           # Tailwind configuration
├── vite.config.js               # Vite configuration
└── README.md                    # This file
```

## 🤝 **Contributing**

Contributions are welcome! Here's how you can help:

### **Development Process**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Contribution Guidelines**
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure mobile responsiveness
- Test on multiple browsers

### **Areas for Contribution**
- 🎨 New CV templates
- 🤖 AI feature improvements
- 🌐 Internationalization
- 📱 Mobile UX enhancements
- 🔧 Performance optimizations

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### **What this means:**
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❗ License and copyright notice required

## 🙏 **Acknowledgments**

### **Technologies**
- [React](https://reactjs.org/) - UI library
- [Firebase](https://firebase.google.com/) - Backend services
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library
- [Vite](https://vitejs.dev/) - Build tool
- [Google Gemini](https://ai.google.dev/) - AI assistance

### **Inspiration**
- Modern CV design trends
- Mobile-first development principles
- Accessibility best practices
- User experience research

## 📞 **Support & Contact**

### **Get Help**
- 📧 **Email**: fatihur17@gmail.com
- 💼 **LinkedIn**: [Fatihur Royyan](https://www.linkedin.com/in/fatihur-royyan-111a84190/)
- 🐙 **GitHub**: [Fatihur](https://github.com/Fatihur)
- 🌐 **Portfolio**: [fatih-porto.my.id](https://fatih-porto.my.id)

### **Report Issues**
- 🐛 **Bug Reports**: Use GitHub Issues
- 💡 **Feature Requests**: Use GitHub Discussions
- 🔒 **Security Issues**: Email directly

---

<div align="center">

**Made with ❤️ by [Fatih](https://github.com/Fatihur)**

⭐ **Star this repo if you found it helpful!** ⭐

</div>
