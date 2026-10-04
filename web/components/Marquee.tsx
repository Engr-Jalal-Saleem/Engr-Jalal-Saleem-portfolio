"use client";
/** Infinite marquee whose speed and skew react to scroll velocity. */
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, useReducedMotion } from "framer-motion";
import { useRef } from "react";

export default function Marquee({ items, speed = 40 }: { items: string[]; speed?: number }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [-1500, 0, 1500], [-4, 1, 4], { clamp: false });
  const skew = useTransform(vel, [-2000, 2000], [8, -8]);
  const dir = useRef(1);
  useAnimationFrame((_, dt) => {
    if (reduce) return;
    const f = factor.get(); if (f < 0) dir.current = -1; else if (f > 0) dir.current = 1;
    base.set(base.get() + dir.current * (speed * (dt / 1000)) * (1 + Math.abs(f)));
  });
  const x = useTransform(base, (v) => `${-((v % 50) + 50) % 50}%`);
  const row = items.map((t, i) => <span key={i} className="mq-i">{t}<i>✦</i></span>);
  return (
    <div className="mq" aria-label={items.join(", ")}>
      <motion.div className="mq-track" style={{ x, skewX: reduce ? 0 : skew }} aria-hidden>{row}{row}</motion.div>
    </div>
  );
}
