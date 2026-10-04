"use client";
/** All certificates with category filter and search. */
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

export type Cert = { slug: string; title: string; issuer: string; issued: string; url: string | null; credentialId: string; category: string; file: string | null };

export default function CertList({ items }: { items: Cert[] }) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(items.map((c) => c.category)))], [items]);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const shown = items.filter((c) => (cat === "All" || c.category === cat) && (c.title + " " + c.issuer).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", marginBottom: 20 }}>
        <div className="filters" role="group" aria-label="Filter by category">
          {cats.map((c) => <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>{c} {c === "All" ? items.length : items.filter((i) => i.category === c).length}</button>)}
        </div>
        <input id="cert-search" className="search" placeholder="Search title or issuer" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search certificates" />
      </div>
      <p className="count">{shown.length} shown</p>
      <motion.div layout className="certs">
        <AnimatePresence mode="popLayout">
          {shown.map((c) => {
            const href = c.url || c.file || undefined;
            return (
              <motion.a layout key={c.slug} className="cert" href={href} target="_blank" rel="noreferrer"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} whileHover={{ y: -3 }}>
                <span><b>{c.title}</b><small>{c.issuer} · {c.issued}{c.credentialId ? ` · ID ${c.credentialId.slice(0, 16)}` : ""}</small></span>
                <i>{href ? "VERIFY ↗" : "NO LINK"}</i>
              </motion.a>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
