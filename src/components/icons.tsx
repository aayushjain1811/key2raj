/** All inline SVGs used across the site, carried over from the original build. */
import type { SVGProps } from "react";

export function WaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg className="wa-glyph" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2m5.8 14.16c-.24.68-1.2 1.26-1.96 1.42-.52.11-1.2.2-3.5-.75-2.94-1.22-4.83-4.2-4.98-4.4-.14-.2-1.19-1.58-1.19-3.02s.76-2.14 1.03-2.44c.27-.3.58-.37.78-.37h.56c.18 0 .42-.07.66.5.24.58.82 2.02.89 2.17.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.61.17.3.75 1.24 1.61 2 1.11.99 2.04 1.3 2.34 1.45.3.15.47.12.65-.07.17-.2.75-.87.95-1.17.2-.3.4-.25.66-.15.27.1 1.7.8 1.99.95.29.15.48.22.55.34.07.13.07.72-.17 1.4" />
    </svg>
  );
}

export function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 0a5 5 0 0 0-5 5c0 3.6 5 11 5 11s5-7.4 5-11a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
    </svg>
  );
}

export function TickIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 10.5l4.5 4.5L17 5.5" />
    </svg>
  );
}

function Outline({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export const PhoneIcon = () => (
  <Outline>
    <path d="M4 2.5h2.8L8.2 6.4 6.3 7.8a11 11 0 0 0 5.9 5.9l1.4-1.9 3.9 1.4v2.8a1.9 1.9 0 0 1-1.9 1.9A13.6 13.6 0 0 1 2.1 4.4 1.9 1.9 0 0 1 4 2.5z" />
  </Outline>
);

export const MailIcon = () => (
  <Outline>
    <rect x="2" y="4.2" width="16" height="11.6" rx="1" />
    <path d="M2.4 5l7.6 5.6L17.6 5" />
  </Outline>
);

export const PinOutline = () => (
  <Outline>
    <path d="M10 18s6-6.3 6-10a6 6 0 1 0-12 0c0 3.7 6 10 6 10z" />
    <circle cx="10" cy="8" r="2.2" />
  </Outline>
);

export const ClockIcon = () => (
  <Outline>
    <circle cx="10" cy="10" r="7.8" />
    <path d="M10 5.4V10l3.2 2" />
  </Outline>
);

export const InfoIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm.8 12H7.2V7h1.6zm0-6.4H7.2V4h1.6z" />
  </svg>
);

export const SOCIAL_PATHS: Record<string, string> = {
  instagram:
    "M8 0h8a8 8 0 018 8v8a8 8 0 01-8 8H8a8 8 0 01-8-8V8a8 8 0 018-8zm4 6a6 6 0 100 12 6 6 0 000-12zm0 2.2a3.8 3.8 0 110 7.6 3.8 3.8 0 010-7.6zM18.5 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z",
  facebook:
    "M13.5 24v-9h3l.5-3.5h-3.5V9c0-1 .3-1.7 1.8-1.7H17V4.2C16.7 4.1 15.6 4 14.3 4c-2.7 0-4.5 1.6-4.5 4.6v2.9H7V15h2.8v9z",
  linkedin:
    "M4.5 3A2 2 0 102.5 5a2 2 0 002-2zM3 8h3v13H3zm6 0h2.9v1.8h.04C12.4 8.7 13.7 7.7 15.6 7.7c3.1 0 3.7 2 3.7 4.7V21h-3v-6.9c0-1.6 0-3.7-2.3-3.7s-2.6 1.8-2.6 3.6V21H9z",
  youtube:
    "M23.5 7.3a3 3 0 00-2.1-2.1C19.5 4.7 12 4.7 12 4.7s-7.5 0-9.4.5A3 3 0 00.5 7.3C0 9.2 0 12 0 12s0 2.8.5 4.7a3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1c.5-1.9.5-4.7.5-4.7s0-2.8-.5-4.7zM9.6 15.6V8.4l6.2 3.6z",
};

/** Small line icons for the admin sidebar. */
export const AdminIcons = {
  dashboard: (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <rect x="2.5" y="2.5" width="6" height="6" /><rect x="11.5" y="2.5" width="6" height="6" />
      <rect x="2.5" y="11.5" width="6" height="6" /><rect x="11.5" y="11.5" width="6" height="6" />
    </svg>
  ),
  properties: (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2.5 8L10 2.5 17.5 8v9.5h-15z" /><path d="M8 17.5v-6h4v6" />
    </svg>
  ),
  bookings: (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <rect x="2.5" y="4" width="15" height="13.5" /><path d="M2.5 8h15M6.5 2.5v3M13.5 2.5v3" />
    </svg>
  ),
  enquiries: (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2.5 4h15v10h-9l-4 3.5V14h-2z" />
    </svg>
  ),
  services: (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="3" /><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.5 4.5l1.5 1.5M14 14l1.5 1.5M15.5 4.5L14 6M6 14l-1.5 1.5" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 5h14M3 10h14M3 15h14" /><circle cx="7" cy="5" r="1.6" /><circle cx="13" cy="10" r="1.6" /><circle cx="8" cy="15" r="1.6" />
    </svg>
  ),
  site: (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" /><path d="M2.5 10h15M10 2.5c2 2.4 3 4.9 3 7.5s-1 5.1-3 7.5c-2-2.4-3-4.9-3-7.5s1-5.1 3-7.5z" />
    </svg>
  ),
};
