"use client";
/** Route transition: an amber curtain sweeps across, then the page rises in. */
import { motion, useReducedMotion } from "framer-motion";
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <>
      <motion.div className="curtain" initial={{ clipPath: "inset(0 0 0 0)" }} animate={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }} />
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>
    </>
  );
}
