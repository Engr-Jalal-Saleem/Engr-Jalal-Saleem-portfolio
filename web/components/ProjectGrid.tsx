"use client";
/** Filterable project grid. Tiles animate in and out with layout transitions. */
import Image from "next/image";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { useState } from "react";
import Tilt from "./Tilt";

export type Proj = { slug: string; title: string; kicker: string; summary: string; categories: string[]; status: string; statusLabel: string; cover: string | null };
const CATS = [["all", "All"], ["space", "Space"], ["embedded", "Embedded"], ["vision", "Vision"], ["ai", "AI"], ["research", "Research"], ["concept", "Concept"]];

export default function ProjectGrid({ items, filters = true }: { items: Proj[]; filters?: boolean }) {
  const [cat, setCat] = useState("all");
  const shown = items.filter((p) => cat === "all" || p.categories.includes(cat));
  return (
    <>
      {filters && (
        <div className="filters" role="group" aria-label="Filter projects" style={{ marginBottom: 24 }}>
          {CATS.map(([v, l]) => <button key={v} type="button" aria-pressed={cat === v} onClick={() => setCat(v)}>{l}</button>)}
        </div>
      )}
      <LayoutGroup>
        <div className="grid">
          <AnimatePresence mode="popLayout">
            {shown.map((p) => (
              <Tilt key={p.slug} href={`/projects/${p.slug}`}>
                <span className="st">{p.statusLabel}</span>
                <div className="img">{p.cover && <Image src={p.cover} alt="" fill sizes="(max-width:540px) 100vw, (max-width:900px) 50vw, 380px" />}</div>
                <div className="cap"><small>{p.kicker}</small><b>{p.title}</b><span>{p.summary}</span></div>
              </Tilt>
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </>
  );
}
