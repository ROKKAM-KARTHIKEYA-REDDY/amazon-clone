// For Firebase v9+ Modular SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPVz2inzYbhnrqmHL0snnByQ18srYP2JY",
  authDomain: "clone-3e435.firebaseapp.com",
  projectId: "clone-3e435",
  storageBucket: "clone-3e435.firebasestorage.app",
  messagingSenderId: "800003580223",
  appId: "1:800003580223:web:29a0917570fb6d59ce338a",
  measurementId: "G-V61GNY4ZGV"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get services
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
