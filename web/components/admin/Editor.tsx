"use client";
/**
 * Generic form editor. It builds inputs from the shape of the JSON, so any field
 * added to a content file shows up here automatically. Known keys get selects,
 * file uploads or hints.
 */
import { motion } from "framer-motion";
import { useRef, useState, useTransition, type ReactNode } from "react";
import { saveEntry, saveSettings, uploadFile, deleteEntry } from "../../app/admin/actions";
import { useToast } from "./Toast";

type V = unknown;
const FONTS = ["Bricolage Grotesque", "Space Grotesk", "Sora", "Syne", "Unbounded", "Archivo", "Manrope", "Outfit", "Plus Jakarta Sans", "Inter Tight", "DM Sans", "IBM Plex Sans", "Fraunces", "Playfair Display", "Instrument Serif", "Newsreader", "JetBrains Mono", "IBM Plex Mono", "Space Mono", "Geist Mono"];
const SELECT: Record<string, string[]> = {
  defaultMode: ["dark", "light"], displayFont: FONTS, bodyFont: FONTS, monoFont: FONTS, accentFont: FONTS,
  status: ["published", "accepted", "under-review", "in-preparation", "thesis", "deployed", "prototype", "built", "employer", "concept"],
  category: ["AI & ML", "Embedded & IoT", "Security", "Cloud & Data", "Research", "Professional"],
  mapPlace: ["Lahore", "Thuwal", "Beijing", "Riyadh", "Faisalabad", "Karachi", "none"],
};
const MULTI: Record<string, string[]> = {
  categories: ["space", "embedded", "vision", "ai", "research", "concept"],
  sections: ["story", "stats", "research", "publications", "projects", "certificates", "contact"],
};
const FILES: Record<string, string> = { cover: "images/projects", image: "images/story", file: "certificates", cvFile: "files", photo: "images", pdf: "papers", gallery: "images/projects", video: "videos" };
const HINT: Record<string, string> = {
  authors: "Wrap your own name in **double stars** to make it bold.",
  visible: "Untick to hide from the site without deleting.",
  order: "Lower numbers show first. You can also drag rows in the list.",
  featured: "Show this on the home page.",
  minor: "Show small, at the bottom of the timeline.",
  introHighlight: "These exact words in the intro turn amber.",
  bibtex: "Paste the BibTeX. A button appears on the paper card.",
  link: "DOI, IEEE Xplore, Zenodo or any public link.",
  date: "Format YYYY-MM-DD. Newest posts show first.",
  radius: "Corner roundness in pixels, 0 to 32.",
  marqueeSpeed: "0 stops it. 0.8 is calm. 2 is fast.",
  defaultMode: "What first-time visitors see. Their own toggle choice still wins.",
  accent: "Main highlight colour (buttons, italic words).",
  accent2: "Second highlight colour (labels, links, globe).",
  photo: "A square, professional headshot works best.",
  draft: "Drafts are saved but not shown on the site.",
  excerpt: "One or two sentences shown on the blog list.",
};
const human = (k: string) => k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

function Upload({ folder, onDone }: { folder: string; onDone: (p: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, start] = useTransition();
  const toast = useToast();
  return (
    <>
      <input ref={ref} type="file" hidden onChange={(e) => {
        const f = e.target.files?.[0]; if (!f) return;
        const fd = new FormData(); fd.append("file", f); fd.append("folder", folder);
        start(async () => { try { const r = await uploadFile(fd); onDone(r.path); toast("Uploaded " + r.path); } catch (err) { toast(String(err), true); } });
      }} />
      <button type="button" className="btn" disabled={busy} onClick={() => ref.current?.click()}>{busy ? "Uploading…" : "Upload file"}</button>
    </>
  );
}

function Field({ k, v, set, path }: { k: string; v: V; set: (v: V) => void; path: string }): ReactNode {
  const id = path.replace(/[^a-z0-9]/gi, "-");
  const wrap = (child: ReactNode) => (
    <div className="fld"><label htmlFor={id}>{human(k)}</label>{child}{HINT[k] && <span className="hint">{HINT[k]}</span>}</div>
  );
  if (typeof v === "boolean") return (
    <div className="fld"><span className="swl" style={{ fontSize: 12 }}><button id={id} type="button" className="sw" role="switch" aria-checked={v} onClick={() => set(!v)} /> {human(k)}</span>{HINT[k] && <span className="hint">{HINT[k]}</span>}</div>
  );
  if (typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v)) return wrap(
    <div className="tools" style={{ margin: 0 }}>
      <input id={id} type="color" value={v} onChange={(e) => set(e.target.value)} style={{ width: 54, height: 38, padding: 2, background: "transparent", border: "1px solid var(--line)", borderRadius: 8 }} />
      <input type="text" value={v} onChange={(e) => set(e.target.value)} style={{ maxWidth: 120, fontFamily: "var(--f-mono)" }} aria-label={`${k} hex`} />
    </div>
  );
  if (typeof v === "number" || k === "order" || k === "year" || k === "decimals" || k === "value") return wrap(
    <input id={id} type="number" step="any" value={v === null || v === undefined ? "" : String(v)} onChange={(e) => set(e.target.value === "" ? null : Number(e.target.value))} style={{ maxWidth: 200 }} />
  );
  if (SELECT[k]) return wrap(
    <select id={id} value={String(v ?? "")} onChange={(e) => set(e.target.value)} style={{ maxWidth: 260 }}>{SELECT[k].map((o) => <option key={o}>{o}</option>)}</select>
  );
  if (MULTI[k] && Array.isArray(v)) return wrap(
    <div className="tools" style={{ margin: 0 }}>{MULTI[k].map((o) => (
      <span key={o} className="swl"><button type="button" className="sw" role="switch" aria-checked={v.includes(o)} aria-label={o}
        onClick={() => set(v.includes(o) ? v.filter((x) => x !== o) : [...v, o])} /> {o}</span>
    ))}</div>
  );
  if (FILES[k] && !Array.isArray(v)) return wrap(
    <div style={{ display: "grid", gap: 8 }}>
      {typeof v === "string" && /\.(webp|png|jpe?g|gif|avif)$/i.test(v) && <img src={v} alt="" className="preview" />}
      <div className="tools" style={{ margin: 0 }}>
        <input id={id} type="text" value={String(v ?? "")} placeholder="/path or https://" onChange={(e) => set(e.target.value || null)} />
        <Upload folder={FILES[k]} onDone={set} />
        {v ? <button type="button" className="btn danger" onClick={() => set(null)}>Remove</button> : null}
      </div>
    </div>
  );
  if (Array.isArray(v)) {
    const isObj = v.length > 0 && typeof v[0] === "object" && v[0] !== null;
    const tmpl = isObj ? Object.fromEntries(Object.entries(v[0] as object).map(([kk, x]) => [kk, typeof x === "boolean" ? true : typeof x === "number" ? 0 : ""])) : "";
    const move = (i: number, d: number) => { const n = [...v]; const [x] = n.splice(i, 1); n.splice(i + d, 0, x); set(n); };
    return wrap(
      <div style={{ display: "grid", gap: 8 }}>
        {v.map((item, i) => (
          <motion.div layout key={i} className="arr-item">
            {isObj ? (
              <div className="obj">{Object.entries(item as Record<string, V>).map(([kk, vv]) => (
                <Field key={kk} k={kk} v={vv} path={`${path}.${i}.${kk}`} set={(nv) => { const n = [...v]; n[i] = { ...(item as object), [kk]: nv }; set(n); }} />
              ))}</div>
            ) : FILES[k] ? (
              <div className="tools" style={{ margin: 0 }}>
                {typeof item === "string" && <img src={item} alt="" className="preview" style={{ maxWidth: 120 }} />}
                <input type="text" value={String(item ?? "")} onChange={(e) => { const n = [...v]; n[i] = e.target.value; set(n); }} aria-label={`${k} ${i + 1}`} />
                <Upload folder={FILES[k]} onDone={(p) => { const n = [...v]; n[i] = p; set(n); }} />
              </div>
            ) : (
              <input type="text" value={String(item ?? "")} onChange={(e) => { const n = [...v]; n[i] = e.target.value; set(n); }} aria-label={`${k} ${i + 1}`} />
            )}
            <div className="mini">
              <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
              <button type="button" aria-label="Move down" disabled={i === v.length - 1} onClick={() => move(i, 1)}>↓</button>
              <button type="button" aria-label="Remove" onClick={() => set(v.filter((_, j) => j !== i))}>✕</button>
            </div>
          </motion.div>
        ))}
        <div><button type="button" className="btn" onClick={() => set([...v, structuredClone(tmpl)])}>+ Add {human(k).toLowerCase().replace(/s$/, "")}</button></div>
      </div>
    );
  }
  if (v && typeof v === "object") return wrap(
    <div className="obj">{Object.entries(v as Record<string, V>).map(([kk, vv]) => (
      <Field key={kk} k={kk} v={vv} path={`${path}.${kk}`} set={(nv) => set({ ...(v as object), [kk]: nv })} />
    ))}</div>
  );
  const s = String(v ?? "");
  const long = s.length > 90 || ["body", "summary", "description", "intro", "role", "researchQuestion", "bibtex", "detail"].includes(k);
  return wrap(long
    ? <textarea id={id} value={s} onChange={(e) => set(e.target.value)} rows={Math.min(10, Math.max(3, Math.ceil(s.length / 90)))} />
    : <input id={id} type={/url|linkedin|github|scholar|orcid|researchgate|repo|demo|link/i.test(k) ? "url" : "text"} value={s} onChange={(e) => set(e.target.value === "" && v === null ? null : e.target.value)} />);
}

export default function Editor({ kind, name, slug, data: init, body: initBody, viewHref }: { kind: "item" | "singleton"; name: string; slug?: string; data: Record<string, V>; body?: string; viewHref?: string }) {
  const [data, setData] = useState(init);
  const [body, setBody] = useState(initBody);
  const [dirty, setDirty] = useState(false);
  const [pending, start] = useTransition();
  const toast = useToast();
  const set = (k: string) => (v: V) => { setData((d) => ({ ...d, [k]: v })); setDirty(true); };
  const save = () => start(async () => {
    try {
      const r = kind === "item" ? await saveEntry(name, slug!, data, body) : await saveSettings(name, data);
      toast(r.msg); setDirty(false);
    } catch (e) { toast(String(e), true); }
  });
  return (
    <form className="form" onSubmit={(e) => { e.preventDefault(); save(); }}>
      {Object.entries(data).map(([k, v]) => <Field key={k} k={k} v={v} set={set(k)} path={k} />)}
      {body !== undefined && (
        <div className="fld"><label htmlFor="body">{name === "posts" ? "Post text" : "Case study text"}</label>
          <textarea id="body" className="code" value={body} onChange={(e) => { setBody(e.target.value); setDirty(true); }} />
          <span className="hint">Markdown: ## for headings, **bold**, - for lists.</span></div>
      )}
      <div className="sticky">
        <button className="btn pri" type="submit" disabled={pending}>{pending ? "Saving…" : dirty ? "Save changes" : "Saved"}</button>
        {viewHref && <a className="btn" href={viewHref} target="_blank" rel="noreferrer">View on site ↗</a>}
        {kind === "item" && <button type="button" className="btn danger" onClick={() => {
          if (window.prompt(`Type DELETE to remove "${slug}" for good.`) === "DELETE") start(() => deleteEntry(name, slug!));
        }}>Delete</button>}
      </div>
    </form>
  );
}
