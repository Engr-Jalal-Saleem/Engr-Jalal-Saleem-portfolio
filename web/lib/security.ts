/**
 * Rate limiting and a short-lived security log.
 *
 * IP addresses are stored ONLY here, ONLY for security events (failed logins,
 * rate-limit hits, rejected requests), and are deleted automatically after 7 days.
 * Without Redis, rate limiting falls back to per-instance memory and nothing is logged.
 */
import "server-only";
import { redis, redisEnabled } from "./redis";

const LOG = "jx:sec";
const KEEP_MS = 7 * 864e5;

export function clientIp(h: Headers): string {
  return h.get("x-real-ip") || h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

const mem = new Map<string, { n: number; reset: number }>();
/** Returns true if the caller is within `limit` hits per `windowSec`. */
export async function rateLimit(bucket: string, ip: string, limit: number, windowSec: number): Promise<boolean> {
  const key = `jx:rl:${bucket}:${ip}`;
  if (redisEnabled) {
    try {
      const [inc] = await redis([["INCR", key], ["EXPIRE", key, windowSec, "NX"]]);
      return Number(inc.result) <= limit;
    } catch { /* fall through to memory */ }
  }
  const now = Date.now(), m = mem.get(key);
  if (!m || m.reset < now) { mem.set(key, { n: 1, reset: now + windowSec * 1000 }); return true; }
  m.n += 1;
  return m.n <= limit;
}

export type SecEvent = { t: number; ip: string; kind: "login-failed" | "login-ok" | "rate-limited" | "upload-rejected" | "bad-request"; path: string; ua?: string; country?: string; city?: string };

export async function logSecurity(e: Omit<SecEvent, "t">) {
  if (!redisEnabled) return;
  const t = Date.now();
  try {
    await redis([
      ["ZADD", LOG, t, JSON.stringify({ ...e, t, ua: e.ua?.slice(0, 160) })],
      ["ZREMRANGEBYSCORE", LOG, 0, t - KEEP_MS], // auto-delete anything older than 7 days
    ]);
  } catch { /* never break a request over logging */ }
}

export async function securityEvents(): Promise<SecEvent[]> {
  if (!redisEnabled) return [];
  const t = Date.now();
  const [, res] = await redis([["ZREMRANGEBYSCORE", LOG, 0, t - KEEP_MS], ["ZRANGE", LOG, 0, 4999, "REV"]]);
  return ((res.result as string[]) ?? []).map((s) => { try { return JSON.parse(s) as SecEvent; } catch { return null; } }).filter(Boolean) as SecEvent[];
}

export function geo(h: Headers) {
  const d = (v: string | null) => { try { return v ? decodeURIComponent(v) : undefined; } catch { return v ?? undefined; } };
  return { country: h.get("x-vercel-ip-country") ?? undefined, city: d(h.get("x-vercel-ip-city")) };
}
