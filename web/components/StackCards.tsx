"use client";
/** Story as sticky cards: each chapter pins, and earlier ones shrink and dim as the next slides over. */
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { useRef } from "react";
import type { Chapter } from "./StoryRail";

function Card({ c, i, n, progress }: { c: Chapter; i: number; n: number; progress: MotionValue<number> }) {
  const start = i / n;
  const scale = useTransform(progress, [start, 1], [1, 1 - (n - i) * 0.035]);
  const filter = useTransform(progress, [start, Math.min(1, start + 1.5 / n)], ["brightness(1) blur(0px)", "brightness(0.45) blur(1.5px)"]);
  const isNext = c.year.toLowerCase() === "next";
  return (
    <div className="sc-wrap" style={{ top: `calc(90px + ${i * 14}px)` }}>
      <motion.article className={`sc${isNext ? " next" : ""}`} style={{ scale, filter: i === n - 1 ? undefined : filter }}>
        <div className="sc-yr">{c.year}</div>
        <div>
          {c.place && <span className="pl">{c.place}</span>}
          <h3>{c.title}</h3>
          <p>{c.body}</p>
        </div>
        <div className="sc-idx">{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</div>
      </motion.article>
    </div>
  );
}

export default function StackCards({ chapters }: { chapters: Chapter[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <div ref={ref} className="sc-list">
      {chapters.map((c, i) => reduce
        ? <article key={c.slug} className="sc" style={{ marginBottom: 16 }}><div className="sc-yr">{c.year}</div><div><h3>{c.title}</h3><p>{c.body}</p></div></article>
        : <Card key={c.slug} c={c} i={i} n={chapters.length} progress={scrollYProgress} />)}
    </div>
  );
}
