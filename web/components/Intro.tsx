"use client";
/** First-visit countdown overlay: T-3, T-2, T-1, then the curtain lifts. Once per session; skippable. */
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Intro() {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("intro") === "1"; sessionStorage.setItem("intro", "1"); } catch {}
    if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(3);
    const t = [setTimeout(() => setN(2), 450), setTimeout(() => setN(1), 900), setTimeout(() => setN(0), 1350), setTimeout(() => setN(null), 1500)];
    return () => t.forEach(clearTimeout);
  }, []);
  return (
    <AnimatePresence>
      {n !== null && (
        <motion.div className="intro" onClick={() => setN(null)} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
          <span className="intro-k">LAUNCH SEQUENCE · LHR → LEO</span>
          <AnimatePresence mode="wait">
            <motion.b key={n} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -40, opacity: 0 }} transition={{ duration: 0.25 }}>
              {n > 0 ? `T−${n}` : "LIFTOFF"}
            </motion.b>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
