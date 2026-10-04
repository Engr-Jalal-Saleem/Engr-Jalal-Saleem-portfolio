"use client";
import { useRef, useState } from "react";
export default function CopyEmail({ email }: { email: string }) {
  const ref = useRef<HTMLElement>(null);
  const [label, setLabel] = useState("Copy email");
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); setLabel("Copied"); }
    catch { const r = document.createRange(); r.selectNodeContents(ref.current!); getSelection()?.removeAllRanges(); getSelection()?.addRange(r); setLabel("Selected, press Ctrl+C"); }
  };
  return <div className="mail"><code ref={ref}>{email}</code><button className="pill" type="button" onClick={copy}>{label}</button></div>;
}
