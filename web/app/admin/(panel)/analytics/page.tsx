import { headers } from "next/headers";
import Link from "next/link";
import { analyticsEnabled, recent, type Ev } from "../../../../lib/analytics";
import { listItems } from "../../../../lib/store";
import CopyText from "../../../../components/admin/CopyText";

export const dynamic = "force-dynamic";

const DAY = 864e5;
const fmtDur = (ms: number) => { const s = Math.round(ms / 1000); return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`; };
const ago = (t: number) => { const m = Math.round((Date.now() - t) / 6e4); return m < 1 ? "just now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`; };
const flag = (cc?: string) => (cc && /^[A-Z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc].map((c) => 0x1f1a5 + c.charCodeAt(0))) : "🌐");
function top(evs: Ev[], key: (e: Ev) => string | undefined, n = 8) {
  const m = new Map<string, number>();
  evs.forEach((e) => { const k = key(e); if (k) m.set(k, (m.get(k) ?? 0) + 1); });
  return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}
function Bars({ title, rows }: { title: string; rows: [string, number][] }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <div className="card" style={{ gap: 10 }}>
      <span style={{ font: "600 11px var(--f-mono)", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--amber)" }}>{title}</span>
      {rows.length ? rows.map(([k, v]) => (
        <div key={k} style={{ display: "grid", gap: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 13 }}><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k}</span><b style={{ font: "600 12px var(--f-mono)" }}>{v}</b></div>
          <div style={{ height: 4, background: "var(--line)", borderRadius: 2 }}><div style={{ width: `${(v / max) * 100}%`, height: "100%", background: "var(--cyan)", borderRadius: 2 }} /></div>
        </div>
      )) : <span>No data yet.</span>}
    </div>
  );
}

export default async function Analytics({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const days = Number((await searchParams).days) || 30;
  const h = await headers();
  const site = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;
  const links = await listItems("links");

  if (!analyticsEnabled) return (
    <>
      <div className="top"><div><h1>Analytics</h1><p className="sub">See who visits, from where, and what they read.</p></div></div>
      <div className="note" style={{ maxWidth: 760, display: "grid", gap: 8 }}>
        <b>One-time setup (about 3 minutes, free):</b>
        <span>1. Vercel → your project → <b>Storage</b> → <b>Create Database</b> → choose <b>Upstash for Redis</b> → Free plan → connect it to this project.</span>
        <span>2. Vercel adds the keys for you. Go to <b>Deployments</b> → ⋯ → <b>Redeploy</b>.</span>
        <span>3. Come back here. Visits start showing as soon as someone opens your site.</span>
      </div>
    </>
  );

  const all = await recent();
  const since = Date.now() - days * DAY;
  const evs = all.filter((e) => e.t >= since);
  const views = evs.filter((e) => e.type === "view");
  const leaves = evs.filter((e) => e.type === "leave" && (e.dur ?? 0) > 0 && (e.dur ?? 0) < 3 * 3600e3);
  const clicks = evs.filter((e) => e.type === "click");
  const visitors = new Set(views.map((e) => e.vid)).size;
  const sessions = new Set(views.map((e) => e.sid)).size;
  const avg = leaves.length ? leaves.reduce((a, e) => a + (e.dur ?? 0), 0) / leaves.length : 0;
  const today = all.filter((e) => e.type === "view" && e.t >= Date.now() - DAY).length;

  // group sessions for the live feed
  const bySid = new Map<string, Ev[]>();
  evs.forEach((e) => { if (!bySid.has(e.sid)) bySid.set(e.sid, []); bySid.get(e.sid)!.push(e); });
  const feed = [...bySid.values()].map((list) => list.sort((a, b) => a.t - b.t)).sort((a, b) => b[b.length - 1].t - a[a.length - 1].t).slice(0, 25);

  // tracked links
  const linkStats = links.map((l) => {
    const code = String(l.data.code ?? "");
    const ev = all.filter((e) => e.refTag === code);
    const v = ev.filter((e) => e.type === "view");
    return {
      name: String(l.data.name ?? l.slug), code, url: `${site}/?ref=${encodeURIComponent(code)}`,
      opens: new Set(v.map((e) => e.sid)).size, pages: [...new Set(v.map((e) => e.path))],
      time: ev.filter((e) => e.type === "leave").reduce((a, e) => a + (e.dur ?? 0), 0),
      clicks: ev.filter((e) => e.type === "click").map((e) => e.label || e.target).filter(Boolean) as string[],
      last: v.length ? Math.max(...v.map((e) => e.t)) : null, place: v[0] ? [v[0].city, v[0].country].filter(Boolean).join(", ") : "",
    };
  });

  return (
    <>
      <div className="top">
        <div><h1>Analytics</h1><p className="sub">Last {days} days · {all.length.toLocaleString()} events stored</p></div>
        <div className="tools" style={{ margin: 0 }}>{[1, 7, 30, 90].map((d) => <Link key={d} className={`btn${d === days ? " pri" : ""}`} href={`/admin/analytics?days=${d}`}>{d === 1 ? "24 h" : `${d} d`}</Link>)}</div>
      </div>

      <div className="cards" style={{ marginBottom: 20 }}>
        <div className="card"><span>Page views</span><b>{views.length}</b><em>{today} in last 24 h</em></div>
        <div className="card"><span>Visitors</span><b>{visitors}</b><em>{views.filter((e) => e.newVisitor).length} first-time visits</em></div>
        <div className="card"><span>Visits (sessions)</span><b>{sessions}</b><em>{sessions ? (views.length / sessions).toFixed(1) : 0} pages per visit</em></div>
        <div className="card"><span>Avg time on a page</span><b>{fmtDur(avg)}</b><em>{leaves.length ? Math.round(leaves.reduce((a, e) => a + (e.scroll ?? 0), 0) / leaves.length) : 0}% avg scroll</em></div>
        <div className="card"><span>Clicks tracked</span><b>{clicks.length}</b><em>CV, papers, email, links</em></div>
      </div>

      <h2 style={{ font: "800 18px var(--f-display)", margin: "8px 0 10px" }}>Tracked links</h2>
      <p className="sub" style={{ margin: "0 0 10px" }}>Make one per person in <Link href="/admin/links" style={{ color: "var(--cyan)" }}>Tracked links</Link>, copy the link, and paste it in your email to them.</p>
      <div className="list" style={{ marginBottom: 28 }}>
        {linkStats.map((l) => (
          <div key={l.code} className="row" style={{ gridTemplateColumns: "1fr auto", alignItems: "start" }}>
            <div className="t" style={{ display: "grid", gap: 4 }}>
              <b>{l.name}</b>
              <CopyText text={l.url} />
              <small>{l.opens ? `Opened ${l.opens}× · last ${ago(l.last!)}${l.place ? " · " + l.place : ""} · ${fmtDur(l.time)} total · pages: ${l.pages.join(", ")}` : "Not opened yet"}</small>
              {l.clicks.length > 0 && <small style={{ color: "var(--amber)" }}>Clicked: {[...new Set(l.clicks)].join(" · ")}</small>}
            </div>
            <span className={`badge ${l.opens ? "github" : "local"}`}>{l.opens ? "OPENED" : "WAITING"}</span>
          </div>
        ))}
      </div>

      <div className="cards" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", marginBottom: 28 }}>
        <Bars title="Top pages" rows={top(views, (e) => e.path)} />
        <Bars title="Countries" rows={top(views, (e) => e.country && `${flag(e.country)} ${e.country}`)} />
        <Bars title="Cities" rows={top(views, (e) => e.city && `${e.city}${e.country ? ", " + e.country : ""}`)} />
        <Bars title="Came from" rows={top(views, (e) => { try { return e.ref ? new URL(e.ref).hostname.replace(/^www\./, "") : "Direct / typed"; } catch { return e.ref; } })} />
        <Bars title="Devices" rows={top(views, (e) => e.device)} />
        <Bars title="Browsers" rows={top(views, (e) => e.browser)} />
        <Bars title="Operating systems" rows={top(views, (e) => e.os)} />
        <Bars title="Most clicked" rows={top(clicks, (e) => e.label || e.target)} />
        <Bars title="Languages" rows={top(views, (e) => e.lang)} />
        <Bars title="Campaigns (UTM)" rows={top(views, (e) => e.utm)} />
      </div>

      <h2 style={{ font: "800 18px var(--f-display)", margin: "8px 0 10px" }}>Recent visits</h2>
      <div className="list">
        {feed.map((s) => {
          const f = s[0], v = s.filter((e) => e.type === "view"), c = s.filter((e) => e.type === "click");
          const time = s.filter((e) => e.type === "leave").reduce((a, e) => a + (e.dur ?? 0), 0);
          return (
            <div key={f.sid} className="row" style={{ gridTemplateColumns: "auto 1fr auto" }}>
              <span style={{ fontSize: 22 }}>{flag(f.country)}</span>
              <div className="t">
                <b>{[f.city, f.region, f.country].filter(Boolean).join(", ") || "Unknown place"}{f.refTag ? ` · via link "${f.refTag}"` : ""}</b>
                <small>{f.device} · {f.os} · {f.browser} · {f.screen} · {f.lang}{f.newVisitor ? " · first visit" : " · returning"}</small>
                <small>{v.map((e) => e.path).join(" → ")}{c.length ? ` · clicked ${c.map((e) => e.label || e.target).join(", ")}` : ""}</small>
              </div>
              <small style={{ textAlign: "right" }}>{ago(s[s.length - 1].t)}<br />{fmtDur(time)}</small>
            </div>
          );
        })}
        {!feed.length && <p className="sub">No visits yet in this period.</p>}
      </div>
    </>
  );
}
