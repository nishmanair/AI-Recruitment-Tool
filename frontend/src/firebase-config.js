// frontend/src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAv0TIZxdbCZtLJ_mIAF7iou-tzrj-_ZOI", // Replace with your API Key
  authDomain: "ai-recruitment-tool-7c194.firebaseapp.com", // Replace with your Auth Domain
  projectId: "ai-recruitment-tool-7c194", // Replace with your Project ID
  storageBucket: "ai-recruitment-tool-7c194.firebasestorage.app", // Replace with your Storage Bucket
  messagingSenderId: "728874395657", // Replace with your Messaging Sender ID
  appId: "1:728874395657:web:f37b908f7f63c65492f0d8", // Replace with your App ID
  measurementId: "G-0LSWW39KMP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Get the authentication instance

export { auth }; // Export the auth instance for use in other components
