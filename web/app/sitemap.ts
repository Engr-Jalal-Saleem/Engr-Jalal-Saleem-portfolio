import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "../lib/content";
import { siteUrl } from "../lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = siteUrl();
  const pages = ["", "/story", "/research", "/publications", "/projects", "/experience", "/blog", "/certificates", "/cv"];
  const projects = (await getProjects()).map((p) => ({ url: `${site}/projects/${p.slug}` }));
  const posts = (await getPosts()).map((p) => ({ url: `${site}/blog/${p.slug}`, lastModified: p.entry.date || undefined }));
  return [...pages.map((p) => ({ url: site + p, priority: p === "" ? 1 : 0.7 })), ...projects, ...posts];
}
