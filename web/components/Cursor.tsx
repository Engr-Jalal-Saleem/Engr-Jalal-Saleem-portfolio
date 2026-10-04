"use client";
/**
 * Custom cursor: a dot plus a spring-lagged ring. The ring grows on links and buttons,
 * and shows a label over anything with data-cursor="label". Desktop pointers only.
 */
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function Cursor() {
  const [on, setOn] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 28, mass: 0.6 }), ry = useSpring(y, { stiffness: 350, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setOn(true);
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY);
      const t = (e.target as HTMLElement).closest("a,button,[data-cursor],input,textarea,select,.hero") as HTMLElement | null;
      setHover(!!t && !t.classList.contains("hero"));
      setLabel(t?.closest("[data-cursor]")?.getAttribute("data-cursor") ?? null);
    };
    addEventListener("pointermove", move);
    return () => { removeEventListener("pointermove", move); document.documentElement.classList.remove("has-cursor"); };
  }, [x, y]);

  if (!on) return null;
  return (
    <>
      <motion.div className="cur-dot" style={{ x, y }} />
      <motion.div className="cur-ring" style={{ x: rx, y: ry }} animate={{ width: label ? 84 : hover ? 54 : 30, height: label ? 84 : hover ? 54 : 30, backgroundColor: label ? "var(--amber)" : "rgba(0,0,0,0)" }} transition={{ type: "spring", stiffness: 300, damping: 24 }}>
        <AnimatePresence>{label && <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>{label}</motion.span>}</AnimatePresence>
      </motion.div>
    </>
  );
}
