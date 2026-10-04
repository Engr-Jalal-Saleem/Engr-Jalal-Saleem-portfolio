"use client";
import { useState } from "react";
export default function CopyText({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <span style={{ display: "flex", gap: 8, alignItems: "center", minWidth: 0 }}>
      <code style={{ font: "12px var(--f-mono)", color: "var(--cyan)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{text}</code>
      <button type="button" className="btn" style={{ padding: "4px 8px" }} onClick={async () => { try { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); } catch {} }}>{ok ? "Copied" : "Copy"}</button>
    </span>
  );
}
