"use client";
/**
 * Sends page views, time on page, scroll depth and clicks to /api/track.
 * Remembers ?ref=code from tracked links for the whole visit. Skips admin pages
 * and visitors who set Do Not Track or Global Privacy Control.
 */
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const rid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
function store(k: string, v?: string, session = false) {
  try { const st = session ? sessionStorage : localStorage; if (v !== undefined) st.setItem(k, v); return st.getItem(k); } catch { return null; }
}
function send(body: Record<string, unknown>) {
  const data = JSON.stringify(body);
  if (navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([data], { type: "application/json" }));
  else fetch("/api/track", { method: "POST", body: data, keepalive: true }).catch(() => {});
}

export default function Tracker() {
  const path = usePathname();
  const start = useRef(Date.now()), maxScroll = useRef(0), base = useRef<Record<string, unknown> | null>(null);

  useEffect(() => {
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (nav.doNotTrack === "1" || nav.globalPrivacyControl) return;
    let vid = store("jx_vid"); const newVisitor = !vid; if (!vid) vid = store("jx_vid", rid());
    let sid = store("jx_sid", undefined, true); if (!sid) sid = store("jx_sid", rid(), true);
    const q = new URLSearchParams(location.search);
    const refTag = q.get("ref") || store("jx_ref", undefined, true);
    if (q.get("ref")) store("jx_ref", q.get("ref")!, true);
    const utm = ["utm_source", "utm_medium", "utm_campaign"].map((k) => q.get(k)).filter(Boolean).join(" / ");
    base.current = { sid, vid, newVisitor, refTag, utm: utm || undefined, lang: navigator.language, tz: Intl.DateTimeFormat().resolvedOptions().timeZone, screen: `${screen.width}x${screen.height}` };

    const onScroll = () => { const h = document.documentElement.scrollHeight - innerHeight; if (h > 0) maxScroll.current = Math.max(maxScroll.current, Math.round((scrollY / h) * 100)); };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a,button,[data-track]") as HTMLElement | null;
      if (!a || !base.current) return;
      const href = a.getAttribute("href") ?? "";
      const tracked = a.dataset.track || (/^(https?:|mailto:)/.test(href) && !href.includes(location.host)) || a.hasAttribute("download") || /\.(pdf|mp4)$/i.test(href) || /copy/i.test(a.textContent ?? "");
      if (tracked) send({ ...base.current, type: "click", path: location.pathname, target: href || a.dataset.track || "button", label: (a.textContent ?? "").trim().slice(0, 120) });
    };
    const onHide = () => { if (document.visibilityState === "hidden" && base.current) send({ ...base.current, type: "leave", path: location.pathname, dur: Date.now() - start.current, scroll: maxScroll.current }); };
    addEventListener("scroll", onScroll, { passive: true }); addEventListener("click", onClick, true); document.addEventListener("visibilitychange", onHide);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("click", onClick, true); document.removeEventListener("visibilitychange", onHide); };
  }, []);

  useEffect(() => {
    if (!base.current) return;
    // close the previous page, open this one
    if (start.current && maxScroll.current >= 0 && (base.current as { last?: string }).last) send({ ...base.current, type: "leave", path: (base.current as { last?: string }).last, dur: Date.now() - start.current, scroll: maxScroll.current });
    start.current = Date.now(); maxScroll.current = 0;
    send({ ...base.current, type: "view", path, ref: document.referrer && !document.referrer.includes(location.host) ? document.referrer : undefined });
    (base.current as { last?: string }).last = path;
  }, [path]);

  return null;
}
