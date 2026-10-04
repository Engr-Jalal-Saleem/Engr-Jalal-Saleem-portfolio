"use server";
/** Server actions for the admin dashboard. Every action re-checks the session cookie. */
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { COOKIE, isValidToken } from "../../lib/auth";
import { COLLECTIONS, getItem, listItems, mode, removeItem, saveItem, saveSingleton, slugify, writeRaw } from "../../lib/store";

async function guard() {
  if (!(await isValidToken((await cookies()).get(COOKIE)?.value))) throw new Error("Not signed in");
}
const done = (msg: string) => ({ ok: true, msg: mode === "github" ? `${msg} Committed to GitHub, live in about a minute.` : msg });

export async function toggleField(collection: string, slug: string, field: "visible" | "featured") {
  await guard();
  const it = await getItem(collection, slug);
  if (!it) throw new Error("Item not found");
  it.data[field] = !it.data[field];
  await saveItem(collection, it);
  revalidatePath("/", "layout");
  return done(`${field === "visible" ? (it.data.visible ? "Shown" : "Hidden") : it.data.featured ? "Featured" : "Unfeatured"}.`);
}

/** Rewrite `order` for a collection from an ordered list of slugs (drag and drop). */
export async function reorder(collection: string, slugs: string[]) {
  await guard();
  const items = await listItems(collection);
  const bySlug = new Map(items.map((i) => [i.slug, i]));
  for (const [i, s] of slugs.entries()) {
    const it = bySlug.get(s);
    if (it && it.data.order !== (i + 1) * 10) { it.data.order = (i + 1) * 10; await saveItem(collection, it); }
  }
  revalidatePath("/", "layout");
  return done("Order saved.");
}

export async function saveEntry(collection: string, slug: string, data: Record<string, unknown>, body?: string) {
  await guard();
  if (!COLLECTIONS[collection]) throw new Error("Unknown collection");
  await saveItem(collection, { slug, data, body });
  revalidatePath("/", "layout");
  return done("Saved.");
}

export async function createEntry(collection: string, title: string) {
  await guard();
  const c = COLLECTIONS[collection];
  const existing = await listItems(collection);
  const template = existing[0]?.data ?? {};
  // blank copy of the first item's shape so every field appears in the editor
  const blank = (v: unknown): unknown => Array.isArray(v) ? [] : typeof v === "boolean" ? (v === true) : typeof v === "number" ? 0 : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blank(x)])) : typeof v === "string" ? "" : null;
  const data = Object.fromEntries(Object.entries(template).map(([k, v]) => [k, blank(v)])) as Record<string, unknown>;
  data[c.titleKey] = title;
  data.visible = true;
  data.order = (existing.length + 1) * 10;
  let slug = slugify(title), n = 2;
  while (existing.some((e) => e.slug === slug)) slug = `${slugify(title)}-${n++}`;
  await saveItem(collection, { slug, data, body: c.ext === "mdoc" ? "## The problem\n\n## The approach\n\n## What I'd do next\n" : undefined });
  revalidatePath("/", "layout");
  redirect(`/admin/${collection}/${slug}`);
}

export async function deleteEntry(collection: string, slug: string) {
  await guard();
  await removeItem(collection, slug);
  revalidatePath("/", "layout");
  redirect(`/admin/${collection}`);
}

export async function saveSettings(name: string, data: Record<string, unknown>) {
  await guard();
  await saveSingleton(name, data);
  revalidatePath("/", "layout");
  return done("Saved.");
}

/** Upload a file into /public and return its public path. */
export async function uploadFile(form: FormData) {
  await guard();
  const f = form.get("file") as File | null;
  const folder = String(form.get("folder") || "uploads").replace(/[^a-z0-9/_-]/gi, "");
  if (!f || f.size === 0) throw new Error("No file");
  if (f.size > 20 * 1024 * 1024) throw new Error("File is over 20 MB");
  const name = f.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
  await writeRaw(`public/${folder}/${name}`, Buffer.from(await f.arrayBuffer()), `admin: upload ${folder}/${name}`);
  return { path: `/${folder}/${name}` };
}
