"use client";
/**
 * Hero canvas: ~2,500 "debris" particles assemble into the name. The cursor is a
 * satellite with a keep-out radius that pushes debris away. "Kessler cascade"
 * scatters everything, then it re-forms. Paused when off-screen; static for reduced motion.
 */
import { useEffect, useRef } from "react";

type P = { x: number; y: number; vx: number; vy: number; tx: number; ty: number; amber: boolean };
type O = { ang: number; r: number; s: number };

export default function ParticleHero({ name }: { name: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const burst = useRef<() => void>(() => {});

  useEffect(() => {
    const c = ref.current!;
    const host = c.parentElement!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx: CanvasRenderingContext2D, W = 0, H = 0, P: P[] = [], O: O[] = [];
    let mx = -999, my = -999, mode: "form" | "burst" = "form", visible = true, raf = 0;
    const css = (n: string) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

    function init() {
      const r = c.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      c.width = r.width * d; c.height = r.height * d; W = r.width; H = r.height;
      ctx = c.getContext("2d")!; ctx.setTransform(d, 0, 0, d, 0, 0);
      const off = document.createElement("canvas"); off.width = W; off.height = H;
      const g = off.getContext("2d")!;
      const small = W < 640, words = name.toUpperCase().split(" ");
      const fs = small ? Math.min(W / 4.2, 120) : Math.min(W / (name.length * 0.52), 168);
      g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle";
      g.font = `800 ${fs}px ${getComputedStyle(document.body).fontFamily}`;
      const cy = small ? H * 0.24 : H * 0.32;
      if (small) words.forEach((w, i) => g.fillText(w, W / 2, cy + i * fs * 0.92));
      else g.fillText(name.toUpperCase(), W / 2, cy);
      const data = g.getImageData(0, 0, W, H).data, step = small ? 4 : 5;
      P = [];
      for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step) if (data[(y * W + x) * 4 + 3] > 128) {
        const a = Math.random() * 6.28, rr = Math.max(W, H) * (0.55 + Math.random() * 0.6);
        P.push({ x: reduce ? x : W / 2 + Math.cos(a) * rr, y: reduce ? y : H / 2 + Math.sin(a) * rr, vx: 0, vy: 0, tx: x, ty: y, amber: Math.random() < 0.1 });
      }
      O = Array.from({ length: 220 }, () => ({ ang: Math.random() * 6.28, r: 0.35 + Math.random() * 0.7, s: (0.0006 + Math.random() * 0.0018) * (Math.random() < 0.5 ? 1 : -1) }));
      if (reduce) draw();
    }

    function draw() {
      const bg = css("--bg"), cyan = css("--cyan"), amber = css("--amber"), red = css("--red"), muted = css("--muted"), text = css("--text");
      ctx.globalAlpha = 0.3; ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
      // earth limb glow
      const g = ctx.createRadialGradient(W * 0.8, H * 1.6, H * 0.9, W * 0.8, H * 1.6, H * 1.25);
      g.addColorStop(0, "transparent"); g.addColorStop(0.9, cyan + "22"); g.addColorStop(1, "transparent");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      if (mx > 0) {
        ctx.strokeStyle = cyan; ctx.globalAlpha = 0.45; ctx.setLineDash([3, 5]);
        ctx.beginPath(); ctx.arc(mx, my, 64, 0, 7); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
        ctx.fillStyle = text; ctx.fillRect(mx - 4, my - 4, 8, 8);
        ctx.fillStyle = cyan; ctx.fillRect(mx - 15, my - 2, 9, 4); ctx.fillRect(mx + 6, my - 2, 9, 4);
      }
      ctx.fillStyle = muted; ctx.globalAlpha = 0.4;
      for (const o of O) { o.ang += reduce ? 0 : o.s; const R = Math.max(W, H) * o.r; ctx.fillRect(W * 0.5 + Math.cos(o.ang) * R, H * 0.45 + Math.sin(o.ang) * R * 0.35, 1.4, 1.4); }
      ctx.globalAlpha = 1;
      for (const p of P) {
        if (mode === "form") { p.vx += (p.tx - p.x) * 0.012; p.vy += (p.ty - p.y) * 0.012; }
        const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
        if (d2 < 4096) { const f = ((4096 - d2) / 4096) * 2.4, d = Math.sqrt(d2) || 1; p.vx += (dx / d) * f; p.vy += (dy / d) * f; }
        const k = mode === "form" ? 0.86 : 0.985; p.vx *= k; p.vy *= k; p.x += p.vx; p.y += p.vy;
        const sp = Math.hypot(p.vx, p.vy);
        ctx.fillStyle = p.amber ? amber : sp > 3 ? red : cyan;
        ctx.fillRect(p.x, p.y, 1.8, 1.8);
      }
    }
    const loop = () => { if (visible) draw(); raf = requestAnimationFrame(loop); };

    burst.current = () => {
      mode = "burst";
      P.forEach((p) => { const a = Math.atan2(p.y - H * 0.35, p.x - W / 2) + (Math.random() - 0.5), s = 4 + Math.random() * 10; p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s; });
      setTimeout(() => (mode = "form"), 2400);
      if (reduce) { mode = "form"; }
    };

    const onMove = (e: PointerEvent) => { const r = c.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; };
    const onLeave = () => { mx = my = -999; };
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(t); t = setTimeout(init, 200); };
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(host);
    host.addEventListener("pointermove", onMove); host.addEventListener("pointerleave", onLeave);
    addEventListener("resize", onResize);
    document.fonts.ready.then(() => { init(); if (!reduce) raf = requestAnimationFrame(loop); });
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener("resize", onResize); host.removeEventListener("pointermove", onMove); host.removeEventListener("pointerleave", onLeave); };
  }, [name]);

  return (
    <>
      <canvas ref={ref} role="img" aria-label={`Debris particles that gather into the name ${name}`} />
      <div className="tools"><button className="pill" type="button" onClick={() => burst.current()}>Kessler cascade</button></div>
    </>
  );
}
