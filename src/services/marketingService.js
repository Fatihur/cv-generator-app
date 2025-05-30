import emailService from './emailService';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

class MarketingService {
  // Marketing email templates
  getMarketingTemplates() {
    return {
      'cv-tips-weekly': {
        subject: '📝 Weekly CV Tips: Stand Out from the Crowd',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">CV Generator Pro</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0;">Weekly CV Tips & Insights</p>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
              <h2 style="color: #333;">This Week's CV Tips 💡</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #667eea; margin-top: 0;">Tip #1: Use Action Verbs</h3>
                <p style="color: #666; line-height: 1.6;">
                  Start your bullet points with strong action verbs like "Achieved," "Implemented," "Led," or "Optimized" to make your accomplishments more impactful.
                </p>
              </div>

              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #667eea; margin-top: 0;">Tip #2: Quantify Your Results</h3>
                <p style="color: #666; line-height: 1.6;">
                  Include numbers and percentages to demonstrate your impact. For example: "Increased sales by 25%" or "Managed a team of 10 people."
                </p>
              </div>

              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #667eea; margin-top: 0;">Tip #3: Tailor for Each Job</h3>
                <p style="color: #666; line-height: 1.6;">
                  Customize your CV for each application by highlighting relevant skills and experiences that match the job requirements.
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Update Your CV Now
                </a>
              </div>

              <div style="background: #e0e7ff; border: 1px solid #c7d2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #3730a3; margin-top: 0;">🎯 Pro Tip of the Week</h3>
                <p style="color: #3730a3; margin: 0;">
                  Use our AI-powered content suggestions to improve your CV descriptions and make them more compelling to employers.
                </p>
              </div>
            </div>
            <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
              <p>© 2024 CV Generator Pro. Made with ❤️ by Fatih</p>
              <p style="margin: 5px 0;">
                <a href="#" style="color: #ccc; text-decoration: none;">Unsubscribe</a> | 
                <a href="#" style="color: #ccc; text-decoration: none;">Update Preferences</a>
              </p>
            </div>
          </div>
        `
      },
      'feature-update': {
        subject: '🚀 New Features: AI-Powered CV Improvements',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">CV Generator Pro</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0;">New Features Update</p>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
              <h2 style="color: #333;">Exciting New Features! 🎉</h2>
              <p style="color: #666; line-height: 1.6;">
                We've been working hard to improve your CV creation experience. Here's what's new:
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <h3 style="color: #10b981; margin-top: 0;">✨ AI Content Suggestions</h3>
                <p style="color: #666; line-height: 1.6;">
                  Get intelligent suggestions for improving your CV content based on your industry and role.
                </p>
              </div>

              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
                <h3 style="color: #3b82f6; margin-top: 0;">📊 CV Analytics</h3>
                <p style="color: #666; line-height: 1.6;">
                  Track how many times your shared CV has been viewed and downloaded.
                </p>
              </div>

              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h3 style="color: #f59e0b; margin-top: 0;">🎨 New Templates</h3>
                <p style="color: #666; line-height: 1.6;">
                  Choose from 5 new professional CV templates designed by industry experts.
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Try New Features
                </a>
              </div>
            </div>
            <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
              <p>© 2024 CV Generator Pro. Made with ❤️ by Fatih</p>
              <p style="margin: 5px 0;">
                <a href="#" style="color: #ccc; text-decoration: none;">Unsubscribe</a> | 
                <a href="#" style="color: #ccc; text-decoration: none;">Update Preferences</a>
              </p>
            </div>
          </div>
        `
      },
      'job-search-tips': {
        subject: '💼 Job Search Success: Expert Tips Inside',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">CV Generator Pro</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0;">Job Search Success Guide</p>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
              <h2 style="color: #333;">Land Your Dream Job 🎯</h2>
              <p style="color: #666; line-height: 1.6;">
                Beyond having a great CV, here are expert tips to accelerate your job search:
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #667eea; margin-top: 0;">🔍 Where to Look</h3>
                <ul style="color: #666; line-height: 1.6;">
                  <li>LinkedIn job postings and networking</li>
                  <li>Company career pages directly</li>
                  <li>Industry-specific job boards</li>
                  <li>Professional associations and events</li>
                </ul>
              </div>

              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #667eea; margin-top: 0;">📝 Application Strategy</h3>
                <ul style="color: #666; line-height: 1.6;">
                  <li>Customize your CV for each application</li>
                  <li>Write compelling cover letters</li>
                  <li>Follow up professionally</li>
                  <li>Prepare for common interview questions</li>
                </ul>
              </div>

              <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #92400e; margin-top: 0;">💡 Success Metric</h3>
                <p style="color: #92400e; margin: 0;">
                  Aim to apply to 10-15 relevant positions per week for optimal results. Quality over quantity!
                </p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Optimize Your CV
                </a>
              </div>
            </div>
            <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
              <p>© 2024 CV Generator Pro. Made with ❤️ by Fatih</p>
              <p style="margin: 5px 0;">
                <a href="#" style="color: #ccc; text-decoration: none;">Unsubscribe</a> | 
                <a href="#" style="color: #ccc; text-decoration: none;">Update Preferences</a>
              </p>
            </div>
          </div>
        `
      }
    };
  }

  // Send marketing email
  async sendMarketingEmail(userId, templateName, userEmail) {
    try {
      const templates = this.getMarketingTemplates();
      const template = templates[templateName];
      
      if (!template) {
        throw new Error(`Marketing template '${templateName}' not found`);
      }

      // Check if user has opted in for marketing emails
      const preferences = await this.getUserMarketingPreferences(userId);
      if (!preferences.marketingEmails) {
        console.log('User has opted out of marketing emails');
        return { success: false, reason: 'User opted out' };
      }

      // Send email
      const result = await emailService.sendEmail({
        to: userEmail,
        subject: template.subject,
        html: template.html,
        template: templateName,
        from: {
          email: 'marketing@cvgenerator.com',
          name: 'CV Generator Pro Team'
        }
      });

      // Log marketing email
      await this.logMarketingEmail(userId, templateName, userEmail, result);

      return result;
    } catch (error) {
      console.error('Error sending marketing email:', error);
      throw error;
    }
  }

  // Get user marketing preferences
  async getUserMarketingPreferences(userId) {
    try {
      const prefsRef = doc(db, 'userPreferences', userId);
      const docSnap = await getDoc(prefsRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          marketingEmails: data.marketingEmails ?? false,
          emailFrequency: data.emailFrequency ?? 'weekly',
          interests: data.interests ?? []
        };
      }
      
      return {
        marketingEmails: false,
        emailFrequency: 'weekly',
        interests: []
      };
    } catch (error) {
      console.error('Error getting marketing preferences:', error);
      return {
        marketingEmails: false,
        emailFrequency: 'weekly',
        interests: []
      };
    }
  }

  // Log marketing email
  async logMarketingEmail(userId, templateName, email, result) {
    try {
      const logRef = doc(collection(db, 'marketingLogs'));
      await setDoc(logRef, {
        userId,
        templateName,
        email,
        messageId: result.messageId,
        status: result.status,
        sentAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error logging marketing email:', error);
    }
  }

  // Send weekly tips email
  async sendWeeklyTips() {
    try {
      // Get all users who opted in for marketing emails
      const usersRef = collection(db, 'userPreferences');
      const q = query(usersRef, where('marketingEmails', '==', true));
      const querySnapshot = await getDocs(q);
      
      const results = [];
      
      for (const doc of querySnapshot.docs) {
        const userId = doc.id;
        const userData = doc.data();
        
        try {
          // Get user email from auth or profile
          const userProfileRef = doc(db, 'userProfiles', userId);
          const userProfile = await getDoc(userProfileRef);
          const userEmail = userProfile.data()?.email;
          
          if (userEmail) {
            const result = await this.sendMarketingEmail(userId, 'cv-tips-weekly', userEmail);
            results.push({ userId, email: userEmail, success: true, result });
          }
        } catch (error) {
          results.push({ userId, success: false, error: error.message });
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      return results;
    } catch (error) {
      console.error('Error sending weekly tips:', error);
      throw error;
    }
  }

  // Test marketing email
  async testMarketingEmail(userEmail, templateName = 'cv-tips-weekly') {
    try {
      const templates = this.getMarketingTemplates();
      const template = templates[templateName];
      
      if (!template) {
        throw new Error(`Marketing template '${templateName}' not found`);
      }

      // Send test email
      const result = await emailService.sendEmail({
        to: userEmail,
        subject: `[TEST] ${template.subject}`,
        html: template.html,
        template: templateName,
        from: {
          email: 'test@cvgenerator.com',
          name: 'CV Generator Pro (Test)'
        }
      });

      return result;
    } catch (error) {
      console.error('Error sending test marketing email:', error);
      throw error;
    }
  }
}

export default new MarketingService();
