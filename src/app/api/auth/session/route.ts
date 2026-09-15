import { NextResponse } from "next/server";
import { verifyIdTokenAsAdmin, createSessionCookie, setSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  let idToken: string | undefined;
  try {
    const body = await request.json();
    idToken = body?.idToken;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (!idToken) {
    return NextResponse.json({ error: "Missing sign-in token." }, { status: 400 });
  }

  const admin = await verifyIdTokenAsAdmin(idToken);
  if (!admin) {
    // Deliberately vague: it does not say whether the account exists.
    return NextResponse.json(
      { error: "This account is not authorised to use the admin panel." },
      { status: 403 }
    );
  }

  const cookie = await createSessionCookie(idToken);
  await setSessionCookie(cookie);
  return NextResponse.json({ ok: true, name: admin.name, role: admin.role });
}
