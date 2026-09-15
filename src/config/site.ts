/**
 * =====================================================================
 * KEY2RAJ — CENTRAL BUSINESS CONFIGURATION
 * ---------------------------------------------------------------------
 * Every piece of business information on the website is read from this
 * one file. Change it here and it changes everywhere.
 * The WhatsApp number comes from .env.local so it can differ between
 * your local machine and the live site.
 * =====================================================================
 */

export const siteConfig = {
  brand: "KEY2RAJ",
  brandLine: "Real Estate",
  tagline: "Buy • Sell • Rent • Invest",
  headline: "Your Key to the Right Property",

  // Logo. Drop the real file into /public and point this at it,
  // e.g. "/logo.svg". Leave it null to use the built-in "K2" mark.
  logo: "/logo.png",

  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919813608001",
  phone: "+91 98136 08001",
  email: "key2raj01@gmail.com",
  address: "Shop No. 6, Bhardwaj Complex,\n Sector 99A, Gurugram, Haryana 122505",
  hours: "Monday – Saturday, 10:00 AM – 7:00 PM",
  rera: "RERA Registration No. — to be added",

  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  description:
    "KEY2RAJ Real Estate — premium property consultancy. Curated apartments, villas, penthouses, commercial spaces and plots. Book a site visit on WhatsApp.",
  footerBlurb:
    "Property consultancy across Delhi NCR. Residences, commercial space and land — advised on properly, from first viewing to registry.",

  /**
   * The person clients deal with. The photo is used on the About page,
   * the Contact page, and on property pages where this name is the
   * listed consultant. Put the file in /public.
   */
  consultant: {
    name: "Rajpal",
    role: "Property Consultant",
    photo: "/consultant.jpg",
    bio: "Eighteen years across Gurugram, Noida and Faridabad. I visit every property on this site before it is listed, and I will tell you when one is wrong for you.",
  },

  /**
   * Search terms this business should be found for. These feed the
   * keywords metadata and the wording of page descriptions.
   */
  keywords: [
    "property dealer in Gurugram",
    "real estate consultant Gurugram",
    "flats for sale in Gurugram",
    "villas for sale Gurugram",
    "property for rent Gurugram",
    "commercial property Gurugram",
    "plots for sale Gurugram",
    "real estate agent Delhi NCR",
    "KEY2RAJ Real Estate",
  ],

  /** Used by the local business listing search engines read. */
  geo: {
    locality: "Gurugram",
    region: "Haryana",
    postalCode: "122505",
    country: "IN",
    streetAddress: "Shop No. 6, Bhardwaj Complex, Sector 99A",
    areasServed: ["Gurugram", "Noida", "Faridabad", "Delhi NCR"],
  },

  social: {
    instagram: "#",
    facebook: "#",
    linkedin: "#",
    youtube: "#",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Navigation shown in the header and the mobile drawer. */
export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** Marketing copy blocks. Edit freely — nothing else depends on them. */
export const WHY_POINTS: [string, string][] = [
  ["Trusted property guidance", "We tell you when a property is wrong for you. That is the whole job."],
  ["Curated properties", "Every listing is visited and verified by our team before it reaches this website."],
  ["Personalised consultation", "One consultant stays with you from the first call through to registry."],
  ["Transparent process", "Costs, charges and timelines written down in advance, with nothing added later."],
  ["Residential & commercial", "Apartments, villas, plots, offices and retail handled by specialists in each."],
  ["Investment guidance", "Rental yield, holding period and exit routes worked out before you buy."],
];

export const STATS: [string, string][] = [
  ["18+", "Years advising"],
  ["1,200+", "Families settled"],
  ["₹900 Cr+", "Property transacted"],
  ["7", "Cities covered"],
];

export const PROCESS_STEPS: [string, string][] = [
  ["Understand", "A conversation about budget, commute, timeline and what the home has to do for you."],
  ["Shortlist", "Four or five properties that genuinely fit — not forty that technically match."],
  ["Visit", "We walk each site with you, at the hour of day that shows it honestly."],
  ["Close", "Paperwork, title check, negotiation and registry, handled to handover."],
];

/** Stock architectural photography used by the marketing sections. */
const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1500&q=70`;

export const IMG = {
  hero: U("1486406146926-c627a92ad1ab"),
  tower: U("1545324418-cc1a3fa10c00"),
  skyline: U("1512453979798-5ea266f8880c"),
  villa: U("1613490493576-7fde63acd811"),
  house: U("1580587771525-78b9dba3b914"),
  officeExt: U("1486325212027-8081e485255e"),
  plot: U("1500382017468-9049fed747ef"),
  lobby: U("1582407947304-fd86f028f716"),
  int1: U("1600607687939-ce8a6c25118c"),
  consult: U("1560518883-ce09059eeffa"),
  dusk: U("1519501025264-65ba15a82390"),
};