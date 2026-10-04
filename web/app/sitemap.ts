import type { MetadataRoute } from "next";
import { getProjects } from "../lib/content";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const pages = ["", "/story", "/research", "/publications", "/projects", "/experience", "/certificates", "/cv"];
  const projects = (await getProjects()).map((p) => `/projects/${p.slug}`);
  return [...pages, ...projects].map((p) => ({ url: site + p }));
}
