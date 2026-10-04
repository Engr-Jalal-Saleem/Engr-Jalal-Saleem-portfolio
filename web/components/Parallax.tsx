"use client";
/** Image that drifts slower than the page and zooms out slightly as it scrolls. */
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

export default function Parallax({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1.08, 1.18]);
  return (
    <div ref={ref} className="cover">
      <motion.div style={reduce ? { position: "absolute", inset: 0 } : { position: "absolute", inset: 0, y, scale }}>
        <Image src={src} alt={alt} fill priority sizes="(max-width:880px) 100vw, 760px" style={{ objectFit: "cover" }} />
      </motion.div>
    </div>
  );
}
