import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import notificationService from './notificationService';

class WelcomeService {
  // Check if user has received welcome email
  async hasReceivedWelcomeEmail(userId) {
    try {
      if (!userId) return false;
      
      const userDoc = await getDoc(doc(db, 'userProfiles', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.welcomeEmailSent || false;
      }
      return false;
    } catch (error) {
      console.error('Error checking welcome email status:', error);
      return false;
    }
  }

  // Mark welcome email as sent
  async markWelcomeEmailSent(userId) {
    try {
      if (!userId) return;
      
      const userDocRef = doc(db, 'userProfiles', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        // Update existing document
        await updateDoc(userDocRef, {
          welcomeEmailSent: true,
          welcomeEmailSentAt: new Date().toISOString()
        });
      } else {
        // Create new document
        await setDoc(userDocRef, {
          welcomeEmailSent: true,
          welcomeEmailSentAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        });
      }
      
      console.log('✅ Welcome email status marked as sent for user:', userId);
    } catch (error) {
      console.error('Error marking welcome email as sent:', error);
    }
  }

  // Send welcome email to new user
  async sendWelcomeEmail(user) {
    try {
      if (!user || !user.uid || !user.email) {
        console.log('❌ Cannot send welcome email: missing user data');
        return false;
      }

      // Check if welcome email already sent
      const alreadySent = await this.hasReceivedWelcomeEmail(user.uid);
      if (alreadySent) {
        console.log('ℹ️ Welcome email already sent to user:', user.email);
        return false;
      }

      console.log('📧 Sending welcome email to new user:', user.email);

      // Extract user name from email or displayName
      const userName = user.displayName || 
                      user.email.split('@')[0] || 
                      'there';

      // Send welcome email
      await notificationService.sendTemplateNotification(user.uid, 'welcome', {
        email: {
          to: user.email,
          userName: userName
        }
      });

      // Mark as sent
      await this.markWelcomeEmailSent(user.uid);

      console.log('✅ Welcome email sent successfully to:', user.email);
      return true;
    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      return false;
    }
  }

  // Check if this is user's first login
  async isFirstLogin(userId) {
    try {
      if (!userId) return false;
      
      const userDoc = await getDoc(doc(db, 'userProfiles', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return !userData.hasLoggedInBefore;
      }
      return true; // If no document exists, it's first login
    } catch (error) {
      console.error('Error checking first login status:', error);
      return false;
    }
  }

  // Mark user as having logged in before
  async markUserAsLoggedIn(userId) {
    try {
      if (!userId) return;
      
      const userDocRef = doc(db, 'userProfiles', userId);
      const userDoc = await getDoc(userDocRef);
      
      const updateData = {
        hasLoggedInBefore: true,
        lastLoginAt: new Date().toISOString()
      };

      if (userDoc.exists()) {
        await updateDoc(userDocRef, updateData);
      } else {
        await setDoc(userDocRef, {
          ...updateData,
          createdAt: new Date().toISOString()
        });
      }
      
      console.log('✅ User marked as logged in:', userId);
    } catch (error) {
      console.error('Error marking user as logged in:', error);
    }
  }

  // Handle new user login (check and send welcome email)
  async handleUserLogin(user) {
    try {
      if (!user || !user.uid) {
        console.log('❌ Cannot handle user login: missing user data');
        return;
      }

      console.log('🔍 Checking login status for user:', user.email);

      // Check if this is first login
      const isFirst = await this.isFirstLogin(user.uid);
      
      if (isFirst) {
        console.log('🎉 First login detected for user:', user.email);
        
        // Send welcome email
        await this.sendWelcomeEmail(user);
        
        // Mark as logged in
        await this.markUserAsLoggedIn(user.uid);
      } else {
        console.log('ℹ️ Returning user login:', user.email);
        
        // Just update last login time
        await this.markUserAsLoggedIn(user.uid);
      }
    } catch (error) {
      console.error('❌ Error handling user login:', error);
    }
  }

  // Get user welcome status (for debugging)
  async getUserWelcomeStatus(userId) {
    try {
      if (!userId) return null;
      
      const userDoc = await getDoc(doc(db, 'userProfiles', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          hasLoggedInBefore: userData.hasLoggedInBefore || false,
          welcomeEmailSent: userData.welcomeEmailSent || false,
          welcomeEmailSentAt: userData.welcomeEmailSentAt || null,
          lastLoginAt: userData.lastLoginAt || null,
          createdAt: userData.createdAt || null
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user welcome status:', error);
      return null;
    }
  }
}

export default new WelcomeService();
