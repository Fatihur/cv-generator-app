// Simple share testing utility
import shareService from '../services/shareService';

// Test data
const testCV = {
  personal: {
    fullName: 'John Doe Test',
    email: 'john.test@example.com',
    phone: '+1234567890',
    location: 'Test City, TC'
  },
  experience: [
    {
      position: 'Test Developer',
      company: 'Test Company',
      startDate: '2023-01-01',
      current: true,
      description: 'Testing share functionality'
    }
  ],
  education: [
    {
      degree: 'Test Degree',
      field: 'Computer Science',
      institution: 'Test University',
      graduationYear: '2022'
    }
  ],
  skills: [
    { name: 'JavaScript', level: 'Advanced' },
    { name: 'Testing', level: 'Expert' }
  ],
  template: 'modern',
  cvName: 'Test CV for Share'
};

// Test functions
export const testShareFunctions = {
  // Test creating a share
  async testCreateShare() {
    console.log('🧪 Testing share creation...');
    try {
      const shareUrl = await shareService.createShare(testCV);
      console.log('✅ Share created successfully:', shareUrl);
      return shareUrl;
    } catch (error) {
      console.error('❌ Share creation failed:', error);
      throw error;
    }
  },

  // Test getting a share
  async testGetShare(shareId) {
    console.log('🧪 Testing share retrieval for ID:', shareId);
    try {
      const shareData = await shareService.getShare(shareId);
      if (shareData) {
        console.log('✅ Share retrieved successfully:', shareData);
        return shareData;
      } else {
        console.log('❌ Share not found');
        return null;
      }
    } catch (error) {
      console.error('❌ Share retrieval failed:', error);
      throw error;
    }
  },

  // Test getting all shares
  async testGetAllShares() {
    console.log('🧪 Testing get all shares...');
    try {
      const shares = await shareService.getAllShares();
      console.log('✅ All shares retrieved:', shares);
      return shares;
    } catch (error) {
      console.error('❌ Get all shares failed:', error);
      throw error;
    }
  },

  // Full test cycle
  async runFullTest() {
    console.log('🚀 Starting full share test cycle...');
    
    try {
      // Step 1: Create share
      const shareUrl = await this.testCreateShare();
      const shareId = shareUrl.split('/').pop();
      
      // Step 2: Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 3: Retrieve share
      const shareData = await this.testGetShare(shareId);
      
      // Step 4: Get all shares
      const allShares = await this.testGetAllShares();
      
      // Step 5: Verify data integrity
      if (shareData && shareData.cvData.personal.fullName === testCV.personal.fullName) {
        console.log('✅ Full test cycle completed successfully!');
        return {
          success: true,
          shareUrl,
          shareId,
          shareData,
          allShares
        };
      } else {
        console.log('❌ Data integrity check failed');
        return {
          success: false,
          error: 'Data integrity check failed'
        };
      }
      
    } catch (error) {
      console.error('❌ Full test cycle failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Test localStorage fallback
  async testLocalStorageFallback() {
    console.log('🧪 Testing localStorage fallback...');
    
    // Create test data directly in localStorage
    const shareId = 'TEST1234';
    const shareData = {
      cvData: testCV,
      shareId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastAccessed: new Date().toISOString(),
      accessCount: 0,
      isActive: true,
      source: 'localStorage'
    };
    
    localStorage.setItem(`shared_cv_${shareId}`, JSON.stringify(shareData));
    console.log('✅ Test data stored in localStorage');
    
    // Try to retrieve it
    try {
      const retrieved = await shareService.getShare(shareId);
      if (retrieved) {
        console.log('✅ localStorage fallback working:', retrieved);
        return true;
      } else {
        console.log('❌ localStorage fallback failed');
        return false;
      }
    } catch (error) {
      console.error('❌ localStorage fallback error:', error);
      return false;
    }
  }
};

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  window.shareTest = testShareFunctions;
  console.log('🔧 Share test functions available as window.shareTest');
  console.log('📝 Available methods:');
  console.log('  - window.shareTest.testCreateShare()');
  console.log('  - window.shareTest.testGetShare(shareId)');
  console.log('  - window.shareTest.testGetAllShares()');
  console.log('  - window.shareTest.runFullTest()');
  console.log('  - window.shareTest.testLocalStorageFallback()');
}

export default testShareFunctions;
