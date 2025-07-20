import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration - your actual project config
const firebaseConfig = {
  apiKey: "AIzaSyBYUY2Z2ZQrL0aFkFMmO3vxKHKjwmpt3Go",
  authDomain: "tanemr-490d2.firebaseapp.com",
  projectId: "tanemr-490d2",
  storageBucket: "tanemr-490d2.firebasestorage.app",
  messagingSenderId: "610909783295",
  appId: "1:610909783295:web:536b9161cf9d0838acb8ca",
  measurementId: "G-5KH3F9FEV2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;
