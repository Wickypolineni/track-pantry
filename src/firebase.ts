import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB_3DkLBjnU1j9X35iebrQU58WrNjy7-AU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "pantrytracker-e29c9.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "pantrytracker-e29c9",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "pantrytracker-e29c9.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID || "400490550815",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:400490550815:web:eecd3f79584c7e5c14272a",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-HBB9HY5PRF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Use emulator if needed (for development)
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

let analytics;
(async () => {
  if (typeof window !== "undefined") {
    try {
      const isFirebaseAnalyticsSupported = await isSupported();
      if (isFirebaseAnalyticsSupported) {
        analytics = getAnalytics(app);
      }
    } catch (error) {
      console.error("Analytics initialization failed", error);
    }
  }
})();

export { analytics, db };
