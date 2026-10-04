import Link from "next/link";
import ParticleHero from "../../components/ParticleHero";
import Reveal from "../../components/Reveal";
import Counter from "../../components/Counter";
import Magnetic from "../../components/Magnetic";
import StoryRail from "../../components/StoryRail";
import HorizontalProjects from "../../components/HorizontalProjects";
import Marquee from "../../components/Marquee";
import SplitText from "../../components/SplitText";
import PubList from "../../components/PubList";
import CopyEmail from "../../components/CopyEmail";
import { getSettings, getHome, getChapters, getPublications, getProjects, getCertificates, getSkills } from "../../lib/content";
import { toProj, toPub } from "../../lib/map";

function Highlight({ text, mark }: { text: string; mark: string }) {
  if (!mark || !text.includes(mark)) return <>{text}</>;
  const [a, b] = text.split(mark);
  return <>{a}<mark>{mark}</mark>{b}</>;
}

export default async function Home() {
  const [s, h, chapters, pubs, projects, certs, skills] = await Promise.all([getSettings(), getHome(), getChapters(), getPublications(), getProjects(), getCertificates(), getSkills()]);
  const tools = skills.flatMap((g) => g.entry.items).slice(0, 18);
  const on = (k: string) => h.sections.includes(k as never);
  return (
    <>
      <header className="hero">
        <ParticleHero name={s.name} />
        <div className="ov"><div className="wrap">
          <span className="eyebrow">{h.eyebrow}</span>
          <p className="lede"><Highlight text={h.intro} mark={h.introHighlight} /></p>
          <div className="chips">{h.chips.filter((c) => c.visible).map((c, i) => <span key={i} className="chip"><b>{c.strong}</b> {c.rest}</span>)}</div>
          <div className="btns">
            <Magnetic><Link className="btn" href="/story">Read my story</Link></Magnetic>
            <Magnetic><Link className="btn g" href="/research">Research</Link></Magnetic>
            <Magnetic><Link className="btn g" href="/cv">CV</Link></Magnetic>
          </div>
        </div></div>
      </header>

      {on("stats") && (
        <section className="s"><div className="wrap">
          <Reveal><div className="stats">{h.stats.filter((x) => x.visible).map((x, i) => (
            <div className="stat" key={i}><Counter value={x.value ?? 0} decimals={x.decimals ?? 0} prefix={x.prefix} suffix={x.suffix} /><span>{x.label}</span></div>
          ))}</div></Reveal>
        </div></section>
      )}

      <Marquee items={tools} />

      {on("story") && (
        <section className="s"><div className="wrap">
          <Reveal className="shead"><div><span className="eyebrow">Story</span><SplitText text="From a breadboard to" em="low Earth orbit" /></div><Link className="more" href="/story">FULL STORY →</Link></Reveal>
          <StoryRail chapters={chapters.slice(-4).map(({ slug, entry: e }) => ({ slug, year: e.year, title: e.title, place: e.place, body: e.body }))} />
        </div></section>
      )}

      {on("research") && (
        <section className="s"><div className="wrap">
          <Reveal className="shead"><div><span className="eyebrow">Research</span><SplitText text="What I work" em="on" /></div><Link className="more" href="/research">RESEARCH →</Link></Reveal>
          <div className="research">
            <Reveal className="interests">{h.interests.map((x, i) => <div className="int" key={i}><i>0{i + 1}</i><div><b>{x.title}</b><span>{x.body}</span></div></div>)}</Reveal>
            <Reveal delay={0.1}>
              <div className="video"><video src="/videos/pulse-explainer.mp4" poster="/videos/pulse-explainer.jpg" controls preload="none" playsInline /></div>
              <div className="nextq"><b>NEXT QUESTION</b><p>{h.researchQuestion}</p></div>
            </Reveal>
          </div>
        </div></section>
      )}

      {on("publications") && (
        <section className="s"><div className="wrap">
          <Reveal className="shead"><div><span className="eyebrow">Publications</span><SplitText text="Papers, with exact status" /></div><Link className="more" href="/publications">ALL PAPERS →</Link></Reveal>
          <PubList items={pubs.filter((p) => p.entry.featured).map(toPub)} filters={false} />
        </div></section>
      )}

      {on("projects") && (
        <section className="s" style={{ paddingBottom: 0 }}>
          <div className="wrap"><Reveal className="shead"><div><span className="eyebrow">Projects</span><SplitText text="Orbit to" em="factory floor" /></div><Link className="more" href="/projects">ALL {projects.length} PROJECTS →</Link></Reveal></div>
          <HorizontalProjects items={projects.filter((p) => p.entry.featured).map(toProj)} />
        </section>
      )}

      {on("certificates") && (
        <section className="s"><div className="wrap">
          <Reveal className="shead"><div><span className="eyebrow">Certificates</span><SplitText text={`${certs.length} verified,`} em="these matter most" /></div><Link className="more" href="/certificates">SEE ALL {certs.length} →</Link></Reveal>
          <div className="certs">{certs.filter((c) => c.entry.featured).map(({ slug, entry: c }) => (
            <a key={slug} className="cert" href={c.url ?? undefined} target="_blank" rel="noreferrer"><span><b>{c.title}</b><small>{c.issuer} · {c.issued}</small></span><i>VERIFY ↗</i></a>
          ))}</div>
        </div></section>
      )}

      {on("contact") && (
        <section className="s" id="contact"><div className="wrap" style={{ display: "grid", gap: 22 }}>
          {s.seekingNote && <span className="eyebrow">{s.seekingNote}</span>}
          <Reveal><p className="huge" data-cursor="HI">Working on autonomy, edge AI or <em>space?</em><br />Let&apos;s talk.</p></Reveal>
          <CopyEmail email={s.email} />
        </div></section>
      )}
    </>
  );
}
