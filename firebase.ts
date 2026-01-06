
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7bRz1aePEx8mWgd-VWqb1Eu4M_F7IPvE",
  authDomain: "localitydelivers.firebaseapp.com",
  projectId: "localitydelivers",
  storageBucket: "localitydelivers.firebasestorage.app",
  messagingSenderId: "43912080360",
  appId: "1:43912080360:web:cde92c2b29087fb57b525d",
  measurementId: "G-X8PGXB64EJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };
