import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDbvFmNpAG2-qxJ-UTpoGfFFN-7COL5WBI",
  authDomain: "habitos-27f62.firebaseapp.com",
  projectId: "habitos-27f62",
  storageBucket: "habitos-27f62.firebasestorage.app",
  messagingSenderId: "628012715278",
  appId: "1:628012715278:web:2c6310d0799415da815b5f"
};
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);