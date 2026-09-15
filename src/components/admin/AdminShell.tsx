"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/public/Logo";
import { AdminIcons } from "@/components/icons";

const LINKS: { href: string; label: string; icon: keyof typeof AdminIcons }[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/properties", label: "Properties", icon: "properties" },
  { href: "/admin/bookings", label: "Bookings", icon: "bookings" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "enquiries" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

export default function AdminShell({
  admin,
  title,
  children,
}: {
  admin: { name: string; email: string; role: string };
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="adm">
      {open ? <div className="adm-scrim" onClick={() => setOpen(false)} /> : null}

      <aside className={`adm-side${open ? " is-open" : ""}`}>
        <Logo href="/admin/dashboard" sub="Admin" />
        <ul className="adm-nav">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={pathname.startsWith(link.href) ? "is-on" : ""}
                onClick={() => setOpen(false)}
              >
                {AdminIcons[link.icon]}
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/" target="_blank">
              {AdminIcons.site}
              View website
            </Link>
          </li>
        </ul>
        <div className="adm-side-foot">
          <p style={{ margin: 0 }}>{admin.email}</p>
        </div>
      </aside>

      <div className="adm-main">
        <header className="adm-top">
          <button className="adm-burger" type="button" aria-label="Open menu" onClick={() => setOpen(true)}>
            <span />
          </button>
          <h1>{title}</h1>
          <div className="adm-who">
            <b>{admin.name}</b>
            <span>{admin.role.replace("_", " ")}</span>
          </div>
          <button className="btn-mini" type="button" onClick={logout} disabled={busy}>
            {busy ? "Signing out…" : "Log out"}
          </button>
        </header>

        <div className="adm-body">{children}</div>
      </div>
    </div>
  );
}
