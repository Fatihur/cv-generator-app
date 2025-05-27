import { v4 as uuidv4 } from 'uuid';
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
  serverTimestamp,
  updateDoc,
  addDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

class CVService {
  constructor() {
    this.collectionName = 'cvs';
    this.guestCollectionName = 'guest_cvs';
  }

  // Generate a unique ID for CVs
  generateId() {
    return uuidv4();
  }

  // Save CV for authenticated users (Firebase)
  async saveCV(cvData, userId) {
    try {
      console.log('Saving CV to Firebase for user:', userId);

      const cvId = this.generateId();
      const cvWithMetadata = {
        ...cvData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        id: cvId
      };

      // Save to Firebase
      const docRef = doc(db, this.collectionName, cvId);
      await setDoc(docRef, cvWithMetadata);

      console.log('CV saved to Firebase successfully:', cvId);
      return { ...cvWithMetadata, id: cvId };

    } catch (error) {
      console.error('Error saving CV to Firebase:', error);

      // Fallback to localStorage
      console.log('Falling back to localStorage...');
      try {
        const cvWithMetadata = {
          ...cvData,
          userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          id: this.generateId(),
          source: 'localStorage'
        };

        const userCVs = this.getUserCVsFromStorage(userId);
        userCVs.push(cvWithMetadata);
        localStorage.setItem(`userCVs_${userId}`, JSON.stringify(userCVs));

        console.log('CV saved to localStorage successfully');
        return cvWithMetadata;
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
        throw new Error('Failed to save CV. Please try again.');
      }
    }
  }

  // Update existing CV
  async updateCV(cvId, cvData, userId) {
    try {
      console.log('Updating CV in Firebase:', cvId);

      const updatedData = {
        ...cvData,
        updatedAt: serverTimestamp()
      };

      // Try Firebase first
      try {
        const cvRef = doc(db, this.collectionName, cvId);
        await updateDoc(cvRef, updatedData);

        console.log('CV updated in Firebase successfully');
        return { ...updatedData, id: cvId };
      } catch (firebaseError) {
        console.warn('Firebase update failed, trying localStorage:', firebaseError);

        // Fallback to localStorage
        const userCVs = this.getUserCVsFromStorage(userId);
        const cvIndex = userCVs.findIndex(cv => cv.id === cvId);

        if (cvIndex === -1) {
          throw new Error('CV not found');
        }

        userCVs[cvIndex] = {
          ...userCVs[cvIndex],
          ...cvData,
          updatedAt: new Date().toISOString()
        };

        localStorage.setItem(`userCVs_${userId}`, JSON.stringify(userCVs));
        console.log('CV updated in localStorage successfully');

        return userCVs[cvIndex];
      }
    } catch (error) {
      console.error('Error updating CV:', error);
      throw new Error('Failed to update CV. Please try again.');
    }
  }

  // Get all CVs for a user
  async getUserCVs(userId) {
    try {
      console.log('Getting CVs from Firebase for user:', userId);

      // Try Firebase first
      try {
        const q = query(
          collection(db, this.collectionName),
          where('userId', '==', userId)
        );

        const querySnapshot = await getDocs(q);
        const cvs = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          cvs.push({
            ...data,
            id: doc.id,
            source: 'firebase',
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date()
          });
        });

        console.log(`Found ${cvs.length} CVs in Firebase`);
        // Sort by updatedAt in memory
        cvs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        return cvs;

      } catch (firebaseError) {
        console.warn('Firebase query failed, trying localStorage:', firebaseError);

        // Fallback to localStorage
        const userCVs = this.getUserCVsFromStorage(userId);
        const processedCVs = userCVs.map(cv => ({
          ...cv,
          source: 'localStorage',
          createdAt: new Date(cv.createdAt),
          updatedAt: new Date(cv.updatedAt)
        }));

        console.log(`Found ${processedCVs.length} CVs in localStorage`);
        return processedCVs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      }
    } catch (error) {
      console.error('Error fetching CVs:', error);
      throw new Error('Failed to load CVs. Please try again.');
    }
  }

  // Helper method to get user CVs from localStorage
  getUserCVsFromStorage(userId) {
    try {
      const stored = localStorage.getItem(`userCVs_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading user CVs from storage:', error);
      return [];
    }
  }

  // Delete CV for authenticated users
  async deleteCV(cvId, userId) {
    try {
      console.log('Deleting CV from Firebase:', cvId);

      // Try Firebase first
      try {
        await deleteDoc(doc(db, this.collectionName, cvId));
        console.log('CV deleted from Firebase successfully');
        return true;
      } catch (firebaseError) {
        console.warn('Firebase delete failed, trying localStorage:', firebaseError);

        // Fallback to localStorage
        const userCVs = this.getUserCVsFromStorage(userId);
        const filteredCVs = userCVs.filter(cv => cv.id !== cvId);
        localStorage.setItem(`userCVs_${userId}`, JSON.stringify(filteredCVs));
        console.log('CV deleted from localStorage successfully');
        return true;
      }
    } catch (error) {
      console.error('Error deleting CV:', error);
      throw new Error('Failed to delete CV. Please try again.');
    }
  }

  // Save CV for guest users (Firebase + localStorage)
  async saveGuestCV(cvData) {
    try {
      console.log('Saving guest CV to Firebase');

      const cvId = this.generateId();
      const cvWithMetadata = {
        ...cvData,
        id: cvId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isGuest: true,
        guestId: this.getGuestId()
      };

      // Try Firebase first
      try {
        const docRef = doc(db, this.guestCollectionName, cvId);
        await setDoc(docRef, cvWithMetadata);

        console.log('Guest CV saved to Firebase successfully');
        return { ...cvWithMetadata, id: cvId, source: 'firebase' };
      } catch (firebaseError) {
        console.warn('Firebase save failed, using localStorage:', firebaseError);

        // Fallback to localStorage
        const guestCVs = this.getGuestCVs();
        const localCvData = {
          ...cvData,
          id: cvId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isGuest: true,
          source: 'localStorage'
        };

        guestCVs.push(localCvData);
        localStorage.setItem('guestCVs', JSON.stringify(guestCVs));

        console.log('Guest CV saved to localStorage successfully');
        return localCvData;
      }
    } catch (error) {
      console.error('Error saving guest CV:', error);
      throw new Error('Failed to save CV. Please try again.');
    }
  }

  // Update guest CV
  async updateGuestCV(cvId, cvData) {
    try {
      console.log('Updating guest CV:', cvId);

      // Try Firebase first
      try {
        const updatedData = {
          ...cvData,
          updatedAt: serverTimestamp()
        };

        const cvRef = doc(db, this.guestCollectionName, cvId);
        await updateDoc(cvRef, updatedData);

        console.log('Guest CV updated in Firebase successfully');
        return { ...updatedData, id: cvId };
      } catch (firebaseError) {
        console.warn('Firebase update failed, trying localStorage:', firebaseError);

        // Fallback to localStorage
        const guestCVs = this.getGuestCVs();
        const cvIndex = guestCVs.findIndex(cv => cv.id === cvId);

        if (cvIndex === -1) {
          throw new Error('CV not found');
        }

        guestCVs[cvIndex] = {
          ...guestCVs[cvIndex],
          ...cvData,
          updatedAt: new Date().toISOString()
        };

        localStorage.setItem('guestCVs', JSON.stringify(guestCVs));
        console.log('Guest CV updated in localStorage successfully');
        return guestCVs[cvIndex];
      }
    } catch (error) {
      console.error('Error updating guest CV:', error);
      throw new Error('Failed to update CV. Please try again.');
    }
  }

  // Get all guest CVs
  async getGuestCVs() {
    try {
      console.log('Getting guest CVs from Firebase');

      // Try Firebase first
      try {
        const guestId = this.getGuestId();
        const q = query(
          collection(db, this.guestCollectionName),
          where('guestId', '==', guestId)
        );

        const querySnapshot = await getDocs(q);
        const cvs = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          cvs.push({
            ...data,
            id: doc.id,
            source: 'firebase',
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date()
          });
        });

        console.log(`Found ${cvs.length} guest CVs in Firebase`);
        // Sort by updatedAt in memory
        cvs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        return cvs;

      } catch (firebaseError) {
        console.warn('Firebase query failed, trying localStorage:', firebaseError);

        // Fallback to localStorage
        const stored = localStorage.getItem('guestCVs');
        const localCVs = stored ? JSON.parse(stored) : [];
        const processedCVs = localCVs.map(cv => ({
          ...cv,
          source: 'localStorage',
          createdAt: new Date(cv.createdAt),
          updatedAt: new Date(cv.updatedAt)
        }));

        console.log(`Found ${processedCVs.length} guest CVs in localStorage`);
        return processedCVs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      }
    } catch (error) {
      console.error('Error loading guest CVs:', error);
      return [];
    }
  }

  // Delete guest CV
  async deleteGuestCV(cvId) {
    try {
      console.log('Deleting guest CV:', cvId);

      // Try Firebase first
      try {
        await deleteDoc(doc(db, this.guestCollectionName, cvId));
        console.log('Guest CV deleted from Firebase successfully');
        return true;
      } catch (firebaseError) {
        console.warn('Firebase delete failed, trying localStorage:', firebaseError);

        // Fallback to localStorage
        const stored = localStorage.getItem('guestCVs');
        const guestCVs = stored ? JSON.parse(stored) : [];
        const filteredCVs = guestCVs.filter(cv => cv.id !== cvId);
        localStorage.setItem('guestCVs', JSON.stringify(filteredCVs));
        console.log('Guest CV deleted from localStorage successfully');
        return true;
      }
    } catch (error) {
      console.error('Error deleting guest CV:', error);
      throw new Error('Failed to delete CV. Please try again.');
    }
  }

  // Get or create guest ID
  getGuestId() {
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
      guestId = 'guest_' + this.generateId();
      localStorage.setItem('guestId', guestId);
    }
    return guestId;
  }

  // Duplicate CV
  async duplicateCV(originalCV, userId, isGuest = false) {
    try {
      const duplicatedData = {
        ...originalCV,
        cvName: `${originalCV.cvName || originalCV.personal?.fullName || 'Untitled'} (Copy)`,
        personal: {
          ...originalCV.personal,
          fullName: `${originalCV.personal?.fullName || 'Untitled'} (Copy)`
        }
      };

      // Remove metadata fields
      delete duplicatedData.id;
      delete duplicatedData.firebaseId;
      delete duplicatedData.createdAt;
      delete duplicatedData.updatedAt;
      delete duplicatedData.userId;
      delete duplicatedData.isGuest;

      if (isGuest) {
        return this.saveGuestCV(duplicatedData);
      } else {
        return await this.saveCV(duplicatedData, userId);
      }
    } catch (error) {
      console.error('Error duplicating CV:', error);
      throw new Error('Failed to duplicate CV. Please try again.');
    }
  }

  // Validate CV data
  validateCVData(cvData) {
    const errors = [];

    // Check CV name
    if (!cvData.cvName?.trim()) {
      errors.push('CV name is required');
    }

    // Check required fields
    if (!cvData.personal?.fullName?.trim()) {
      errors.push('Full name is required');
    }

    if (!cvData.personal?.email?.trim()) {
      errors.push('Email is required');
    } else if (!/^\S+@\S+\.\S+$/.test(cvData.personal.email)) {
      errors.push('Valid email is required');
    }

    // Validate experience entries
    if (cvData.experience && Array.isArray(cvData.experience)) {
      cvData.experience.forEach((exp, index) => {
        if (exp.company && !exp.position) {
          errors.push(`Position is required for experience entry ${index + 1}`);
        }
        if (exp.position && !exp.company) {
          errors.push(`Company is required for experience entry ${index + 1}`);
        }
      });
    }

    // Validate education entries
    if (cvData.education && Array.isArray(cvData.education)) {
      cvData.education.forEach((edu, index) => {
        if (edu.institution && !edu.degree) {
          errors.push(`Degree is required for education entry ${index + 1}`);
        }
        if (edu.degree && !edu.institution) {
          errors.push(`Institution is required for education entry ${index + 1}`);
        }
      });
    }

    // Validate skills
    if (cvData.skills && Array.isArray(cvData.skills)) {
      cvData.skills.forEach((skill, index) => {
        if (!skill.name?.trim()) {
          errors.push(`Skill name is required for skill entry ${index + 1}`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Clean CV data before saving
  cleanCVData(cvData) {
    const cleaned = { ...cvData };

    // Remove empty experience entries
    if (cleaned.experience) {
      cleaned.experience = cleaned.experience.filter(exp =>
        exp.company?.trim() || exp.position?.trim() || exp.description?.trim()
      );
    }

    // Remove empty education entries
    if (cleaned.education) {
      cleaned.education = cleaned.education.filter(edu =>
        edu.institution?.trim() || edu.degree?.trim() || edu.field?.trim()
      );
    }

    // Remove empty skills
    if (cleaned.skills) {
      cleaned.skills = cleaned.skills.filter(skill => skill.name?.trim());
    }

    return cleaned;
  }

  // Get CV statistics
  getCVStats(cvs) {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: cvs.length,
      updatedThisWeek: cvs.filter(cv =>
        new Date(cv.updatedAt) > oneWeekAgo
      ).length,
      mostRecent: cvs.length > 0 ? cvs[0] : null
    };
  }
}

export default new CVService();
