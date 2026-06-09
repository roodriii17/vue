import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB6qPX6YSO-WYbzoSs2AsLZdyWS4bb_pzo",
  authDomain: "recvue-3397e.firebaseapp.com",
  projectId: "recvue-3397e",
  storageBucket: "recvue-3397e.firebasestorage.app",
  messagingSenderId: "311568724101",
  appId: "1:311568724101:web:add16db8921f97f0ccf9ec"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();