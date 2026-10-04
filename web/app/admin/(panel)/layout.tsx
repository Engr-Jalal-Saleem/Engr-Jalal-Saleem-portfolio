import Link from "next/link";
import "../admin.css";
import { ToastProvider } from "../../../components/admin/Toast";
import SignOut from "../../../components/admin/SignOut";
import { COLLECTIONS, SINGLETONS, listItems, mode } from "../../../lib/store";

export const metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const counts = Object.fromEntries(await Promise.all(Object.keys(COLLECTIONS).map(async (k) => [k, (await listItems(k)).length])));
  const groups = Array.from(new Set(Object.values(COLLECTIONS).map((c) => c.group)));
  return (
    <ToastProvider>
      <div className="adm">
        <aside>
          <Link className="brand" href="/admin">jalal<span>.</span>admin</Link>
          <div className="grp"><h6>Overview</h6><Link href="/admin">Dashboard</Link><Link href="/admin/analytics">Analytics</Link>
            {Object.entries(SINGLETONS).map(([k, s]) => <Link key={k} href={`/admin/settings/${k}`}>{s.label}</Link>)}</div>
          {groups.map((g) => (
            <div className="grp" key={g}><h6>{g}</h6>
              {Object.entries(COLLECTIONS).filter(([, c]) => c.group === g).map(([k, c]) => <Link key={k} href={`/admin/${k}`}>{c.label}<small>{counts[k]}</small></Link>)}
            </div>
          ))}
          <div className="grp" style={{ marginTop: "auto" }}><h6>Site</h6>
            <a href="/" target="_blank" rel="noreferrer">View site ↗</a>
            <Link href="/admin/security">Security</Link>
            <SignOut />
            <span style={{ padding: "6px 10px" }}><span className={`badge ${mode}`}>{mode === "github" ? "Live · saves to GitHub" : "Local · saves to disk"}</span></span>
          </div>
        </aside>
        <main>{children}</main>
      </div>
    </ToastProvider>
  );
}
