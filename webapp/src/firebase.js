// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWmZS79T4Kd5D-uJw9Kfe3vSiHZ02vv_w",
  authDomain: "sih-2025-8f4de.firebaseapp.com",
  projectId: "sih-2025-8f4de",
  storageBucket: "sih-2025-8f4de.firebasestorage.app",
  messagingSenderId: "997612821032",
  appId: "1:997612821032:web:3f2e7c22eb2dc1193cb31d",
  measurementId: "G-H4DD1T7XVL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };