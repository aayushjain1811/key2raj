/**
 * Turns a Firebase account into a KEY2RAJ administrator.
 *
 *   npm run make-admin you@example.com
 *   npm run make-admin you@example.com YourPassword123   (creates the account too)
 *
 * Being signed in to Firebase is not enough to reach the admin panel.
 * The role written here is what the server checks on every request.
 */
import { auth, db } from "./firebase-admin.mjs";

const [, , email, password] = process.argv;

if (!email) {
  console.error("\nUsage: npm run make-admin your@email.com [password]\n");
  process.exit(1);
}

async function main() {
  let user;

  try {
    user = await auth.getUserByEmail(email);
    console.log(`Found existing account: ${email}`);
  } catch {
    if (!password) {
      console.error(`\nNo account for ${email}. Pass a password to create one:`);
      console.error(`  npm run make-admin ${email} YourPassword123\n`);
      process.exit(1);
    }
    user = await auth.createUser({ email, password, emailVerified: true });
    console.log(`Created account: ${email}`);
  }

  // The custom claim is what Firestore security rules read.
  await auth.setCustomUserClaims(user.uid, { admin: true, role: "ADMIN" });

  // The users document is what the website reads. Roles live here so you
  // can add SUPER_ADMIN or AGENT later without changing any code.
  await db.collection("users").doc(user.uid).set(
    {
      email,
      role: "ADMIN",
      createdAt: new Date().toISOString(),
    },
    { merge: true }
  );

  console.log(`\n${email} is now an ADMIN. Sign in at /admin/login\n`);
  process.exit(0);
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
