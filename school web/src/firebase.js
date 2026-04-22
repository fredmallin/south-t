
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_qhTMhuNQvOmDAtpCcb-HFgfvpzFFULo",
  authDomain: "south-t.firebaseapp.com",
  projectId: "south-t",
  storageBucket: "south-t.firebasestorage.app",
  messagingSenderId: "232087495362",
  appId: "1:232087495362:web:e46ba943f45c7e8255915b",
  measurementId: "G-7CHQFPX0LR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);