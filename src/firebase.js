// src/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore'

// Ganti dengan config dari Firebase Console → Project settings → bagian "SDK setup and config"
const firebaseConfig = {
  apiKey: 'AIzaSyDWpPfR9UNlAfHkBrqDBnc-_emQ1FAcdHQ',
  authDomain: 'fatamovie.firebaseapp.com',
  projectId: 'fatamovie',
  storageBucket: 'fatamovie.firebasestorage.app',
  messagingSenderId: '937759416151',
  appId: '1:937759416151:web:bbaf9f5111760427e76812',
  measurementId: 'G-WRM1RR502D',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const db = getFirestore(app)

export { auth, provider, signInWithPopup, db, doc, getDoc, setDoc, updateDoc, arrayUnion }
