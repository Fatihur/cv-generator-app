# CV Generator App

A modern, AI-powered CV generator built with React, Firebase, and Tailwind CSS. Create professional CVs with AI assistance, multiple templates, and ATS optimization.

## 🚀 Features

### ✅ Completed Features

- **Authentication System**
  - Email/Password registration and login
  - Google OAuth integration
  - Password reset functionality
  - Guest mode for trying the app without registration

- **Modern UI/UX**
  - Mobile-first responsive design
  - Dark/Light mode toggle
  - Clean, professional interface
  - Bottom navigation for mobile
  - Toast notifications

- **CV Management**
  - Create new CVs with structured forms
  - Save CVs (locally for guest mode, Firebase for authenticated users)
  - View and manage saved CVs
  - Delete and duplicate CVs

- **AI Assistant**
  - Text improvement for professional descriptions
  - Skill recommendations based on job roles
  - ATS optimization suggestions
  - Mock AI responses (ready for OpenAI/Gemini integration)

- **Profile Management**
  - User profile settings
  - Notification preferences
  - Security settings
  - Theme preferences

### 🚧 Planned Features

- **Export & Share**
  - PDF export with multiple templates
  - DOCX and PNG export options
  - Public CV sharing links
  - Email sharing

- **Advanced AI Features**
  - Real OpenAI/Gemini API integration
  - Cover letter generation
  - Interview question preparation
  - LinkedIn profile optimization

- **Premium Features**
  - Advanced CV templates
  - Enhanced AI capabilities
  - Analytics and insights
  - Priority support

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **AI**: OpenAI API (planned)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cv-generator-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database
   - Enable Storage
   - Copy your Firebase config to `src/config/firebase.js`

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Firebase Setup

Update the Firebase configuration in `src/config/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

### AI Integration (Optional)

To enable real AI features, add your OpenAI API key:

1. Create a `.env` file in the root directory
2. Add your API key:
   ```
   VITE_OPENAI_API_KEY=your-openai-api-key
   ```

## 📱 Usage

### Getting Started

1. **Sign Up/Login**: Create an account or use guest mode
2. **Create CV**: Use the structured form to build your CV
3. **AI Assistance**: Get help with descriptions and optimization
4. **Save & Manage**: Save your CVs and manage them from the dashboard
5. **Export**: Download your CV in various formats (coming soon)

### Guest Mode

- Try the app without registration
- CVs are saved locally in browser storage
- Limited features compared to authenticated users
- Data will be lost if browser data is cleared

### AI Features

- **Text Improvement**: Enhance job descriptions and achievements
- **Skill Recommendations**: Get relevant skills for your role
- **ATS Optimization**: Optimize content for applicant tracking systems

## 🎨 Design System

### Colors

- **Primary**: Blue (#3b82f6)
- **Secondary**: Gray (#64748b)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography

- **Font Family**: Inter
- **Weights**: 300, 400, 500, 600, 700

## 📂 Project Structure

```
src/
├── components/
│   └── Layout/
│       ├── MainLayout.jsx
│       ├── Header.jsx
│       └── BottomNavigation.jsx
├── contexts/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ForgotPassword.jsx
│   ├── Dashboard.jsx
│   ├── CreateCV.jsx
│   ├── SavedCVs.jsx
│   ├── AITools.jsx
│   └── Profile.jsx
├── config/
│   └── firebase.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Firebase](https://firebase.google.com/) - Backend services
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library
- [Vite](https://vitejs.dev/) - Build tool
