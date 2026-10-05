import type { MetadataRoute } from "next";
import { featuredProjects } from "@/content/projects";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/work",
    "/decisions",
    "/research",
    "/about",
    "/resume",
    ...featuredProjects.map((p) => `/work/${p.slug}`),
  ];
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path.startsWith("/work") ? 0.8 : 0.6,
  }));
}
