import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
// import { v4 as uuidv4 } from 'uuid';

class CVService {
  constructor() {
    this.collectionName = 'cvs';
  }

  // Generate a unique ID for CVs
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Save CV for authenticated users (Firebase)
  async saveCV(cvData, userId) {
    try {
      const cvWithMetadata = {
        ...cvData,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        id: this.generateId()
      };

      // For now, simulate Firebase save by using localStorage with user prefix
      // In production, uncomment the Firebase code below
      const userCVs = this.getUserCVsFromStorage(userId);
      userCVs.push(cvWithMetadata);
      localStorage.setItem(`userCVs_${userId}`, JSON.stringify(userCVs));

      return cvWithMetadata;

      // TODO: Uncomment for real Firebase integration
      // const docRef = await addDoc(collection(db, this.collectionName), cvWithMetadata);
      // return { ...cvWithMetadata, firebaseId: docRef.id };
    } catch (error) {
      console.error('Error saving CV:', error);
      throw new Error('Failed to save CV. Please try again.');
    }
  }

  // Update existing CV
  async updateCV(cvId, cvData, userId) {
    try {
      const updatedData = {
        ...cvData,
        updatedAt: new Date().toISOString()
      };

      const cvRef = doc(db, this.collectionName, cvId);
      await updateDoc(cvRef, updatedData);

      return { ...updatedData, id: cvId };
    } catch (error) {
      console.error('Error updating CV:', error);
      throw new Error('Failed to update CV. Please try again.');
    }
  }

  // Get all CVs for a user
  async getUserCVs(userId) {
    try {
      // For now, get from localStorage
      // In production, uncomment the Firebase code below
      const userCVs = this.getUserCVsFromStorage(userId);
      return userCVs.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      // TODO: Uncomment for real Firebase integration
      // const q = query(
      //   collection(db, this.collectionName),
      //   where('userId', '==', userId),
      //   orderBy('updatedAt', 'desc')
      // );

      // const querySnapshot = await getDocs(q);
      // const cvs = [];

      // querySnapshot.forEach((doc) => {
      //   cvs.push({
      //     firebaseId: doc.id,
      //     ...doc.data()
      //   });
      // });

      // return cvs;
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

  // Delete CV
  async deleteCV(cvId) {
    try {
      await deleteDoc(doc(db, this.collectionName, cvId));
      return true;
    } catch (error) {
      console.error('Error deleting CV:', error);
      throw new Error('Failed to delete CV. Please try again.');
    }
  }

  // Save CV for guest users (localStorage)
  saveGuestCV(cvData) {
    try {
      const guestCVs = this.getGuestCVs();
      const cvWithMetadata = {
        ...cvData,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isGuest: true
      };

      guestCVs.push(cvWithMetadata);
      localStorage.setItem('guestCVs', JSON.stringify(guestCVs));

      return cvWithMetadata;
    } catch (error) {
      console.error('Error saving guest CV:', error);
      throw new Error('Failed to save CV locally. Please check your browser storage.');
    }
  }

  // Update guest CV
  updateGuestCV(cvId, cvData) {
    try {
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
      return guestCVs[cvIndex];
    } catch (error) {
      console.error('Error updating guest CV:', error);
      throw new Error('Failed to update CV. Please try again.');
    }
  }

  // Get all guest CVs
  getGuestCVs() {
    try {
      const stored = localStorage.getItem('guestCVs');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading guest CVs:', error);
      return [];
    }
  }

  // Delete guest CV
  deleteGuestCV(cvId) {
    try {
      const guestCVs = this.getGuestCVs();
      const filteredCVs = guestCVs.filter(cv => cv.id !== cvId);
      localStorage.setItem('guestCVs', JSON.stringify(filteredCVs));
      return true;
    } catch (error) {
      console.error('Error deleting guest CV:', error);
      throw new Error('Failed to delete CV. Please try again.');
    }
  }

  // Duplicate CV
  async duplicateCV(originalCV, userId, isGuest = false) {
    try {
      const duplicatedData = {
        ...originalCV,
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
