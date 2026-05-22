// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjcrKb6m-6Yn9Wx-qdkOEdgI4V0oJVQt4",
  authDomain: "astrogurujii-production.firebaseapp.com",
  databaseURL: "https://astrogurujii-production-default-rtdb.firebaseio.com",
  projectId: "astrogurujii-production",
  storageBucket: "astrogurujii-production.firebasestorage.app",
  messagingSenderId: "307653017355",
  appId: "1:307653017355:web:5b9012107424480ec8ec0e",
  measurementId: "G-77W4E12DBC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);





