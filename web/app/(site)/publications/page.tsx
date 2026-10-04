import PubList from "../../../components/PubList";
import SplitText from "../../../components/SplitText";
import { getPublications } from "../../../lib/content";
import { toPub } from "../../../lib/map";

export const metadata = { alternates: { canonical: "/publications" }, title: "Publications", description: "Papers with exact status: published, under review, thesis." };

export default async function Pubs() {
  const p = (await getPublications()).map(toPub);
  // ScholarlyArticle list for search engines. Status goes in creativeWorkStatus so nothing is upgraded.
  const ld = { "@context": "https://schema.org", "@graph": p.map((x) => ({
    "@type": "ScholarlyArticle", headline: x.title, author: x.authors.replace(/\*/g, ""), datePublished: x.year ? String(x.year) : undefined,
    publisher: x.venue || undefined, creativeWorkStatus: x.statusLabel, abstract: x.summary || undefined, url: x.link || undefined,
  })) };
  return (
    <div className="wrap" style={{ paddingBottom: 88 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <header className="page-head">
        <span className="eyebrow">Publications</span>
        <SplitText as="h1" className="page" text="Papers, with exact" em="status" />
        <p className="lede">Nothing here is upgraded. Under review means under review.</p>
      </header>
      <PubList items={p} />
    </div>
  );
}
