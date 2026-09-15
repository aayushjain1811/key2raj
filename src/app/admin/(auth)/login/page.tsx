"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import Logo from "@/components/public/Logo";
import { getClientAuth } from "@/lib/firebase/client";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      // 1. Sign in with Firebase in the browser.
      const auth = getClientAuth();
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await credential.user.getIdToken();

      // 2. Hand the token to the server, which checks the admin role
      //    and sets a cookie the browser cannot read.
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        // Not an admin: drop the browser session again.
        await signOut(auth);
        setError(data.error || "Could not sign you in.");
        setPending(false);
        return;
      }

      router.replace(next);
      router.refresh();
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      setError(
        code === "auth/invalid-credential" ||
          code === "auth/wrong-password" ||
          code === "auth/user-not-found"
          ? "That email and password do not match."
          : code === "auth/too-many-requests"
            ? "Too many attempts. Please wait a minute and try again."
            : "Could not sign you in. Check your connection and try again."
      );
      setPending(false);
      console.error("Login failed:", err);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="field" style={{ marginBottom: 20 }}>
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="field" style={{ marginBottom: 24 }}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error ? (
        <p className="note note-err" style={{ marginBottom: 18 }}>
          {error}
        </p>
      ) : null}

      <button className="btn btn-ink btn-block" type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <Logo href="/" sub="Admin" />
        <h1>Admin sign in</h1>
        <p className="hint">Authorised staff only. Use the account created for you.</p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
