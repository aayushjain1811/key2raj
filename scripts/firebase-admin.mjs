/** Shared Firebase Admin setup for the command-line scripts. */
import { config } from "dotenv";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

config({ path: ".env.local" });

// ADMIN_* names are used in deployment because Firebase App Hosting
// reserves the FIREBASE_ prefix. Both are accepted here.
const projectId = process.env.ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = (process.env.ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY)?.replace(
  /\\n/g,
  "\n"
);

if (!projectId || !clientEmail || !privateKey) {
  console.error("\nMissing Firebase credentials. Fill in .env.local first:");
  console.error("  FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY\n");
  process.exit(1);
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });

export const db = getFirestore(app);
export const auth = getAuth(app);
