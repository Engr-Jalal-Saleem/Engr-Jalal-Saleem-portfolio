"use client";
/** 3D tilt with spring physics and a cursor-following glare. */
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { ReactNode, PointerEvent } from "react";

export default function Tilt({ href, children }: { href: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5), py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [8, -8]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(px, [0, 1], [-10, 10]), { stiffness: 200, damping: 18 });
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
    px.set(fx); py.set(fy);
    e.currentTarget.style.setProperty("--gx", fx * 100 + "%");
    e.currentTarget.style.setProperty("--gy", fy * 100 + "%");
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.35 }}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      onPointerMove={reduce ? undefined : move}
      onPointerLeave={() => { px.set(0.5); py.set(0.5); }}
      whileHover={reduce ? undefined : { boxShadow: "0 30px 60px -25px rgba(0,0,0,.7)" }}
      className="tile-wrap"
    >
      <Link href={href} className="tile">{children}<span className="glare" /></Link>
    </motion.div>
  );
}
