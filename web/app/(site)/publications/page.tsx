import PubList from "../../../components/PubList";
import { getPublications } from "../../../lib/content";
import { toPub } from "../../../lib/map";

export const metadata = { title: "Publications", description: "Papers with exact status: published, under review, thesis." };

export default async function Pubs() {
  const p = await getPublications();
  return (
    <div className="wrap" style={{ paddingBottom: 88 }}>
      <header className="page-head">
        <span className="eyebrow">Publications</span>
        <h1 className="page">Papers, with <em>exact</em> status</h1>
        <p className="lede">Nothing here is upgraded. Under review means under review.</p>
      </header>
      <PubList items={p.map(toPub)} />
    </div>
  );
}
