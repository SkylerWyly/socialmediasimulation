import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Hardcoding these is safe for client-side Firebase apps and prevents build-time errors
const firebaseConfig = {
  apiKey: "AIzaSyBEyvE-phmHGi3DPHCe6Ke6Lr78LjeuH3M",
  authDomain: "socialmediasim.firebaseapp.com",
  projectId: "socialmediasim",
  storageBucket: "socialmediasim.firebasestorage.app",
  messagingSenderId: "1003882245214",
  appId: "1:1003882245214:web:3235a543713460605118cf"
};

// Singleton pattern with a "window" check to ensure it only runs in the browser
const app = (typeof window !== "undefined" && getApps().length === 0) 
  ? initializeApp(firebaseConfig) 
  : (getApps().length > 0 ? getApp() : null);

// Export instances (with null checks for the build server)
export const db = app ? getFirestore(app) : null as any;
export const auth = app ? getAuth(app) : null as any;
export default app;