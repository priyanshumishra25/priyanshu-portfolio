/**
 * The one place for personal links and contact details.
 * tests/content.test.ts fails if placeholder values come back.
 */
export const site = {
  name: "Priyanshu Mishra",
  role: "Software Engineer",
  location: "Sydney, NSW",
  tagline: "I build things, break things, and occasionally figure out why they broke.",
  description:
    "Software Engineer building backend systems, full-stack products, AI applications and developer tools.",
  /** Set NEXT_PUBLIC_SITE_URL in production. Used for OpenGraph, sitemap and robots. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  email: "priyanshumishra2508@gmail.com",
  github: "https://github.com/priyanshumishra25",
  linkedin: "https://www.linkedin.com/in/priyanshu-mishra-unsw",

  /**
   * Put each PDF in /public and list it here. The first entry is the default
   * on /resume; the others are one click away.
   */
  resumePdfs: [
    { label: "Software Engineer", href: "/PriyanshuMishra_SoftwareEngineer.pdf" },
    { label: "AI Engineer", href: "/PriyanshuMishra_AIEngineer.pdf" },
  ],
} as const;

export type SiteConfig = typeof site;
