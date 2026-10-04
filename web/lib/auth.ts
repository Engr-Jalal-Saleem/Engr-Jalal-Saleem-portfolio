/**
 * Password gate for /admin. Set ADMIN_PASSWORD (and ADMIN_SECRET) in Vercel.
 * Local dev defaults to "admin" if unset. In production with no password set,
 * login is refused, so the panel is never accidentally open.
 */
export const COOKIE = "jx_admin";

export function adminPassword(): string | null {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === "production" ? null : "admin";
}

async function sha(s: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
export const tokenFor = (password: string) => sha(`${password}:${process.env.ADMIN_SECRET ?? "jalal-portfolio"}`);

/** Constant-time string comparison, so response timing leaks nothing about the secret. */
export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function isValidToken(token: string | undefined): Promise<boolean> {
  const pw = adminPassword();
  if (!pw || !token) return false;
  return safeEqual(token, await tokenFor(pw));
}
