/**
 * Server-side content access. Everything the site shows comes through here,
 * so hidden items (visible = false) and ordering are handled in one place.
 */
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../keystatic.config";

export const reader = createReader(process.cwd(), keystaticConfig);

type Ordered = { visible: boolean; order: number | null };

/** Drop hidden entries and sort by `order` ascending. */
function shown<T extends { entry: Ordered }>(items: T[]): T[] {
  return items
    .filter((i) => i.entry.visible)
    .sort((a, b) => (a.entry.order ?? 100) - (b.entry.order ?? 100));
}

export const getSettings = () => reader.singletons.settings.readOrThrow();
export const getHome = () => reader.singletons.home.readOrThrow();

export const getChapters = async () => shown(await reader.collections.chapters.all());
export const getPublications = async () => shown(await reader.collections.publications.all());
export const getExperience = async () => shown(await reader.collections.experience.all());
export const getHonors = async () => shown(await reader.collections.honors.all());
export const getCertificates = async () => shown(await reader.collections.certificates.all());
export const getSkills = async () => shown(await reader.collections.skills.all());

/** Projects without the Markdoc body, for listings. */
export const getProjects = async () => shown(await reader.collections.projects.all());

export async function getProject(slug: string) {
  const p = await reader.collections.projects.read(slug, { resolveLinkedFiles: true });
  return p && p.visible ? p : null;
}

export const STATUS_LABEL: Record<string, string> = {
  published: "Published",
  accepted: "Accepted",
  "under-review": "Under review",
  "in-preparation": "In preparation",
  thesis: "Thesis",
  deployed: "Deployed",
  prototype: "Prototype",
  built: "Built",
  employer: "Employer work",
  concept: "Concept, not built yet",
};
