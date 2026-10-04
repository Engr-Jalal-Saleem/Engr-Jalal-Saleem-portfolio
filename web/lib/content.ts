/**
 * Content for the public site.
 *
 * Every entry is normalised with safe defaults, so a half-filled item from the admin
 * (blank status, missing year, empty list) renders instead of breaking the build.
 * Hidden items (visible = false) are dropped and the rest sorted by `order`.
 */
import { getSingleton, listItems, getItem } from "./store";

type Raw = Record<string, unknown>;
const str = (v: unknown, d = "") => (typeof v === "string" ? v : v == null ? d : String(v));
const num = (v: unknown, d: number | null = null) => (typeof v === "number" && !Number.isNaN(v) ? v : d);
const bool = (v: unknown, d: boolean) => (typeof v === "boolean" ? v : d);
const arr = <T,>(v: unknown, map: (x: unknown) => T): T[] => (Array.isArray(v) ? v.map(map) : []);
const oneOf = (v: unknown, opts: string[], d: string) => (typeof v === "string" && opts.includes(v) ? v : d);
const nullable = (v: unknown) => (typeof v === "string" && v.trim() ? v : null);

const PUB_STATUS = ["published", "accepted", "under-review", "in-preparation", "thesis"];
const PROJ_STATUS = ["published", "under-review", "deployed", "prototype", "built", "employer", "concept"];

const base = (d: Raw) => ({ visible: bool(d.visible, true), order: num(d.order, 100) });

const norm = {
  chapters: (d: Raw) => ({ ...base(d), title: str(d.title), year: str(d.year), place: str(d.place), body: str(d.body), image: nullable(d.image) }),
  publications: (d: Raw) => ({
    ...base(d), title: str(d.title, "Untitled"), authors: str(d.authors), venue: str(d.venue), year: num(d.year),
    status: oneOf(d.status, PUB_STATUS, "in-preparation"), summary: str(d.summary), keyResult: str(d.keyResult),
    pdf: nullable(d.pdf), link: nullable(d.link), bibtex: str(d.bibtex), project: nullable(d.project), featured: bool(d.featured, false),
  }),
  projects: (d: Raw) => ({
    ...base(d), title: str(d.title, "Untitled"), kicker: str(d.kicker), summary: str(d.summary), categories: arr(d.categories, (x) => str(x)),
    status: oneOf(d.status, PROJ_STATUS, "built"), cover: nullable(d.cover), video: str(d.video), role: str(d.role),
    stack: arr(d.stack, (x) => str(x)).filter(Boolean), results: arr(d.results, (x) => str(x)).filter(Boolean),
    repo: nullable(d.repo), demo: nullable(d.demo), gallery: arr(d.gallery, (x) => nullable(x)), featured: bool(d.featured, false),
  }),
  experience: (d: Raw) => ({
    ...base(d), role: str(d.role), org: str(d.org), location: str(d.location), mapPlace: str(d.mapPlace, "none"),
    start: str(d.start), end: str(d.end), description: str(d.description), minor: bool(d.minor, false),
  }),
  honors: (d: Raw) => ({ ...base(d), title: str(d.title), detail: str(d.detail), year: str(d.year), link: nullable(d.link) }),
  certificates: (d: Raw) => ({
    ...base(d), title: str(d.title), issuer: str(d.issuer), issued: str(d.issued), credentialId: str(d.credentialId),
    url: nullable(d.url), file: nullable(d.file), category: str(d.category, "Professional"), featured: bool(d.featured, false),
  }),
  posts: (d: Raw) => ({
    ...base(d), title: str(d.title, "Untitled"), date: str(d.date), excerpt: str(d.excerpt), tags: arr(d.tags, (x) => str(x)).filter(Boolean),
    cover: nullable(d.cover), featured: bool(d.featured, false), draft: bool(d.draft, false),
  }),
  skills: (d: Raw) => ({ ...base(d), group: str(d.group), items: arr(d.items, (x) => str(x)).filter(Boolean) }),
};
type Norm = typeof norm;

async function all<K extends keyof Norm>(k: K) {
  const items = await listItems(k, false);
  return items
    .map((i) => ({ slug: i.slug, entry: norm[k](i.data) as ReturnType<Norm[K]> }))
    .filter((i) => i.entry.visible)
    .sort((a, b) => (a.entry.order ?? 100) - (b.entry.order ?? 100));
}

export async function getSettings() {
  const d = await getSingleton("settings", false);
  return {
    name: str(d.name, "Jalal Saleem"), headline: str(d.headline), email: str(d.email),
    linkedin: nullable(d.linkedin), github: nullable(d.github), scholar: nullable(d.scholar), orcid: nullable(d.orcid), researchgate: nullable(d.researchgate),
    cvFile: nullable(d.cvFile), seekingNote: str(d.seekingNote),
    nav: arr(d.nav, (x) => { const o = (x ?? {}) as Raw; return { label: str(o.label), href: str(o.href, "/"), visible: bool(o.visible, true) }; }),
  };
}

export async function getHome() {
  const d = await getSingleton("home", false);
  return {
    eyebrow: str(d.eyebrow), intro: str(d.intro), introHighlight: str(d.introHighlight),
    chips: arr(d.chips, (x) => { const o = (x ?? {}) as Raw; return { strong: str(o.strong), rest: str(o.rest), visible: bool(o.visible, true) }; }),
    stats: arr(d.stats, (x) => { const o = (x ?? {}) as Raw; return { value: num(o.value, 0), decimals: num(o.decimals, 0), prefix: str(o.prefix), suffix: str(o.suffix), label: str(o.label), visible: bool(o.visible, true) }; }),
    researchQuestion: str(d.researchQuestion),
    interests: arr(d.interests, (x) => { const o = (x ?? {}) as Raw; return { title: str(o.title), body: str(o.body) }; }),
    sections: arr(d.sections, (x) => str(x)),
  };
}

export const getChapters = () => all("chapters");
export const getPublications = () => all("publications");
export const getExperience = () => all("experience");
export const getHonors = () => all("honors");
export const getCertificates = () => all("certificates");
export const getSkills = () => all("skills");
export const getProjects = () => all("projects");

/** Blog posts, newest first. Drafts are hidden. Reading time is counted from the body. */
export async function getPosts() {
  const items = await listItems("posts", false);
  return items
    .map((i) => ({ slug: i.slug, entry: norm.posts(i.data), minutes: Math.max(1, Math.ceil((i.body ?? "").split(/\s+/).length / 200)) }))
    .filter((p) => p.entry.visible && !p.entry.draft)
    .sort((a, b) => b.entry.date.localeCompare(a.entry.date));
}
export async function getPost(slug: string) {
  const it = await getItem("posts", slug, false);
  if (!it) return null;
  const p = norm.posts(it.data);
  return p.visible && !p.draft ? { ...p, body: it.body ?? "", minutes: Math.max(1, Math.ceil((it.body ?? "").split(/\s+/).length / 200)) } : null;
}

export async function getProject(slug: string) {
  const it = await getItem("projects", slug, false);
  if (!it) return null;
  const p = norm.projects(it.data);
  return p.visible ? { ...p, body: it.body ?? "" } : null;
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
