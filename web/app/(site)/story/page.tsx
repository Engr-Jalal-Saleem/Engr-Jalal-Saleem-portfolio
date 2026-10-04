import StoryRail from "../../../components/StoryRail";
import { getChapters } from "../../../lib/content";

export const metadata = { title: "Story", description: "How I got from a breadboard in Lahore to satellite collision avoidance." };

export default async function Story() {
  const ch = await getChapters();
  return (
    <div className="wrap">
      <header className="page-head">
        <span className="eyebrow">Story · {ch[0]?.entry.year} to now</span>
        <h1 className="page">From a breadboard to <em>low Earth orbit</em></h1>
        <p className="lede">Scroll. Each year, what I built and what it taught me.</p>
      </header>
      <StoryRail chapters={ch.map(({ slug, entry: e }) => ({ slug, year: e.year, title: e.title, place: e.place, body: e.body }))} />
      <div style={{ height: 80 }} />
    </div>
  );
}
