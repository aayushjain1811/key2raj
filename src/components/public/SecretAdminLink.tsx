"use client";

/**
 * Quiet way into the admin panel, so the public site carries no visible
 * "Admin" link. Two ways in:
 *
 *   · click the © symbol in the footer five times
 *   · press Ctrl + Shift + K anywhere on the site
 *
 * This is convenience, not security. Anyone who types /admin/login
 * still reaches the same page — what actually protects the panel is
 * Firebase Authentication and the role check on the server.
 */
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function SecretAdminLink() {
  const router = useRouter();
  const clicks = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        router.push("/admin/login");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function onClick() {
    clicks.current += 1;

    // The count resets if the clicks are more than 1.2s apart, so a
    // visitor clicking around the footer never stumbles into it.
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      clicks.current = 0;
      setHint(false);
    }, 1200);

    if (clicks.current >= 3) setHint(true);

    if (clicks.current >= 5) {
      clicks.current = 0;
      setHint(false);
      router.push("/admin/login");
    }
  }

  return (
    <span
      className={`secret-key${hint ? " is-warm" : ""}`}
      onClick={onClick}
      title={hint ? "Two more" : undefined}
      aria-hidden="true"
    >
      ©
    </span>
  );
}