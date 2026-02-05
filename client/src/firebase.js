// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-334c9.firebaseapp.com",
  projectId: "mern-estate-334c9",
  storageBucket: "mern-estate-334c9.firebasestorage.app",
  messagingSenderId: "710828476422",
  appId: "1:710828476422:web:a850f704b27f7b891b5b87"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);