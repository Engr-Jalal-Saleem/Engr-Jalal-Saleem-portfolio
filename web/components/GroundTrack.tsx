"use client";
/**
 * Experience as a satellite ground track. As you scroll the job list, the track
 * draws across a world map and "acquires signal" over each place you worked.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";

const LAND: [number, number][][] = [
  [[-168,66],[-140,70],[-95,72],[-62,60],[-55,47],[-80,25],[-97,18],[-80,8],[-105,20],[-125,40],[-130,55],[-168,66]],
  [[-80,8],[-50,0],[-35,-8],[-40,-22],[-58,-38],[-70,-55],[-75,-40],[-72,-18],[-80,-2],[-80,8]],
  [[-17,15],[-10,35],[10,37],[32,31],[43,12],[51,11],[40,-15],[32,-28],[20,-35],[12,-18],[9,4],[-17,15]],
  [[-10,36],[-9,44],[-2,48],[5,58],[25,70],[60,70],[100,78],[140,72],[180,68],[160,58],[140,50],[122,40],[120,22],[108,10],[98,8],[80,8],[72,20],[57,25],[48,30],[35,36],[27,40],[12,44],[-10,36]],
  [[115,-20],[130,-12],[145,-15],[153,-28],[146,-39],[135,-35],[115,-33],[115,-20]],
];
export const PLACES: Record<string, [number, number]> = {
  Lahore: [74.3, 31.5], Thuwal: [39.1, 22.3], Beijing: [116.4, 39.9], Riyadh: [46.7, 24.7], Faisalabad: [73.1, 31.4], Karachi: [67.0, 24.9],
};

export type Stop = { key: string; place: string; content: ReactNode; minor?: boolean };

export default function GroundTrack({ stops }: { stops: Stop[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [aos, setAos] = useState("—");
  const [tplus, setTplus] = useState("T+00:00");

  useEffect(() => {
    const c = canvas.current!, L = list.current!;
    const main = stops.filter((s) => !s.minor && PLACES[s.place]);
    // waypoints: start west of the first place, then each stop in order
    const way: [number, number][] = [[20, 10], ...main.map((s) => PLACES[s.place])];
    if (way.length < 2) way.push([60, 20]);
    const N = 300, pts: [number, number][] = [];
    for (let i = 0; i <= N; i++) {
      const u = (i / N) * (way.length - 1), k = Math.min(way.length - 2, Math.floor(u)), f = u - k, e = f * f * (3 - 2 * f);
      const A = way[k], B = way[k + 1];
      pts.push([A[0] + (B[0] - A[0]) * e + Math.sin(u * 9) * 3, A[1] + (B[1] - A[1]) * e + Math.cos(u * 7) * 3]);
    }
    const css = (n: string) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

    function draw(t: number) {
      const r = c.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      c.width = r.width * d; c.height = r.height * d;
      const x = c.getContext("2d")!; x.setTransform(d, 0, 0, d, 0, 0);
      const W = r.width, H = r.height, px = (l: number) => ((l + 180) / 360) * W, py = (a: number) => ((90 - a) / 180) * H;
      const cyan = css("--cyan"), amber = css("--amber"), line = css("--line"), panel = css("--panel"), muted = css("--muted"), text = css("--text");
      x.fillStyle = css("--map"); x.fillRect(0, 0, W, H);
      x.strokeStyle = line; x.globalAlpha = 0.5;
      for (let i = -180; i <= 180; i += 30) { x.beginPath(); x.moveTo(px(i), 0); x.lineTo(px(i), H); x.stroke(); }
      for (let i = -90; i <= 90; i += 30) { x.beginPath(); x.moveTo(0, py(i)); x.lineTo(W, py(i)); x.stroke(); }
      x.globalAlpha = 1; x.fillStyle = panel; x.strokeStyle = line;
      LAND.forEach((pl) => { x.beginPath(); pl.forEach(([l, a], i) => (i ? x.lineTo(px(l), py(a)) : x.moveTo(px(l), py(a)))); x.closePath(); x.fill(); x.stroke(); });
      x.setLineDash([3, 5]); x.strokeStyle = muted; x.globalAlpha = 0.5;
      x.beginPath(); pts.forEach(([l, a], i) => (i ? x.lineTo(px(l), py(a)) : x.moveTo(px(l), py(a)))); x.stroke();
      x.setLineDash([]); x.globalAlpha = 1;
      const m = Math.round(t * N);
      x.strokeStyle = amber; x.lineWidth = 2; x.shadowColor = amber; x.shadowBlur = 10;
      x.beginPath(); pts.slice(0, m + 1).forEach(([l, a], i) => (i ? x.lineTo(px(l), py(a)) : x.moveTo(px(l), py(a)))); x.stroke();
      x.shadowBlur = 0; x.lineWidth = 1;
      const [sl, sa] = pts[m];
      x.strokeStyle = cyan; x.globalAlpha = 0.6; x.beginPath(); x.arc(px(sl), py(sa), W * 0.05, 0, 7); x.stroke(); x.globalAlpha = 1;
      x.fillStyle = text; x.fillRect(px(sl) - 4, py(sa) - 4, 8, 8);
      x.font = "600 11px ui-monospace, monospace";
      let near = "—";
      new Set(main.map((s) => s.place)).forEach((n) => {
        const [l, a] = PLACES[n]; const on = Math.hypot(px(l) - px(sl), py(a) - py(sa)) < W * 0.05;
        if (on) near = n.toUpperCase();
        x.fillStyle = on ? amber : cyan; x.beginPath(); x.arc(px(l), py(a), on ? 6 : 3.5, 0, 7); x.fill();
        x.fillText(n.toUpperCase(), px(l) + 8, py(a) - 8);
      });
      setAos(near);
      setTplus("T+" + String(Math.floor(t * 96)).padStart(2, "0") + ":" + String(Math.floor(t * 5760) % 60).padStart(2, "0"));
    }

    let last = -1;
    const onScroll = () => {
      const r = L.getBoundingClientRect();
      const t = Math.max(0, Math.min(1, (innerHeight * 0.55 - r.top) / r.height));
      if (Math.abs(t - last) > 0.002) { last = t; draw(t); }
      const kids = [...L.children] as HTMLElement[];
      let best = 0, bd = Infinity;
      kids.forEach((k, i) => { const kr = k.getBoundingClientRect(); const dd = Math.abs(kr.top + kr.height / 2 - innerHeight * 0.5); if (dd < bd) { bd = dd; best = i; } });
      setActive(best);
    };
    const onResize = () => { last = -1; onScroll(); };
    addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onResize);
    const mo = new MutationObserver(onResize); mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    draw(0); onScroll();
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onResize); mo.disconnect(); };
  }, [stops]);

  return (
    <div className="gt">
      <div className="mapbox">
        <canvas ref={canvas} role="img" aria-label="World map with a ground track passing over the places I have worked" />
        <div className="ro"><span>AOS <b>{aos}</b></span><span>{tplus}</span></div>
      </div>
      <div className="jobs" ref={list}>
        {stops.map((s, i) => <div key={s.key} className={`job${s.minor ? " minor" : ""}${i === active ? " on" : ""}`}>{s.content}</div>)}
      </div>
    </div>
  );
}
