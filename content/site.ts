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
   * Optional. Put the PDF in /public and set e.g. "/resume.pdf".
   * When set, /resume shows a "Download PDF" action beside the text version.
   */
  resumePdf: "/PriyanshuMishra_SoftwareEngineer.pdf",
} as const;

export type SiteConfig = typeof site;
