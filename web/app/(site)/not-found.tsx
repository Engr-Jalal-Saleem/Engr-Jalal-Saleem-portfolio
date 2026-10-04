import Link from "next/link";
export default function NotFound() {
  return (<div className="wrap page-head">
    <span className="eyebrow">LOSS OF SIGNAL</span>
    <h1 className="page">404. This object <em>left the catalogue.</em></h1>
    <p className="lede">The page you tracked is no longer in orbit.</p>
    <p style={{ marginTop: 24 }}><Link className="btn" href="/">Return to base</Link></p>
  </div>);
}
