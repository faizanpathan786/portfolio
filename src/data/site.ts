/** Shared site-wide constants and content data. */

export const HLS_SRC =
  "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

export const ROLES = ["Creative", "Fullstack", "Founder", "Scholar"] as const;

export const LOADING_WORDS = ["Design", "Create", "Inspire"] as const;

export interface Project {
  title: string;
  category: string;
  description: string;
  image: string;
  url: string;
  /** Tailwind md: column-span class for the bento grid. */
  span: string;
  /** aspect-ratio class for the card. */
  aspect: string;
}

/** Real projects — screenshots captured into /public/projects. */
export const PROJECTS: Project[] = [
  {
    title: "LinkedInFlow",
    category: "SaaS Product",
    description:
      "Turns weekly wins, lessons, and thoughts into polished LinkedIn posts so founders build real inbound in 30 minutes a week.",
    image: "/projects/linkedinflow.png",
    url: "https://linkedinflowfe.vercel.app/",
    span: "md:col-span-7",
    aspect: "aspect-[16/11]",
  },
  {
    title: "Shadab Portfolio",
    category: "Personal Brand",
    description:
      "A bold 3D personal portfolio with an animated avatar, built to scale luxury tour operators to page-one visibility.",
    image: "/projects/shadabportfolio.png",
    url: "https://shadabportfolio.vercel.app/",
    span: "md:col-span-5",
    aspect: "aspect-[16/11]",
  },
  {
    title: "Ayush Flower Merchant",
    category: "E-Commerce",
    description:
      "Premium floral artistry for every occasion — pioneering arrangements bringing breathtaking beauty within reach.",
    image: "/projects/ayushflower.png",
    url: "https://ayushflowermerchant.vercel.app/",
    span: "md:col-span-12",
    aspect: "aspect-[21/9]",
  },
];

export interface JournalEntry {
  title: string;
  image: string;
  readTime: string;
  date: string;
}

export const JOURNAL: JournalEntry[] = [
  {
    title: "Designing for motion-first interfaces",
    image: "/projects/linkedinflow.png",
    readTime: "6 min read",
    date: "May 2026",
  },
  {
    title: "Why constraints make better products",
    image: "/projects/ayushflower.png",
    readTime: "4 min read",
    date: "Apr 2026",
  },
  {
    title: "Building a personal brand that scales",
    image: "/projects/shadabportfolio.png",
    readTime: "8 min read",
    date: "Mar 2026",
  },
  {
    title: "The craft of seamless transitions",
    image: "/projects/ayushflower.png",
    readTime: "5 min read",
    date: "Feb 2026",
  },
];

export interface Stat {
  value: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: "20+", label: "Years Experience" },
  { value: "95+", label: "Projects Done" },
  { value: "200%", label: "Satisfied Clients" },
];

/** Images reused for the explorations parallax gallery. */
export const EXPLORATION_IMAGES = [
  "/projects/linkedinflow.png",
  "/projects/shadabportfolio.png",
  "/projects/ayushflower.png",
  "/projects/ayushflower.png",
  "/projects/linkedinflow.png",
  "/projects/shadabportfolio.png",
];
