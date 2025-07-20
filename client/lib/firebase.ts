import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Firebase configuration using environment variables with fallback to actual config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBYUY2Z2ZQrL0aFkFMmO3vxKHKjwmpt3Go",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tanemr-490d2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tanemr-490d2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tanemr-490d2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "610909783295",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:610909783295:web:536b9161cf9d0838acb8ca",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5KH3F9FEV2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Connect to emulators in development
if (import.meta.env.DEV && !import.meta.env.VITE_USE_FIREBASE_PROD) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
  } catch (error) {
    console.log('Emulators already connected or not available');
  }
}

export default app;
