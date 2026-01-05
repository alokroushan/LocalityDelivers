// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7bRz1aePEx8mWgd-VWqb1Eu4M_F7IPvE",
  authDomain: "localitydelivers.firebaseapp.com",
  projectId: "localitydelivers",
  storageBucket: "localitydelivers.firebasestorage.app",
  messagingSenderId: "43912080360",
  appId: "1:43912080360:web:cde92c2b29087fb57b525d",
  measurementId: "G-X8PGXB64EJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
