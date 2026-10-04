/**
 * Content store used by the /admin dashboard.
 *
 * Reads always come from the files in /content.
 * Writes go to:
 *  - GitHub (commit to GITHUB_BRANCH) when GITHUB_TOKEN + GITHUB_REPO are set. Use this on Vercel,
 *    where the filesystem is read-only. Vercel redeploys on the commit, so changes go live in ~1 min.
 *  - the local filesystem otherwise (npm run dev).
 */
import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

const ROOT = process.cwd();
const GH = process.env.GITHUB_TOKEN && process.env.GITHUB_REPO
  ? { token: process.env.GITHUB_TOKEN, repo: process.env.GITHUB_REPO, branch: process.env.GITHUB_BRANCH || "main", base: process.env.GITHUB_BASE_DIR ?? "web" }
  : null;

export const mode = GH ? "github" : "local";

export type CollectionDef = { label: string; dir: string; ext: "json" | "mdoc"; titleKey: string; group: string };
export const COLLECTIONS: Record<string, CollectionDef> = {
  chapters: { label: "Story chapters", dir: "content/chapters", ext: "json", titleKey: "title", group: "Story" },
  posts: { label: "Blog posts", dir: "content/posts", ext: "mdoc", titleKey: "title", group: "Story" },
  publications: { label: "Publications", dir: "content/publications", ext: "json", titleKey: "title", group: "Work" },
  projects: { label: "Projects", dir: "content/projects", ext: "mdoc", titleKey: "title", group: "Work" },
  experience: { label: "Experience", dir: "content/experience", ext: "json", titleKey: "role", group: "Work" },
  honors: { label: "Honors", dir: "content/honors", ext: "json", titleKey: "title", group: "Credentials" },
  certificates: { label: "Certificates", dir: "content/certificates", ext: "json", titleKey: "title", group: "Credentials" },
  skills: { label: "Skill groups", dir: "content/skills", ext: "json", titleKey: "group", group: "Credentials" },
};
export const SINGLETONS: Record<string, { label: string; file: string }> = {
  settings: { label: "Site settings", file: "content/settings.json" },
  home: { label: "Home page", file: "content/home.json" },
};

export type Item = { slug: string; data: Record<string, unknown>; body?: string };

function parse(raw: string, ext: "json" | "mdoc"): { data: Record<string, unknown>; body?: string } {
  if (ext === "json") return { data: JSON.parse(raw) };
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return m ? { data: YAML.parse(m[1]) ?? {}, body: m[2] } : { data: {}, body: raw };
}
function serialize(item: { data: Record<string, unknown>; body?: string }, ext: "json" | "mdoc") {
  if (ext === "json") return JSON.stringify(item.data, null, 2) + "\n";
  return `---\n${YAML.stringify(item.data).trimEnd()}\n---\n${item.body ?? ""}`;
}

/* ---------- reads ----------
 * On Vercel with a token, read straight from GitHub so admin saves show up in seconds
 * without a rebuild. Responses are cached under the "content" tag; every admin save
 * calls revalidateTag("content"). Locally, read the files on disk.
 */
async function ghList(dir: string): Promise<{ name: string; path: string }[]> {
  const url = `https://api.github.com/repos/${GH!.repo}/contents/${[GH!.base, dir].filter(Boolean).join("/")}?ref=${GH!.branch}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${GH!.token}`, Accept: "application/vnd.github+json" }, next: { tags: ["content"], revalidate: 3600 } });
  if (!res.ok) return [];
  return res.json();
}
async function ghRead(rel: string): Promise<string | null> {
  const url = `https://api.github.com/repos/${GH!.repo}/contents/${[GH!.base, rel].filter(Boolean).join("/")}?ref=${GH!.branch}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${GH!.token}`, Accept: "application/vnd.github.raw+json" }, next: { tags: ["content"], revalidate: 3600 } });
  return res.ok ? res.text() : null;
}
/** Fresh reads for the admin (never cached), cached reads for the public site. */
async function readText(rel: string, fresh = false): Promise<string | null> {
  if (GH) {
    if (fresh) {
      const r = await gh("GET", rel).catch(() => null);
      return r ? Buffer.from(r.content, "base64").toString("utf8") : null;
    }
    return ghRead(rel);
  }
  return fs.readFile(path.join(ROOT, rel), "utf8").catch(() => null);
}
async function listNames(dir: string, fresh = false): Promise<string[]> {
  if (GH) {
    if (fresh) {
      const r = await gh("GET", dir).catch(() => null);
      return Array.isArray(r) ? r.map((x: { name: string }) => x.name) : [];
    }
    return (await ghList(dir)).map((x) => x.name);
  }
  return fs.readdir(path.join(ROOT, dir)).catch(() => [] as string[]);
}

export async function listItems(name: string, fresh = true): Promise<Item[]> {
  const c = COLLECTIONS[name];
  const files = (await listNames(c.dir, fresh)).filter((f) => f.endsWith("." + c.ext));
  const items = await Promise.all(files.map(async (f) => {
    const raw = await readText(`${c.dir}/${f}`, fresh);
    if (raw === null) return null;
    try { return { slug: f.replace(/\.[^.]+$/, ""), ...parse(raw, c.ext) }; } catch { return null; } // a broken file is skipped, never fatal
  }));
  return (items.filter(Boolean) as Item[]).sort((a, b) => Number(a.data.order ?? 100) - Number(b.data.order ?? 100));
}

export async function getItem(name: string, slug: string, fresh = true): Promise<Item | null> {
  const c = COLLECTIONS[name];
  const raw = await readText(`${c.dir}/${slug}.${c.ext}`, fresh);
  if (raw === null) return null;
  try { return { slug, ...parse(raw, c.ext) }; } catch { return null; }
}

export async function getSingleton(name: string, fresh = true) {
  const raw = await readText(SINGLETONS[name].file, fresh);
  return (raw ? JSON.parse(raw) : {}) as Record<string, unknown>;
}

/* ---------- writes ---------- */

async function gh(method: string, rel: string, body?: unknown) {
  const url = `https://api.github.com/repos/${GH!.repo}/contents/${[GH!.base, rel].filter(Boolean).join("/")}`;
  const res = await fetch(method === "GET" ? `${url}?ref=${GH!.branch}` : url, {
    method, cache: "no-store",
    headers: { Authorization: `Bearer ${GH!.token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (method === "GET" && res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub ${method} ${rel}: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function writeRaw(rel: string, content: Buffer | string, message: string) {
  const buf = typeof content === "string" ? Buffer.from(content) : content;
  if (GH) {
    const cur = await gh("GET", rel);
    await gh("PUT", rel, { message, branch: GH.branch, content: buf.toString("base64"), sha: cur?.sha });
  } else {
    await fs.mkdir(path.dirname(path.join(ROOT, rel)), { recursive: true });
    await fs.writeFile(path.join(ROOT, rel), buf);
  }
}

export async function deleteRaw(rel: string, message: string) {
  if (GH) {
    const cur = await gh("GET", rel);
    if (cur) await gh("DELETE", rel, { message, branch: GH.branch, sha: cur.sha });
  } else {
    await fs.rm(path.join(ROOT, rel), { force: true });
  }
}

export const saveItem = (name: string, item: Item) => {
  const c = COLLECTIONS[name];
  return writeRaw(`${c.dir}/${item.slug}.${c.ext}`, serialize(item, c.ext), `admin: update ${name}/${item.slug}`);
};
export const removeItem = (name: string, slug: string) => {
  const c = COLLECTIONS[name];
  return deleteRaw(`${c.dir}/${slug}.${c.ext}`, `admin: delete ${name}/${slug}`);
};
export const saveSingleton = (name: string, data: Record<string, unknown>) =>
  writeRaw(SINGLETONS[name].file, JSON.stringify(data, null, 2) + "\n", `admin: update ${name}`);

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "item";
