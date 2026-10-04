"use client";
/** Headline that rises in word by word from behind a mask. `em` words render in the serif accent. */
import { motion, useReducedMotion } from "framer-motion";

export default function SplitText({ text, em, as: Tag = "h2", className, delay = 0 }: { text: string; em?: string; as?: "h1" | "h2"; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  const words = [...text.split(" ").map((w) => ({ w, em: false })), ...(em ? em.split(" ").map((w) => ({ w, em: true })) : [])];
  const M = motion[Tag];
  if (reduce) return <Tag className={className}>{text} {em && <em>{em}</em>}</Tag>;
  return (
    <M className={className} initial="hide" whileInView="show" viewport={{ once: true, margin: "0px 0px -10% 0px" }} aria-label={`${text} ${em ?? ""}`.trim()}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}>
      {words.map((x, i) => (
        <span key={i} aria-hidden style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.12em", marginBottom: "-0.12em" }}>
          <motion.span style={{ display: "inline-block" }} variants={{ hide: { y: "110%", rotate: 4 }, show: { y: "0%", rotate: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}>
            {x.em ? <em>{x.w}</em> : x.w}{i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </M>
  );
}
