"use client";
export default function SignOut() {
  return <a href="#" onClick={async (e) => { e.preventDefault(); await fetch("/api/admin/login", { method: "DELETE" }); location.href = "/admin/login"; }}>Sign out</a>;
}
