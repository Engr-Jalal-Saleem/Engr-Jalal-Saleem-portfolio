/** Tiny Upstash REST client shared by analytics, rate limiting and the security log. */
import "server-only";
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
export const redisEnabled = Boolean(URL_ && TOKEN);
export async function redis(cmds: (string | number)[][]): Promise<{ result: unknown }[]> {
  const r = await fetch(`${URL_}/pipeline`, { method: "POST", headers: { Authorization: `Bearer ${TOKEN}` }, body: JSON.stringify(cmds), cache: "no-store" });
  if (!r.ok) throw new Error(`Redis ${r.status}`);
  return r.json();
}
