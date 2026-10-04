/**
 * Minimal password gate for /admin and /keystatic.
 * Set ADMIN_PASSWORD (and optionally ADMIN_SECRET) in Vercel. In local dev,
 * the password defaults to "admin" if unset. In production with no password
 * set, login is refused, so the panel is never accidentally open.
 */
export const COOKIE = "jx_admin";

export function adminPassword(): string | null {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === "production" ? null : "admin";
}

export async function tokenFor(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${password}:${process.env.ADMIN_SECRET ?? "jalal-portfolio"}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function isValidToken(token: string | undefined): Promise<boolean> {
  const pw = adminPassword();
  if (!pw || !token) return false;
  return token === (await tokenFor(pw));
}
