/**
 * Firebase for the SERVER.
 * This bypasses every security rule, so it must never be imported by a
 * file that runs in the browser. Server components, server actions and
 * route handlers only.
 *
 * Everything is created lazily, the first time it is actually used.
 * That way the project still builds and the public pages still render
 * their error states if the credentials are missing.
 */
import "server-only";
import { initializeApp, getApps, getApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

let cached: App | null = null;

export function adminApp(): App {
  if (cached) return cached;
  if (getApps().length) {
    cached = getApp();
    return cached;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // The key is stored with literal \n characters in .env.local,
  // so they have to be turned back into real line breaks.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin is not configured. Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in .env.local"
    );
  }

  cached = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket:
      process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
  return cached;
}

export const adminDb = (): Firestore => getFirestore(adminApp());
export const adminAuth = (): Auth => getAuth(adminApp());
export const adminBucket = () => getStorage(adminApp()).bucket();
