import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBnj3ue2C88Xojwq97zOOiFjH5XVQN4p8g",
  authDomain: "cv-generator-5c340.firebaseapp.com",
  projectId: "cv-generator-5c340",
  storageBucket: "cv-generator-5c340.firebasestorage.app",
  messagingSenderId: "506354027487",
  appId: "1:506354027487:web:e1b0e648f8bf2992acd26a",
  measurementId: "G-0N53L11FFE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;
