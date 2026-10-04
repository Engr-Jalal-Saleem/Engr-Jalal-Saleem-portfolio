import { redisEnabled } from "../../../../lib/redis";
import { securityEvents } from "../../../../lib/security";
import CopyText from "../../../../components/admin/CopyText";

export const dynamic = "force-dynamic";
const ago = (t: number) => { const m = Math.round((Date.now() - t) / 6e4); return m < 1 ? "just now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`; };
const LABEL: Record<string, string> = { "login-failed": "Wrong password", "login-ok": "Signed in", "rate-limited": "Blocked: too many requests", "upload-rejected": "Upload rejected", "bad-request": "Bad request" };

export default async function Security() {
  const ev = await securityEvents();
  const bad = ev.filter((e) => e.kind !== "login-ok");
  const byIp = new Map<string, { n: number; last: number; kinds: Set<string>; place: string }>();
  bad.forEach((e) => {
    const r = byIp.get(e.ip) ?? { n: 0, last: 0, kinds: new Set<string>(), place: [e.city, e.country].filter(Boolean).join(", ") };
    r.n++; r.last = Math.max(r.last, e.t); r.kinds.add(LABEL[e.kind] ?? e.kind); byIp.set(e.ip, r);
  });
  const ips = [...byIp.entries()].sort((a, b) => b[1].n - a[1].n);
  return (
    <>
      <div className="top"><div><h1>Security</h1><p className="sub">Failed logins, blocked requests and rejected uploads. IP addresses are kept for 7 days, then deleted automatically.</p></div></div>
      {!redisEnabled && <div className="note" style={{ maxWidth: 760, marginBottom: 20 }}><b>Logging is off.</b> Connect Upstash for Redis in Vercel (same step as Analytics) to see events here. Rate limits still work without it.</div>}

      <div className="cards" style={{ marginBottom: 24 }}>
        <div className="card"><span>Wrong passwords (7 d)</span><b>{ev.filter((e) => e.kind === "login-failed").length}</b><em>5 tries per 15 min, then locked</em></div>
        <div className="card"><span>Blocked requests (7 d)</span><b>{ev.filter((e) => e.kind === "rate-limited").length}</b><em>login and tracking limits</em></div>
        <div className="card"><span>Rejected uploads (7 d)</span><b>{ev.filter((e) => e.kind === "upload-rejected").length}</b><em>only images, PDF, video allowed</em></div>
        <div className="card"><span>Your sign-ins (7 d)</span><b>{ev.filter((e) => e.kind === "login-ok").length}</b><em>check these are all you</em></div>
      </div>

      <h2 style={{ font: "800 18px var(--f-display)", margin: "8px 0 10px" }}>Suspicious IP addresses</h2>
      <p className="sub" style={{ margin: "0 0 10px" }}>To block one: Vercel → your project → <b>Firewall</b> → <b>Configure</b> → <b>+ New Rule</b> → IP Address equals (paste) → Deny.</p>
      <div className="list" style={{ marginBottom: 28 }}>
        {ips.map(([ip, r]) => (
          <div key={ip} className="row" style={{ gridTemplateColumns: "1fr auto" }}>
            <div className="t" style={{ display: "grid", gap: 4 }}><CopyText text={ip} /><small>{r.place || "Unknown place"} · {[...r.kinds].join(", ")} · last {ago(r.last)}</small></div>
            <span className={`badge ${r.n >= 5 ? "local" : "github"}`} style={r.n >= 5 ? { background: "#4a1d24", color: "#ff9a9a" } : undefined}>{r.n} events</span>
          </div>
        ))}
        {!ips.length && <p className="sub">Nothing suspicious in the last 7 days.</p>}
      </div>

      <h2 style={{ font: "800 18px var(--f-display)", margin: "8px 0 10px" }}>Event log</h2>
      <div className="list">
        {ev.slice(0, 100).map((e, i) => (
          <div key={i} className="row" style={{ gridTemplateColumns: "1fr auto" }}>
            <div className="t"><b style={{ color: e.kind === "login-ok" ? "var(--green)" : e.kind === "login-failed" || e.kind === "rate-limited" ? "var(--red)" : undefined }}>{LABEL[e.kind] ?? e.kind}</b>
              <small>{e.ip} · {[e.city, e.country].filter(Boolean).join(", ") || "unknown place"} · {e.path} · {e.ua?.slice(0, 80)}</small></div>
            <small>{ago(e.t)}</small>
          </div>
        ))}
      </div>

      <h2 style={{ font: "800 18px var(--f-display)", margin: "28px 0 10px" }}>What protects the site</h2>
      <div className="cards">
        <div className="card"><b style={{ fontSize: 15 }}>DDoS</b><span>Vercel blocks floods at its network edge automatically, before they reach this code.</span></div>
        <div className="card"><b style={{ fontSize: 15 }}>Admin login</b><span>Password compared in constant time, 5 tries per 15 min per IP, secure HTTP-only cookie.</span></div>
        <div className="card"><b style={{ fontSize: 15 }}>Uploads</b><span>Only images, PDF and video. No HTML, SVG or scripts.</span></div>
        <div className="card"><b style={{ fontSize: 15 }}>Headers</b><span>Content Security Policy, HSTS, no framing, no sniffing, no camera or location access.</span></div>
      </div>
    </>
  );
}
