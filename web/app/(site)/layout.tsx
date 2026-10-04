import Nav from "../../components/Nav";
import Cursor from "../../components/Cursor";
import Intro from "../../components/Intro";
import SmoothScroll from "../../components/SmoothScroll";
import Tracker from "../../components/Tracker";
import { getSettings, getTheme, themeCss, themeFontHrefs } from "../../lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [s, t] = await Promise.all([getSettings(), getTheme()]);
  const fx = t.effects;
  const links = s.nav.filter((l) => l.visible).map(({ label, href }) => ({ label, href }));
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Person", name: s.name, email: s.email, jobTitle: "Electrical engineer and researcher",
    sameAs: [s.linkedin, s.github, s.scholar, s.orcid, s.researchgate].filter(Boolean),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {themeFontHrefs(t).map((h) => <link key={h} rel="stylesheet" href={h} />)}
      <style dangerouslySetInnerHTML={{ __html: themeCss(t) + (fx.pageCurtain ? "" : ".curtain{display:none}") }} />
      {/* default theme for first-time visitors; a saved choice from the toggle wins */}
      <script dangerouslySetInnerHTML={{ __html: `try{var m=localStorage.getItem("theme")||${JSON.stringify(t.defaultMode)};if(m==="light")document.documentElement.dataset.theme="light"}catch(e){}` }} />
      <Tracker />
      {fx.smoothScroll && <SmoothScroll />}
      {fx.introCountdown && <Intro />}
      {fx.customCursor && <Cursor />}
      <Nav links={links} />
      <main>{children}</main>
      <footer className="f">
        <div className="wrap">
          <span>© {new Date().getFullYear()} {s.name} · This site counts visits anonymously. No cookies, no IP addresses stored.</span>
          <span style={{ display: "flex", gap: 14 }}>
            {s.linkedin && <a href={s.linkedin}>LinkedIn</a>}
            {s.github && <a href={s.github}>GitHub</a>}
            {s.scholar && <a href={s.scholar}>Scholar</a>}
            {s.orcid && <a href={s.orcid}>ORCID</a>}
          </span>
        </div>
      </footer>
    </>
  );
}
