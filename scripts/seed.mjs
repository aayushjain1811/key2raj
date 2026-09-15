/**
 * Loads the nine demo properties into Firestore.
 *
 *   npm run seed          add any that are missing
 *   npm run seed -- --force   overwrite them all
 *
 * Safe to run more than once: it matches on slug, so it will not create
 * duplicates. Delete these from the admin panel once the client's real
 * listings are in.
 */
import { readFileSync } from "fs";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "./firebase-admin.mjs";

const force = process.argv.includes("--force");
const properties = JSON.parse(readFileSync(new URL("./demo-properties.json", import.meta.url), "utf8"));

async function seed() {
  const collection = db.collection("properties");
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const property of properties) {
    const existing = await collection.where("slug", "==", property.slug).limit(1).get();
    const now = Timestamp.now();

    if (!existing.empty) {
      if (!force) {
        skipped++;
        continue;
      }
      await existing.docs[0].ref.set({ ...property, createdAt: now, updatedAt: now });
      updated++;
      continue;
    }

    await collection.add({ ...property, createdAt: now, updatedAt: now });
    created++;
  }

  console.log(`\nDemo properties: ${created} created, ${updated} updated, ${skipped} already there.`);
  if (skipped && !force) console.log("Run  npm run seed -- --force  to overwrite them.\n");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
