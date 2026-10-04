"use client";
/** Wraps a link/button so it leans toward the cursor with a spring. */
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import type { ReactNode, PointerEvent } from "react";

export default function Magnetic({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 15 });
  if (reduce) return <>{children}</>;
  const move = (e: PointerEvent<HTMLSpanElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.3);
    y.set((e.clientY - r.top - r.height / 2) * 0.4);
  };
  return (
    <motion.span style={{ x, y, display: "inline-block" }} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); }}>
      {children}
    </motion.span>
  );
}
