import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  updateProfile,
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from '../config/firebase';

class ProfileService {
  // Get user profile data
  async getUserProfile(userId) {
    try {
      const docRef = doc(db, 'userProfiles', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw new Error('Failed to get user profile');
    }
  }

  // Update user profile
  async updateUserProfile(userId, profileData) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const docRef = doc(db, 'userProfiles', userId);
      const updateData = {
        ...profileData,
        updatedAt: serverTimestamp()
      };

      await setDoc(docRef, updateData, { merge: true });
      return updateData;
    } catch (error) {
      console.error('Error updating user profile:', error);
      if (error.code === 'permission-denied') {
        throw new Error('You do not have permission to update this profile');
      }
      throw new Error(error.message || 'Failed to update user profile');
    }
  }

  // Upload profile picture
  async uploadProfilePicture(userId, file) {
    try {
      // Create a reference to the file location
      const fileRef = ref(storage, `profile-pictures/${userId}/${file.name}`);

      // Upload the file
      const snapshot = await uploadBytes(fileRef, file);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw new Error('Failed to upload profile picture');
    }
  }

  // Update Firebase Auth profile
  async updateAuthProfile(user, profileData) {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const updateData = {};
      if (profileData.displayName) {
        updateData.displayName = profileData.displayName;
      }
      if (profileData.photoURL) {
        updateData.photoURL = profileData.photoURL;
      }

      await updateProfile(user, updateData);
    } catch (error) {
      console.error('Error updating auth profile:', error);
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('Please log in again to update your profile');
      }
      throw new Error(error.message || 'Failed to update authentication profile');
    }
  }

  // Get user preferences
  async getUserPreferences(userId) {
    try {
      if (!userId) {
        // Return default preferences for guest users
        return {
          emailNotifications: true,
          darkMode: false
        };
      }

      const docRef = doc(db, 'userPreferences', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // Return default preferences
        return {
          emailNotifications: true,
          darkMode: false
        };
      }
    } catch (error) {
      console.error('Error getting user preferences:', error);
      // Return default preferences on error
      return {
        emailNotifications: true,
        darkMode: false
      };
    }
  }

  // Update user preferences
  async updateUserPreferences(userId, preferences) {
    try {
      const docRef = doc(db, 'userPreferences', userId);
      const updateData = {
        ...preferences,
        updatedAt: serverTimestamp()
      };

      await setDoc(docRef, updateData, { merge: true });
      return updateData;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw new Error('Failed to update user preferences');
    }
  }

  // Change password
  async changePassword(user, currentPassword, newPassword) {
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      // Log password change
      await this.logSecurityEvent(user.uid, 'password_changed');

      // Send notification (import notificationService to avoid circular dependency)
      try {
        const { default: notificationService } = await import('./notificationService');
        await notificationService.sendTemplateNotification(user.uid, 'passwordChanged', {
          email: {
            to: user.email
          }
        });
      } catch (notifError) {
        console.error('Failed to send password change notification:', notifError);
      }

    } catch (error) {
      console.error('Error changing password:', error);
      if (error.code === 'auth/wrong-password') {
        throw new Error('Current password is incorrect');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('New password is too weak');
      } else {
        throw new Error('Failed to change password');
      }
    }
  }

  // Get user sessions (mock implementation)
  async getUserSessions(userId) {
    try {
      const sessionsRef = collection(db, 'userSessions');
      const q = query(sessionsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      const sessions = [];
      querySnapshot.forEach((doc) => {
        sessions.push({ id: doc.id, ...doc.data() });
      });

      return sessions;
    } catch (error) {
      console.error('Error getting user sessions:', error);
      throw new Error('Failed to get user sessions');
    }
  }

  // Log security event
  async logSecurityEvent(userId, eventType, details = {}) {
    try {
      const eventRef = doc(collection(db, 'securityEvents'));
      await setDoc(eventRef, {
        userId,
        eventType,
        details,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        ipAddress: 'unknown' // In a real app, you'd get this from your backend
      });
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  }

  // Revoke session
  async revokeSession(sessionId) {
    try {
      const sessionRef = doc(db, 'userSessions', sessionId);
      await deleteDoc(sessionRef);
    } catch (error) {
      console.error('Error revoking session:', error);
      throw new Error('Failed to revoke session');
    }
  }

  // Enable 2FA (mock implementation)
  async enable2FA(userId) {
    try {
      const docRef = doc(db, 'userSecurity', userId);
      await setDoc(docRef, {
        twoFactorEnabled: true,
        twoFactorMethod: 'app',
        enabledAt: serverTimestamp()
      }, { merge: true });

      await this.logSecurityEvent(userId, '2fa_enabled');

      // In a real implementation, you'd generate QR code and backup codes
      return {
        qrCode: 'data:image/png;base64,mock-qr-code',
        backupCodes: ['123456', '789012', '345678', '901234', '567890']
      };
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      throw new Error('Failed to enable 2FA');
    }
  }

  // Disable 2FA
  async disable2FA(userId) {
    try {
      const docRef = doc(db, 'userSecurity', userId);
      await setDoc(docRef, {
        twoFactorEnabled: false,
        twoFactorMethod: null,
        disabledAt: serverTimestamp()
      }, { merge: true });

      await this.logSecurityEvent(userId, '2fa_disabled');
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      throw new Error('Failed to disable 2FA');
    }
  }

  // Get 2FA status
  async get2FAStatus(userId) {
    try {
      const docRef = doc(db, 'userSecurity', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return { twoFactorEnabled: false };
      }
    } catch (error) {
      console.error('Error getting 2FA status:', error);
      return { twoFactorEnabled: false };
    }
  }
}

export default new ProfileService();
