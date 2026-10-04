"use client";
/** Drag to reorder, one-click show/hide and feature, search. Order saves when you drop. */
import Link from "next/link";
import { Reorder, useDragControls } from "framer-motion";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { reorder, toggleField } from "../../app/admin/actions";
import { useToast } from "./Toast";

export type Row = { slug: string; title: string; meta: string; visible: boolean; featured: boolean | null };

function Item({ row, collection, onToggle, dragDisabled }: { row: Row; collection: string; onToggle: (slug: string, f: "visible" | "featured") => void; dragDisabled: boolean }) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={row.slug} dragListener={false} dragControls={controls} className={`row${row.visible ? "" : " hidden"}`}
      whileDrag={{ scale: 1.02, boxShadow: "0 20px 40px -20px #000", borderColor: "#ffb347" }}>
      <span className="grip" aria-label="Drag to reorder" onPointerDown={(e) => !dragDisabled && controls.start(e)} style={{ opacity: dragDisabled ? 0.3 : 1 }}>⋮⋮</span>
      <Link className="t" href={`/admin/${collection}/${row.slug}`}><b>{row.title}</b><small>{row.meta}</small></Link>
      <div className="acts">
        {row.featured !== null && <span className="swl">Home <button type="button" className="sw star" role="switch" aria-checked={row.featured} aria-label="Show on home page" onClick={() => onToggle(row.slug, "featured")} /></span>}
        <span className="swl">Show <button type="button" className="sw" role="switch" aria-checked={row.visible} aria-label="Show on site" onClick={() => onToggle(row.slug, "visible")} /></span>
        <Link className="btn" href={`/admin/${collection}/${row.slug}`}>Edit</Link>
      </div>
    </Reorder.Item>
  );
}

export default function ItemList({ collection, rows: initial }: { collection: string; rows: Row[] }) {
  const [rows, setRows] = useState(initial);
  const [order, setOrder] = useState(initial.map((r) => r.slug));
  const [q, setQ] = useState("");
  const latest = useRef(order), saved = useRef(order.join());
  useEffect(() => { latest.current = order; }, [order]);
  const [pending, start] = useTransition();
  const toast = useToast();
  const bySlug = useMemo(() => new Map(rows.map((r) => [r.slug, r])), [rows]);
  const filtered = order.filter((s) => (bySlug.get(s)?.title + " " + bySlug.get(s)?.meta).toLowerCase().includes(q.toLowerCase()));

  const onToggle = (slug: string, f: "visible" | "featured") => {
    setRows((rs) => rs.map((r) => (r.slug === slug ? { ...r, [f]: !r[f] } : r)));
    start(async () => { try { toast((await toggleField(collection, slug, f)).msg); } catch (e) { toast(String(e), true); } });
  };
  const save = () => start(async () => { try { saved.current = latest.current.join(); toast((await reorder(collection, latest.current)).msg); } catch (e) { toast(String(e), true); } });

  return (
    <>
      <div className="tools">
        <input type="search" id="admin-search" placeholder={`Search ${rows.length} items`} value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 320 }} aria-label="Search" />
        <span className="sub" style={{ margin: 0 }}>{rows.filter((r) => r.visible).length} shown · {rows.filter((r) => !r.visible).length} hidden{q && " · clear search to reorder"}</span>
        {pending && <span className="sub" style={{ margin: 0 }}>Saving…</span>}
      </div>
      <Reorder.Group axis="y" values={order} onReorder={(o) => !q && setOrder(o)} className="list" onPointerUp={() => setTimeout(() => { if (latest.current.join() !== saved.current) save(); }, 50)}>
        {filtered.map((s) => <Item key={s} row={bySlug.get(s)!} collection={collection} onToggle={onToggle} dragDisabled={!!q} />)}
      </Reorder.Group>
    </>
  );
}
