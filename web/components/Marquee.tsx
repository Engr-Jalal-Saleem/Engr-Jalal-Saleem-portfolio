"use client";
/** Infinite marquee whose speed and skew react to scroll velocity. */
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/** speed = percent of one copy of the strip per second. 0.8 ≈ 50 px per second on desktop. */
export default function Marquee({ items, speed = 0.8 }: { items: string[]; speed?: number }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [-2000, 0, 2000], [-2, 0, 2], { clamp: true });
  const skew = useTransform(vel, [-2500, 2500], [3, -3], { clamp: true });
  const dir = useRef(1);
  useAnimationFrame((_, dt) => {
    if (reduce) return;
    const f = factor.get(); if (f < 0) dir.current = -1; else if (f > 0) dir.current = 1;
    base.set(base.get() + dir.current * (speed * (dt / 1000)) * (1 + Math.abs(f)));
  });
  const x = useTransform(base, (v) => `${-(((v % 50) + 50) % 50)}%`);
  const row = items.map((t, i) => <span key={i} className="mq-i">{t}<i>✦</i></span>);
  return (
    <div className="mq" aria-label={items.join(", ")}>
      <motion.div className="mq-track" style={{ x, skewX: reduce ? 0 : skew }} aria-hidden>{row}{row}</motion.div>
    </div>
  );
}
