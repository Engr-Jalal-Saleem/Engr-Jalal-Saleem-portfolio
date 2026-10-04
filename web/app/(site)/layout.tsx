import Nav from "../../components/Nav";
import Cursor from "../../components/Cursor";
import Intro from "../../components/Intro";
import SmoothScroll from "../../components/SmoothScroll";
import { getSettings } from "../../lib/content";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const links = s.nav.filter((l) => l.visible).map(({ label, href }) => ({ label, href }));
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Person", name: s.name, email: s.email, jobTitle: "Electrical engineer and researcher",
    sameAs: [s.linkedin, s.github, s.scholar, s.orcid, s.researchgate].filter(Boolean),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SmoothScroll />
      <Intro />
      <Cursor />
      <Nav links={links} />
      <main>{children}</main>
      <footer className="f">
        <div className="wrap">
          <span>© {new Date().getFullYear()} {s.name}</span>
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
