"use client";
/** Publications with status filter and inline BibTeX. Your name in **stars** is bolded. */
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export type Pub = { slug: string; title: string; authors: string; venue: string; year: number | null; status: string; statusLabel: string; summary: string; keyResult: string; pdf: string | null; link: string | null; bibtex: string; project: string | null };
const F = [["all", "All"], ["published", "Published"], ["under-review", "Under review"], ["thesis", "Thesis"]];

function Authors({ s }: { s: string }) {
  return <p className="au">{s.split(/(\*\*[^*]+\*\*)/).map((part, i) => part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part)}</p>;
}

export default function PubList({ items, filters = true }: { items: Pub[]; filters?: boolean }) {
  const [f, setF] = useState("all");
  const [bib, setBib] = useState<string | null>(null);
  const shown = items.filter((p) => f === "all" || p.status === f || (f === "published" && p.status === "accepted"));
  return (
    <>
      {filters && <div className="filters" role="group" aria-label="Filter publications" style={{ marginBottom: 20 }}>
        {F.map(([v, l]) => <button key={v} type="button" aria-pressed={f === v} onClick={() => setF(v)}>{l}</button>)}
      </div>}
      <div className="pubs">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.article layout key={p.slug} className="pub" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} whileHover={{ x: 6, borderColor: "var(--amber)" }}>
              <div><div className="yr">{p.year}</div><span className={`badge ${p.status}`}>{p.statusLabel}</span></div>
              <div>
                <h3>{p.title}</h3>
                <Authors s={p.authors} />
                <p className="ve">{p.venue}</p>
                <p className="sum">{p.summary}</p>
                {p.keyResult && <div className="key">{p.keyResult}</div>}
                <div className="acts">
                  {p.pdf && <a href={p.pdf} target="_blank" rel="noreferrer">PDF</a>}
                  {p.link && <a href={p.link} target="_blank" rel="noreferrer">Link ↗</a>}
                  {p.bibtex && <button type="button" onClick={() => setBib(bib === p.slug ? null : p.slug)}>BibTeX</button>}
                  {p.project && <a href={`/projects/${p.project}`}>Project page</a>}
                </div>
                {bib === p.slug && <pre>{p.bibtex}</pre>}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
