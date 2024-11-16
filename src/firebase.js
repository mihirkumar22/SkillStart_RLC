// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAp8f8aPbLtyXPefEQbcfBliLmm93HwnMw",
  authDomain: "website-616c9.firebaseapp.com",
  projectId: "website-616c9",
  storageBucket: "website-616c9.firebasestorage.app",
  messagingSenderId: "248362649618",
  appId: "1:248362649618:web:6ebff7b8f2602cc8f1b0cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };