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
  apiKey: 'AIzaSyCRw9sh1OmWJTL_b2HDeQXEbBDSpsz9F_w',
  authDomain: 'secret-santa-e3f0f.firebaseapp.com',
  databaseURL: 'https://secret-santa-e3f0f.firebaseio.com',
  projectId: 'secret-santa-e3f0f',
  storageBucket: 'secret-santa-e3f0f.appspot.com',
  messagingSenderId: '1050830077055',
  appId: '1:1050830077055:web:ddf62bc6fe809d3b09534a',
  measurementId: 'G-2JEGNHVQ8B',
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
