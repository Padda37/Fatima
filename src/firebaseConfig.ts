// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8tZwCG9TM11n3tfFM-iWeOII0nSRdCQs",
  authDomain: "digital-fyp.firebaseapp.com",
  projectId: "digital-fyp",
  storageBucket: "digital-fyp.firebasestorage.app",
  messagingSenderId: "727365128968",
  appId: "1:727365128968:web:86d79cb4f31c6c4a1c92bd",
  measurementId: "G-VPFT0S4NNX"
};

// ✅ Prevent Duplicate Initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }
