/**
 * Services shown on the home page and /services.
 * Kept as configuration for now. When you want the admin to edit these,
 * move this array into a Firestore "services" collection — the shape is
 * already what the pages expect.
 */
import { IMG } from "@/config/site";

export interface Service {
  id: string;
  title: string;
  image: string;
  copy: string;
}

export const SERVICES: Service[] = [
  {
    id: "buy",
    title: "Buy",
    image: IMG.house,
    copy: "We shortlist against your budget, commute and long-term plans, then walk each site with you before you commit to anything.",
  },
  {
    id: "sell",
    title: "Sell",
    image: IMG.villa,
    copy: "Pricing based on what has actually closed nearby, proper photography, and buyers who are already looking in your segment.",
  },
  {
    id: "rent",
    title: "Rent",
    image: IMG.int1,
    copy: "Tenanting and letting handled end to end — verification, agreement drafting, registration and handover.",
  },
  {
    id: "invest",
    title: "Invest",
    image: IMG.skyline,
    copy: "Yield and exit analysis on pre-launch and resale stock, so you buy for a return rather than for a brochure.",
  },
  {
    id: "consult",
    title: "Property consultancy",
    image: IMG.consult,
    copy: "Title checks, approval status, builder track record and paperwork review before any money changes hands.",
  },
  {
    id: "plots",
    title: "Plots & land",
    image: IMG.plot,
    copy: "Licensed colonies, sanctioned layouts and clean-title land, with the sanction papers verified before we show it to you.",
  },
  {
    id: "commercial",
    title: "Commercial property",
    image: IMG.officeExt,
    copy: "Offices, showrooms and retail — leasing, purchase and fit-out guidance for occupiers and investors alike.",
  },
];
