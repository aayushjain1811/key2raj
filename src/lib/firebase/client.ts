import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

function getApp_(): FirebaseApp {
  if (app) return app;
  if (!firebaseConfig.apiKey) {
    throw new Error(
      "NEXT_PUBLIC_FIREBASE_API_KEY is missing. Check .env.local and restart the dev server."
    );
  }
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return app;
}

export function getClientAuth(): Auth {
  if (auth) return auth;
  auth = getAuth(getApp_());
  return auth;
}

export function getClientStorage(): FirebaseStorage {
  if (storage) return storage;
  storage = getStorage(getApp_());
  return storage;
}