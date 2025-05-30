import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import emailService from './emailService';

class NotificationService {
  // Request notification permission
  async requestPermission() {
    try {
      if (!('Notification' in window)) {
        throw new Error('This browser does not support notifications');
      }

      if (Notification.permission === 'granted') {
        return true;
      }

      if (Notification.permission === 'denied') {
        throw new Error('Notifications are blocked. Please enable them in your browser settings.');
      }

      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      throw error;
    }
  }

  // Show browser notification
  showNotification(title, options = {}) {
    try {
      if (Notification.permission !== 'granted') {
        console.warn('Notification permission not granted');
        return;
      }

      const defaultOptions = {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'cv-generator',
        requireInteraction: false,
        ...options
      };

      const notification = new Notification(title, defaultOptions);

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  // Save notification to database
  async saveNotification(userId, notificationData) {
    try {
      const notificationsRef = collection(db, 'notifications');
      const notification = {
        userId,
        ...notificationData,
        read: false,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(notificationsRef, notification);
      return { id: docRef.id, ...notification };
    } catch (error) {
      console.error('Error saving notification:', error);
      throw new Error('Failed to save notification');
    }
  }

  // Get user notifications
  async getUserNotifications(userId, limitCount = 10) {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const notifications = [];

      querySnapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() });
      });

      return notifications;
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw new Error('Failed to get notifications');
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await setDoc(notificationRef, { read: true }, { merge: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  // Send email notification
  async sendEmailNotification(userId, emailData) {
    try {
      // Validate email address
      if (!emailService.validateEmail(emailData.to)) {
        throw new Error('Invalid email address');
      }

      // Send email using email service
      const result = await emailService.sendTemplateEmail(
        emailData.to,
        emailData.template || 'test-email',
        {
          userEmail: emailData.to,
          subject: emailData.subject,
          message: emailData.message,
          ...emailData.variables
        }
      );

      // Save to database for tracking
      await this.saveNotification(userId, {
        type: 'email',
        title: emailData.subject,
        message: emailData.message,
        metadata: {
          to: emailData.to,
          template: emailData.template,
          messageId: result.messageId,
          status: result.status
        }
      });

      return result;
    } catch (error) {
      console.error('Error sending email notification:', error);
      throw new Error('Failed to send email notification: ' + error.message);
    }
  }

  // Send push notification
  async sendPushNotification(userId, pushData) {
    try {
      // Show browser notification
      this.showNotification(pushData.title, {
        body: pushData.message,
        icon: pushData.icon,
        data: pushData.data
      });

      // Save to database
      await this.saveNotification(userId, {
        type: 'push',
        title: pushData.title,
        message: pushData.message,
        metadata: pushData.data
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw new Error('Failed to send push notification');
    }
  }

  // Get notification preferences
  async getNotificationPreferences(userId) {
    try {
      const prefsRef = doc(db, 'userPreferences', userId);
      const docSnap = await getDoc(prefsRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          emailNotifications: data.emailNotifications ?? true
        };
      }

      return {
        emailNotifications: true
      };
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return {
        emailNotifications: true
      };
    }
  }

  // Send notification based on user preferences
  async sendNotification(userId, notificationData) {
    try {
      const preferences = await this.getNotificationPreferences(userId);
      const results = [];

      // Send email if enabled
      if (preferences.emailNotifications && notificationData.email) {
        try {
          const emailResult = await this.sendEmailNotification(userId, notificationData.email);
          results.push({ type: 'email', success: true, result: emailResult });
        } catch (error) {
          results.push({ type: 'email', success: false, error: error.message });
        }
      }



      return results;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error('Failed to send notification');
    }
  }

  // Notification templates
  getNotificationTemplates() {
    return {
      profileUpdated: {
        email: {
          subject: 'Profile Updated Successfully',
          message: 'Your profile has been updated successfully.',
          template: 'profile-updated'
        }
      },
      passwordChanged: {
        email: {
          subject: 'Password Changed',
          message: 'Your password has been changed successfully. If this wasn\'t you, please contact support.',
          template: 'password-changed'
        }
      },
      cvCreated: {
        email: {
          subject: 'CV Created Successfully',
          message: 'Your new CV has been created and saved.',
          template: 'cv-created'
        }
      },
      cvShared: {
        email: {
          subject: 'CV Shared Successfully',
          message: 'Your CV has been shared successfully.',
          template: 'cv-shared'
        }
      }
    };
  }

  // Send template notification
  async sendTemplateNotification(userId, templateName, customData = {}) {
    try {
      const templates = this.getNotificationTemplates();
      const template = templates[templateName];

      if (!template) {
        throw new Error(`Notification template '${templateName}' not found`);
      }

      const notificationData = {
        email: {
          ...template.email,
          ...customData.email
        }
      };

      return await this.sendNotification(userId, notificationData);
    } catch (error) {
      console.error('Error sending template notification:', error);
      throw error;
    }
  }
}

export default new NotificationService();
