"use client";
/**
 * Headshot with an orbit ring and a small satellite circling it.
 * With no photo set, shows the initials instead, so the layout never has a hole.
 */
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function Portrait({ src, name, size = 220 }: { src: string | null; name: string; size?: number }) {
  const reduce = useReducedMotion();
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <div className="portrait" style={{ width: size, height: size }}>
      <motion.div className="portrait-orbit" animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
        <span className="portrait-sat" />
      </motion.div>
      <div className="portrait-img">
        {src ? <Image src={src} alt={`Photo of ${name}`} fill sizes={`${size}px`} style={{ objectFit: "cover" }} />
             : <span className="portrait-ph" aria-label={`${name}, photo coming soon`}>{initials}</span>}
      </div>
    </div>
  );
}
