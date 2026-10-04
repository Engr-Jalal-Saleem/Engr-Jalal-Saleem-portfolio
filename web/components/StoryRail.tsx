"use client";
/** Vertical story timeline. The rail fills as you scroll and each dot lights up. */
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { useRef } from "react";

export type Chapter = { slug: string; year: string; title: string; place: string; body: string };

export default function StoryRail({ chapters }: { chapters: Chapter[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <div className="story" ref={ref}>
      <span className="rail"><motion.i style={{ scaleY: reduce ? 1 : scaleY }} /></span>
      {chapters.map((c, i) => (
        <motion.article
          key={c.slug}
          className={`ch${c.year.toLowerCase() === "next" ? " next" : ""}`}
          initial={reduce ? false : { opacity: 0.25, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 0.7, delay: 0.05 * (i % 2) }}
        >
          <div className="yr">{c.year}</div>
          <motion.span className="dot" whileInView={{ backgroundColor: "var(--amber)", borderColor: "var(--amber)", scale: [1, 1.6, 1] }} viewport={{ once: true, margin: "0px 0px -30% 0px" }} transition={{ duration: 0.6 }} />
          <div>
            {c.place && <span className="pl">{c.place}</span>}
            <h3>{c.title}</h3>
            <p>{c.body}</p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
