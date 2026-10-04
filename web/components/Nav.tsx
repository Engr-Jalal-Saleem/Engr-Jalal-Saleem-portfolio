"use client";
/** Top nav with animated active pill, scroll progress bar, theme toggle and mobile menu. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function Nav({ links }: { links: { label: string; href: string }[] }) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const on = () => setScrolled(scrollY > 20);
    on(); addEventListener("scroll", on, { passive: true });
    if (document.documentElement.dataset.theme === "light") setTheme("light");
    return () => removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [path]);

  const toggle = () => {
    const t = theme === "dark" ? "light" : "dark";
    setTheme(t); document.documentElement.dataset.theme = t;
    try { localStorage.setItem("theme", t); } catch {}
  };

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="wrap">
        <Link className="logo" href="/">jalal<span>.</span>saleem</Link>
        <div className={`links${open ? " open" : ""}`}>
          {links.map((l) => {
            const on = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className={on ? "on" : ""}>
                {l.label}
              </Link>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="theme-btn" type="button" onClick={toggle} aria-label="Toggle light and dark theme">{theme === "dark" ? "Light" : "Dark"}</button>
          <button className="menu-btn" type="button" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button>
        </div>
      </div>
      <motion.div className="prog" style={{ scaleX }} />
    </nav>
  );
}
