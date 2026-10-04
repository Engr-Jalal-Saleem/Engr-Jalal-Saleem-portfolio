import { NextResponse } from "next/server";
import { COOKIE, adminPassword, safeEqual, tokenFor } from "../../../../lib/auth";
import { clientIp, geo, logSecurity, rateLimit } from "../../../../lib/security";

export async function POST(req: Request) {
  const ip = clientIp(req.headers), ua = req.headers.get("user-agent") ?? "";
  const form = await req.formData();
  const next = String(form.get("next") || "/admin");
  const safeNext = next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/admin";
  const back = (e: string) => NextResponse.redirect(new URL(`/admin/login?e=${e}&next=${encodeURIComponent(safeNext)}`, req.url), 303);

  // 5 attempts per 15 minutes per IP
  if (!(await rateLimit("login", ip, 5, 900))) {
    await logSecurity({ ip, kind: "rate-limited", path: "/api/admin/login", ua, ...geo(req.headers) });
    return back("locked");
  }
  const pw = adminPassword();
  if (!pw) return back("unset");
  if (!safeEqual(String(form.get("password") ?? ""), pw)) {
    await logSecurity({ ip, kind: "login-failed", path: "/api/admin/login", ua, ...geo(req.headers) });
    return back("1");
  }
  await logSecurity({ ip, kind: "login-ok", path: "/api/admin/login", ua, ...geo(req.headers) });
  const res = NextResponse.redirect(new URL(safeNext, req.url), 303);
  res.cookies.set(COOKIE, await tokenFor(pw), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 14 });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE);
  return res;
}
