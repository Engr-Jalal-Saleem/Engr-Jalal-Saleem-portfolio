"use client";
/** Pinned section: vertical scroll drives a horizontal ride through featured projects. */
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Proj } from "./ProjectGrid";

export default function HorizontalProjects({ items }: { items: Proj[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [dist, setDist] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const x = useTransform(p, [0, 1], [0, -dist]);
  useEffect(() => {
    const m = () => setDist(Math.max(0, (track.current?.scrollWidth ?? 0) - innerWidth + 32));
    m(); addEventListener("resize", m); return () => removeEventListener("resize", m);
  }, [items.length]);
  if (reduce) return <div className="hp-static">{items.map((p) => <Card key={p.slug} p={p} />)}</div>;
  return (
    <div ref={ref} className="hp" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="hp-sticky">
        <motion.div ref={track} className="hp-track" style={{ x }}>{items.map((p, i) => <Card key={p.slug} p={p} i={i} />)}</motion.div>
        <div className="hp-bar"><motion.i style={{ scaleX: p }} /></div>
      </div>
    </div>
  );
}

function Card({ p, i = 0 }: { p: Proj; i?: number }) {
  return (
    <Link href={`/projects/${p.slug}`} className="hp-card" data-cursor="VIEW">
      <div className="hp-img">{p.cover && <Image src={p.cover} alt="" fill sizes="560px" />}</div>
      <div className="hp-cap"><span className="hp-n">{String(i + 1).padStart(2, "0")}</span><div><small>{p.kicker} · {p.statusLabel}</small><b>{p.title}</b><span>{p.summary}</span></div></div>
    </Link>
  );
}
