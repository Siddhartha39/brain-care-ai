import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCjBbzgDICJk2yFELH_ajPTHDa-VJfNM98',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'safe-f5b6b.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://safe-f5b6b-default-rtdb.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'safe-f5b6b',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'safe-f5b6b.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '38570462588',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:38570462588:web:c0cbb0dbd935e6426c28f9',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-09837L7MXJ',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

setPersistence(auth, browserLocalPersistence).catch(() => {
  // Persistence is optional and should not block app initialization.
});

export default app;

