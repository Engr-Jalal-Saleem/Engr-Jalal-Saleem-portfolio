"use client";
/** Number that counts up once when scrolled into view. Server renders the final value. */
import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Counter({ value, decimals = 0, prefix = "", suffix = "" }: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const fmt = (v: number) => prefix + (decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString("en-US")) + suffix;
  const [text, setText] = useState(fmt(value));
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, value, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setText(fmt(v)) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  return <b ref={ref}>{text}</b>;
}
