"use client";
import { motion, useScroll, useSpring } from "framer-motion";
export default function ReadProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return <motion.div className="read-prog" style={{ scaleX }} />;
}
