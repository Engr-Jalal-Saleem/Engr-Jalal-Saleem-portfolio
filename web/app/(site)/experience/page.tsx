import GroundTrack from "../../../components/GroundTrack";
import SplitText from "../../../components/SplitText";
import { getExperience, getHonors, getSkills } from "../../../lib/content";

export const metadata = { alternates: { canonical: "/experience" }, title: "Experience", description: "KAUST, SUPARCO, IndusLytics, Punjab Safe Cities." };

export default async function Experience() {
  const [ex, hon, sk] = await Promise.all([getExperience(), getHonors(), getSkills()]);
  const stops = ex.map(({ slug, entry: e }) => ({
    key: slug,
    place: e.mapPlace,
    minor: e.minor,
    content: (
      <>
        <span className="k">{e.start} – {e.end} · {e.location}</span>
        <h3>{e.role}</h3>
        <div>{e.org}</div>
        {e.description && <p>{e.description}</p>}
      </>
    ),
  }));
  return (
    <div className="wrap" style={{ paddingBottom: 88 }}>
      <header className="page-head">
        <span className="eyebrow">Experience · ground track</span>
        <SplitText as="h1" className="page" text="Where the signal" em="was acquired" />
        <p className="lede">Scroll the list. The track follows you across the map.</p>
      </header>
      <GroundTrack stops={stops} />
      <section className="s" style={{ marginTop: 88 }}>
        <div className="shead"><div><span className="eyebrow">Skills</span><h2>Tools I <em>actually</em> use</h2></div><p>Grouped by what I&apos;ve shipped with them.</p></div>
        <div className="cols">
          {sk.map(({ slug, entry: g }) => (
            <div className="box" key={slug}><h3>{g.group}</h3><div className="tags">{g.items.map((i) => <span key={i}>{i}</span>)}</div></div>
          ))}
        </div>
      </section>
      <section className="s">
        <div className="shead"><div><span className="eyebrow">Honors</span><h2>Recognition</h2></div></div>
        {hon.map(({ slug, entry: h }) => (
          <div className="hon" key={slug}><span>{h.year}</span><div><b>{h.title}</b><small>{h.detail}</small></div></div>
        ))}
      </section>
    </div>
  );
}
