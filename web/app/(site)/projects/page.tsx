import ProjectGrid from "../../../components/ProjectGrid";
import SplitText from "../../../components/SplitText";
import { getProjects } from "../../../lib/content";
import { toProj } from "../../../lib/map";

export const metadata = { alternates: { canonical: "/projects" }, title: "Projects", description: "Space systems, embedded AI, computer vision and research builds." };

export default async function Projects() {
  const p = await getProjects();
  return (
    <div className="wrap" style={{ paddingBottom: 88 }}>
      <header className="page-head">
        <span className="eyebrow">Projects · {p.length}</span>
        <SplitText as="h1" className="page" text="Orbit to" em="factory floor" />
        <p className="lede">Every card opens a case study. Employer work is described, never shown.</p>
      </header>
      <ProjectGrid items={p.map(toProj)} />
    </div>
  );
}
