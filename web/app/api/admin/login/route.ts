import { NextResponse } from "next/server";
import { COOKIE, adminPassword, tokenFor } from "../../../../lib/auth";

export async function POST(req: Request) {
  const form = await req.formData();
  const pw = adminPassword();
  const next = String(form.get("next") || "/admin");
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/admin";
  if (!pw) return NextResponse.redirect(new URL("/admin/login?e=unset", req.url), 303);
  if (form.get("password") !== pw) return NextResponse.redirect(new URL(`/admin/login?e=1&next=${encodeURIComponent(safeNext)}`, req.url), 303);
  const res = NextResponse.redirect(new URL(safeNext, req.url), 303);
  res.cookies.set(COOKIE, await tokenFor(pw), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 14 });
  return res;
}

export async function DELETE(req: Request) {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE);
  void req;
  return res;
}
