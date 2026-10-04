import { NextResponse } from "next/server";
import { isBot, parseUA, record, type Ev } from "../../../lib/analytics";
import { clientIp, geo, logSecurity, rateLimit } from "../../../lib/security";

const s = (v: unknown, max = 300) => (typeof v === "string" ? v.slice(0, max) : undefined);
const n = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v) : undefined);
const dec = (v: string | null) => { try { return v ? decodeURIComponent(v) : undefined; } catch { return v ?? undefined; } };

export async function POST(req: Request) {
  const ua = req.headers.get("user-agent") ?? "";
  if (isBot(ua)) return new NextResponse(null, { status: 204 });
  const ip = clientIp(req.headers);
  // 120 events per minute per IP is far above any real visitor; beyond that it is spam
  if (!(await rateLimit("track", ip, 120, 60))) {
    if (await rateLimit("track-log", ip, 1, 300)) await logSecurity({ ip, kind: "rate-limited", path: "/api/track", ua, ...geo(req.headers) });
    return new NextResponse(null, { status: 429 });
  }
  const raw = await req.text();
  if (raw.length > 4000) return new NextResponse(null, { status: 413 });
  let b: Record<string, unknown>;
  try { b = JSON.parse(raw); } catch { return new NextResponse(null, { status: 400 }); }
  const type = b.type === "leave" || b.type === "click" ? b.type : "view";
  const ev: Ev = {
    t: Date.now(), type, path: s(b.path, 200) ?? "/", sid: s(b.sid, 40) ?? "", vid: s(b.vid, 40) ?? "", newVisitor: b.newVisitor === true,
    ref: s(b.ref), refTag: s(b.refTag, 80), utm: s(b.utm), target: s(b.target), label: s(b.label, 120), dur: n(b.dur), scroll: n(b.scroll),
    lang: s(b.lang, 20), tz: s(b.tz, 60), screen: s(b.screen, 20),
    // Vercel adds these geo headers on every request. No IP address is stored.
    country: req.headers.get("x-vercel-ip-country") ?? undefined,
    region: dec(req.headers.get("x-vercel-ip-country-region")),
    city: dec(req.headers.get("x-vercel-ip-city")),
    ...parseUA(ua),
  };
  try { await record(ev); } catch { /* analytics must never break the site */ }
  return new NextResponse(null, { status: 204 });
}
