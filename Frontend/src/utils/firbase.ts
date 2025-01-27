import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARCQWtEcIeKBkztZp9N2uH00OZEm5rRMM",
  authDomain: "laborlink-fde4d.firebaseapp.com",
  projectId: "laborlink-fde4d",
  storageBucket: "laborlink-fde4d.firebasestorage.app",
  messagingSenderId: "624928351109",
  appId: "1:624928351109:web:d3b9c856ee97282f6e1aec",
  measurementId: "G-F44F980P92"
};
console.log(firebaseConfig);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app); 

export { auth, googleProvider , db ,app};
