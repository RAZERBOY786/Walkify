import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  Auth
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDsB4f0QMlMF-QQpV81WtJ9ome4Zly2WA0",
  authDomain: "fit3-f03dd.firebaseapp.com",
  projectId: "fit3-f03dd",
  storageBucket: "fit3-f03dd.firebasestorage.app",
  messagingSenderId: "872589046802",
  appId: "1:872589046802:web:10b798bdc92c7861cc94cb",
};

// Initialize app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize auth (SAFE)
let auth: Auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

// Firestore
const db = getFirestore(app);

export { auth, db };