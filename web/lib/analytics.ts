/**
 * First-party analytics stored in Upstash Redis (free tier via Vercel Marketplace).
 * No cookies, no raw IP stored. A random visitor id lives in the visitor's localStorage.
 * Env: KV_REST_API_URL + KV_REST_API_TOKEN (Vercel) or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.
 */
import "server-only";

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
export const analyticsEnabled = Boolean(URL_ && TOKEN);
const KEY = "jx:events";
const MAX = 50000;

export type Ev = {
  t: number; type: "view" | "leave" | "click"; path: string; sid: string; vid: string; newVisitor?: boolean;
  ref?: string; refTag?: string; utm?: string; target?: string; label?: string; dur?: number; scroll?: number;
  country?: string; region?: string; city?: string; device?: string; os?: string; browser?: string; lang?: string; tz?: string; screen?: string;
};

async function redis(cmds: (string | number)[][]) {
  const r = await fetch(`${URL_}/pipeline`, { method: "POST", headers: { Authorization: `Bearer ${TOKEN}` }, body: JSON.stringify(cmds), cache: "no-store" });
  if (!r.ok) throw new Error(`Redis ${r.status}`);
  return (await r.json()) as { result: unknown }[];
}

export async function record(ev: Ev) {
  if (!analyticsEnabled) return;
  await redis([["LPUSH", KEY, JSON.stringify(ev)], ["LTRIM", KEY, 0, MAX - 1]]);
}

export async function recent(n = 20000): Promise<Ev[]> {
  if (!analyticsEnabled) return [];
  const [res] = await redis([["LRANGE", KEY, 0, n - 1]]);
  return ((res.result as string[]) ?? []).map((s) => { try { return JSON.parse(s) as Ev; } catch { return null; } }).filter(Boolean) as Ev[];
}

export async function clearAll() {
  if (analyticsEnabled) await redis([["DEL", KEY]]);
}

/* ---------- request enrichment ---------- */
export function parseUA(ua: string) {
  const device = /iPad|Tablet/i.test(ua) ? "Tablet" : /Mobi|Android|iPhone/i.test(ua) ? "Mobile" : "Desktop";
  const os = /Windows/i.test(ua) ? "Windows" : /Mac OS X|Macintosh/i.test(ua) && !/iPhone|iPad/i.test(ua) ? "macOS" : /iPhone|iPad|iOS/i.test(ua) ? "iOS" : /Android/i.test(ua) ? "Android" : /Linux/i.test(ua) ? "Linux" : "Other";
  const browser = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Other";
  return { device, os, browser };
}
export const isBot = (ua: string) => !ua || /bot|crawl|spider|slurp|preview|headless|lighthouse|vercel|uptime|monitor|facebookexternalhit|curl|wget|python/i.test(ua);
