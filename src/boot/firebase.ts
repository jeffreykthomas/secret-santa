import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  FieldValue,
  arrayUnion,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  setDoc,
  writeBatch,
  query,
  where,
  Timestamp,
  updateDoc,
  deleteDoc,
  onSnapshot,
  increment,
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const fv = FieldValue;

export {
  db,
  fv,
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  arrayUnion,
  addDoc,
  doc,
  setDoc,
  writeBatch,
  query,
  where,
  Timestamp,
  updateDoc,
  increment,
  onSnapshot,
};
