import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9aydL6i0Hwb0DQUg4KAJ5Io5Mmh9Uedg",
  authDomain: "surveys-61b91.firebaseapp.com",
  projectId: "surveys-61b91",
  storageBucket: "surveys-61b91.firebasestorage.app",
  messagingSenderId: "363450308349",
  appId: "1:363450308349:web:8cdbcce6eb874832df5094",
  measurementId: "G-QBH8R6XNSG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
