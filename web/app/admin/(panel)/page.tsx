import Link from "next/link";
import { COLLECTIONS, SINGLETONS, listItems, mode } from "../../../lib/store";

export default async function Dashboard() {
  const stats = await Promise.all(Object.entries(COLLECTIONS).map(async ([k, c]) => {
    const items = await listItems(k);
    return { k, label: c.label, total: items.length, hidden: items.filter((i) => i.data.visible === false).length, featured: items.filter((i) => i.data.featured === true).length };
  }));
  return (
    <>
      <div className="top"><div><h1>Dashboard</h1><p className="sub">Everything on your site. Click a box to manage it.</p></div>
        <a className="btn" href="/" target="_blank" rel="noreferrer">Open site ↗</a></div>
      <div className="cards" style={{ marginBottom: 28 }}>
        {stats.map((s) => (
          <Link key={s.k} href={`/admin/${s.k}`} className="card">
            <span>{s.label}</span><b>{s.total}</b>
            <em>{s.hidden ? `${s.hidden} hidden` : "all shown"}{s.featured ? ` · ${s.featured} on home` : ""}</em>
          </Link>
        ))}
        {Object.entries(SINGLETONS).map(([k, s]) => (
          <Link key={k} href={`/admin/settings/${k}`} className="card"><span>Edit</span><b style={{ fontSize: 22 }}>{s.label}</b><em>text, links, sections</em></Link>
        ))}
      </div>
      <div className="note" style={{ maxWidth: 760 }}>
        {mode === "github"
          ? <><b>Live mode.</b> Every save is a commit to GitHub. Vercel rebuilds and your change is live in about a minute. Every change can be undone from GitHub history.</>
          : <><b>Local mode.</b> Saves write to the files in <code>web/content</code>. Commit and push to publish. To edit the live site directly, set <code>GITHUB_TOKEN</code> and <code>GITHUB_REPO</code> in Vercel (see README).</>}
      </div>
      <h2 style={{ font: "800 18px var(--f-display)", margin: "28px 0 10px" }}>How to</h2>
      <div className="cards">
        <div className="card"><b style={{ fontSize: 16 }}>Hide something</b><span>Open its list and flip the Show switch.</span></div>
        <div className="card"><b style={{ fontSize: 16 }}>Reorder</b><span>Drag the ⋮⋮ handle. It saves when you drop.</span></div>
        <div className="card"><b style={{ fontSize: 16 }}>Pick home page items</b><span>Flip the Home switch on papers, projects or certificates.</span></div>
        <div className="card"><b style={{ fontSize: 16 }}>Change images or CV</b><span>Open the item, click Upload file. Your CV is in Site settings.</span></div>
      </div>
    </>
  );
}
