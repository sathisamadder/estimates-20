import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Firebase configuration - your actual project config
const firebaseConfig = {
  apiKey: "AIzaSyBYUY2Z2ZQrL0aFkFMmO3vxKHKjwmpt3Go",
  authDomain: "tanemr-490d2.firebaseapp.com",
  projectId: "tanemr-490d2",
  storageBucket: "tanemr-490d2.firebasestorage.app",
  messagingSenderId: "610909783295",
  appId: "1:610909783295:web:536b9161cf9d0838acb8ca",
  measurementId: "G-5KH3F9FEV2"
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
