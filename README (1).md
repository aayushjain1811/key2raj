# KEY2RAJ Real Estate — full-stack site

Next.js (App Router) + TypeScript + Firebase + Zod.
The visual design is the approved K2R design, carried across from
`Flat.html` unchanged.

---

## What is where

```
src/
  app/
    (public)/        home, properties, property detail, services, about, contact
    admin/
      (auth)/login   sign-in page — no protected layout above it
      (panel)/       everything behind the login: dashboard, properties, bookings…
    api/             session cookie, logout, image upload
    actions/         public server actions (booking, enquiry)
  components/
    public/          nav, footer, buttons, forms
    properties/      card, search panel, browser, gallery
    booking/         the booking modal
    admin/           shell, tables, property form, image uploader
  lib/
    firebase/        client.ts (browser) and admin.ts (server) — keep these apart
    auth/session.ts  login, session cookie, role check
    validations/     Zod schemas
    properties.ts    every read and write of the properties collection
  config/site.ts     ALL business information lives here
scripts/             seed.mjs, make-admin.mjs
firestore.rules      copy into the Firebase console
storage.rules        copy into the Firebase console
```

---

## Setup, in order

**1. Drop the files into your project.**
Copy `src/`, `scripts/`, `next.config.ts`, `middleware.ts` is inside `src/`,
plus `firestore.rules`, `storage.rules` and `.env.example`.

If your `src/app/globals.css` already had Tailwind directives at the top,
keep whichever line your version uses:
- Tailwind v4: `@import "tailwindcss";` (what this file has)
- Tailwind v3: `@tailwind base; @tailwind components; @tailwind utilities;`

Everything below that line is the K2R design system — leave it alone.

**2. Install the packages.**
```bash
npm install firebase firebase-admin zod
npm install -D dotenv
```

**3. Fill in `.env.local`.**
Copy `.env.example` to `.env.local` and paste your values in.
The six `NEXT_PUBLIC_` keys come from Firebase console → Project settings →
Your apps. The three private ones come from Project settings →
Service accounts → Generate new private key.

**4. Create your admin account.**
```bash
npm run make-admin you@example.com YourPassword123
```
Drop the password if the account already exists in Firebase Auth.
This sets the role that the server checks on every admin request.

**5. Load the demo properties.**
```bash
npm run seed
```
Your nine listings from the original build. `npm run seed -- --force`
overwrites them if you run it again.

**6. Publish the security rules.**
Paste `firestore.rules` and `storage.rules` into the Firebase console
(Firestore → Rules, Storage → Rules) and publish. Do this before anyone
else sees the site.

**7. Run it.**
```bash
npm run dev
```
Website: http://localhost:3000
Admin: http://localhost:3000/admin/login

---

## How the login actually works

1. The browser signs in with Firebase and receives an ID token.
2. It posts that token to `/api/auth/session`.
3. The server verifies the token, looks up the user's role in the
   `users` collection, and sets an httpOnly cookie.
4. Every admin page verifies that cookie again on the server.

Being signed in to Firebase is **not** the same as being an admin.
Only accounts with a `users/{uid}` document holding role `ADMIN` or
`SUPER_ADMIN` get in. To add `AGENT` later, add it to `ALLOWED_ROLES`
in `src/lib/auth/session.ts`.

`middleware.ts` only checks that a cookie exists, because middleware
runs on the Edge runtime where firebase-admin cannot run. It is a first
gate, not the real one.

---

## How images work

The browser never touches Firebase Storage. It posts the file to
`/api/admin/upload`, the server checks the session, then writes the file
with the Admin SDK and makes that one file public.

That is why `storage.rules` denies everything — no browser needs access.

Firestore stores only the metadata:
```
{ id, url, storagePath, isFeatured, sortOrder }
```
Deleting a property also deletes its files from Storage.

---

## Why the public site updates instantly

Next.js caches pages for speed. When the admin saves, the server actions
in `src/app/admin/actions.ts` call `revalidatePath()` for `/`,
`/properties` and `/properties/[slug]`. That is what makes a status
change from AVAILABLE to SOLD appear for visitors straight away.
If you add a new public page that shows properties, add it to
`refreshPublicPages()` too.

---

## Replacing the demo content

| To change | Edit |
|---|---|
| Phone, email, address, hours, socials | `src/config/site.ts` |
| WhatsApp number | `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` |
| Logo | put the file in `/public`, set `logo: "/logo.svg"` in `site.ts` |
| Services | `src/config/services.ts` |
| Marketing photos | `IMG` in `src/config/site.ts` |
| Properties | the admin panel — never in code |

Once the client's real listings are in, delete the demo ones from
`/admin/properties`.

---

## Still to do

- Google Maps embed on the property page and contact page
  (the placeholder panel marks the spot)
- Editing services and business settings from the admin panel
  (currently file-based, deliberately)
- The real K2R logo file
