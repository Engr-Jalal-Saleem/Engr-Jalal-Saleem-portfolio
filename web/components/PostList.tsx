"use client";
/** Editorial post list. Hovering a row floats its cover image after the cursor. */
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useState } from "react";

export type PostRow = { slug: string; title: string; date: string; excerpt: string; tags: string[]; cover: string | null; minutes: number };

export default function PostList({ posts }: { posts: PostRow[] }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<PostRow | null>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 26 }), y = useSpring(useMotionValue(0), { stiffness: 260, damping: 26 });
  return (
    <div className="posts" onPointerMove={(e) => { x.set(e.clientX); y.set(e.clientY); }} onPointerLeave={() => setHover(null)}>
      {posts.map((p, i) => (
        <motion.div key={p.slug} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}>
          <Link href={`/blog/${p.slug}`} className="post-row" data-cursor="READ" onPointerEnter={() => setHover(p)}>
            <span className="post-date">{new Date(p.date + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
            <span className="post-main"><b>{p.title}</b><span>{p.excerpt}</span></span>
            <span className="post-meta">{p.tags.slice(0, 2).join(" · ")}<i>{p.minutes} min</i></span>
          </Link>
        </motion.div>
      ))}
      {!reduce && (
        <AnimatePresence>
          {hover?.cover && (
            <motion.img key={hover.slug} src={hover.cover} alt="" className="post-float" style={{ x, y }}
              initial={{ opacity: 0, scale: 0.8, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.3 }} />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
