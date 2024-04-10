// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APPI_KEY,
  authDomain: "mern-blog-cd6ab.firebaseapp.com",
  projectId: "mern-blog-cd6ab",
  storageBucket: "mern-blog-cd6ab.appspot.com",
  messagingSenderId: "646835583072",
  appId: "1:646835583072:web:09cf7a265135c1e25a6b05",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
