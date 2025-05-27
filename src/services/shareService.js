import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

class ShareService {
  constructor() {
    this.collectionName = 'shared_cvs';
  }

  // Generate consistent short ID based on CV content
  generateConsistentId(cvData) {
    try {
      // Create a stable hash from key CV content
      const keyContent = {
        name: cvData.personal?.fullName || '',
        email: cvData.personal?.email || '',
        phone: cvData.personal?.phone || '',
        expCount: (cvData.experience || []).length,
        eduCount: (cvData.education || []).length,
        skillCount: (cvData.skills || []).length,
        template: cvData.template || 'modern'
      };

      const contentString = JSON.stringify(keyContent);
      console.log('Content for hash:', contentString);

      // Simple but consistent hash function
      let hash = 0;
      for (let i = 0; i < contentString.length; i++) {
        const char = contentString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }

      // Convert to base62 for shorter ID
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      let num = Math.abs(hash);

      // Ensure we always get 8 characters
      for (let i = 0; i < 8; i++) {
        result = chars[num % chars.length] + result;
        num = Math.floor(num / chars.length);
        if (num === 0) num = hash; // Reset if we run out
      }

      console.log('Generated consistent ID:', result);
      return result;
    } catch (error) {
      console.error('Error generating consistent ID:', error);
      // Fallback to timestamp-based ID
      const fallback = Date.now().toString(36).slice(-8).padStart(8, '0');
      console.log('Using fallback ID:', fallback);
      return fallback;
    }
  }

  // Generate random short ID (fallback)
  generateRandomId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Create shareable link with Firebase + localStorage fallback
  async createShare(cvData) {
    try {
      console.log('Creating share for CV:', cvData);

      // Generate consistent ID
      let shareId = this.generateConsistentId(cvData);
      console.log('Generated share ID:', shareId);

      // Try Firebase first
      try {
        // Check if this ID already exists in Firebase
        const existingDoc = await this.getShare(shareId);
        if (existingDoc) {
          console.log('Share already exists in Firebase with ID:', shareId);
          // Update the existing share with new data
          await this.updateShare(shareId, cvData);
          return this.generateShareUrl(shareId);
        }

        // Create new share document in Firebase
        const shareData = {
          cvData,
          shareId,
          createdAt: serverTimestamp(),
          expiresAt: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 days
          lastAccessed: serverTimestamp(),
          accessCount: 0,
          isActive: true
        };

        // Store in Firebase
        const docRef = doc(db, this.collectionName, shareId);
        await setDoc(docRef, shareData);

        console.log('Share created successfully in Firebase with ID:', shareId);
        return this.generateShareUrl(shareId);

      } catch (firebaseError) {
        console.warn('Firebase failed, falling back to localStorage:', firebaseError);

        // Fallback to localStorage
        const shareData = {
          cvData,
          shareId,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          lastAccessed: new Date().toISOString(),
          accessCount: 0,
          isActive: true,
          source: 'localStorage' // Mark as localStorage source
        };

        localStorage.setItem(`shared_cv_${shareId}`, JSON.stringify(shareData));
        console.log('Share created in localStorage with ID:', shareId);
        return this.generateShareUrl(shareId);
      }

    } catch (error) {
      console.error('Error creating share:', error);
      throw new Error('Failed to create shareable link. Please try again.');
    }
  }

  // Get shared CV by ID with Firebase + localStorage fallback
  async getShare(shareId) {
    try {
      console.log('Getting share with ID:', shareId);

      // Try Firebase first
      try {
        const docRef = doc(db, this.collectionName, shareId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const shareData = docSnap.data();
          console.log('Share found in Firebase:', shareData);

          // Check if expired
          const now = new Date();
          const expiresAt = shareData.expiresAt.toDate();

          if (now > expiresAt) {
            console.log('Firebase share has expired, removing...');
            await this.deleteShare(shareId);
            throw new Error('Shared CV has expired. Links are valid for 30 days.');
          }

          // Update access tracking
          await this.updateAccessTracking(shareId, shareData.accessCount || 0);

          return shareData;
        }

        console.log('Share not found in Firebase, checking localStorage...');
      } catch (firebaseError) {
        console.warn('Firebase failed, checking localStorage:', firebaseError);
      }

      // Fallback to localStorage
      const storageKey = `shared_cv_${shareId}`;
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        const shareData = JSON.parse(stored);
        console.log('Share found in localStorage:', shareData);

        // Check if expired
        const now = new Date();
        const expiresAt = new Date(shareData.expiresAt);

        if (now > expiresAt) {
          console.log('localStorage share has expired, removing...');
          localStorage.removeItem(storageKey);
          throw new Error('Shared CV has expired. Links are valid for 30 days.');
        }

        // Update last accessed time in localStorage
        shareData.lastAccessed = new Date().toISOString();
        shareData.accessCount = (shareData.accessCount || 0) + 1;
        localStorage.setItem(storageKey, JSON.stringify(shareData));

        return shareData;
      }

      console.log('Share not found in Firebase or localStorage');
      return null;

    } catch (error) {
      console.error('Error getting share:', error);
      if (error.message.includes('expired')) {
        throw error;
      }
      throw new Error('Failed to load shared CV. Please check the link and try again.');
    }
  }

  // Update existing share
  async updateShare(shareId, cvData) {
    try {
      const docRef = doc(db, this.collectionName, shareId);
      await setDoc(docRef, {
        cvData,
        lastAccessed: serverTimestamp(),
        expiresAt: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) // Extend expiry
      }, { merge: true });

      console.log('Share updated successfully:', shareId);
    } catch (error) {
      console.error('Error updating share:', error);
      throw new Error('Failed to update share');
    }
  }

  // Update access tracking
  async updateAccessTracking(shareId, currentCount) {
    try {
      const docRef = doc(db, this.collectionName, shareId);
      await setDoc(docRef, {
        lastAccessed: serverTimestamp(),
        accessCount: (currentCount || 0) + 1
      }, { merge: true });

      console.log('Access tracking updated for:', shareId);
    } catch (error) {
      console.error('Error updating access tracking:', error);
      // Don't throw error for tracking failures
    }
  }

  // Delete share
  async deleteShare(shareId) {
    try {
      const docRef = doc(db, this.collectionName, shareId);
      await deleteDoc(docRef);
      console.log('Share deleted:', shareId);
      return true;
    } catch (error) {
      console.error('Error deleting share:', error);
      throw new Error('Failed to delete share');
    }
  }

  // Get all shares with Firebase + localStorage fallback
  async getAllShares(limitCount = 50) {
    const allShares = [];

    // Try to get from Firebase first
    try {
      const q = query(
        collection(db, this.collectionName),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        allShares.push({
          id: doc.id,
          ...data,
          source: 'firebase',
          createdAt: data.createdAt?.toDate?.() || new Date(),
          expiresAt: data.expiresAt?.toDate?.() || new Date(),
          lastAccessed: data.lastAccessed?.toDate?.() || new Date()
        });
      });

      console.log(`Found ${allShares.length} shares in Firebase`);
    } catch (error) {
      console.warn('Error getting Firebase shares:', error);
    }

    // Also get from localStorage
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('shared_cv_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            allShares.push({
              id: key.replace('shared_cv_', ''),
              ...data,
              source: 'localStorage',
              createdAt: new Date(data.createdAt),
              expiresAt: new Date(data.expiresAt),
              lastAccessed: new Date(data.lastAccessed)
            });
          } catch (parseError) {
            console.error('Error parsing localStorage share:', parseError);
          }
        }
      }

      console.log(`Total shares found: ${allShares.length}`);
    } catch (error) {
      console.error('Error getting localStorage shares:', error);
    }

    // Sort by creation date (newest first)
    allShares.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return allShares.slice(0, limitCount);
  }

  // Cleanup expired shares
  async cleanupExpiredShares() {
    try {
      const now = Timestamp.now();
      const q = query(
        collection(db, this.collectionName),
        where('expiresAt', '<', now)
      );

      const querySnapshot = await getDocs(q);
      const deletePromises = [];

      querySnapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
        console.log('Cleaning up expired share:', doc.id);
      });

      await Promise.all(deletePromises);
      console.log(`Cleaned up ${deletePromises.length} expired shares`);

      return deletePromises.length;
    } catch (error) {
      console.error('Error during cleanup:', error);
      return 0;
    }
  }

  // Generate share URL
  generateShareUrl(shareId) {
    const baseUrl = window.location.origin;
    return `${baseUrl}/shared/${shareId}`;
  }

  // Copy to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  }
}

export default new ShareService();
