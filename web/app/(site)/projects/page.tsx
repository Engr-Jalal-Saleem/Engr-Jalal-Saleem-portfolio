import ProjectGrid from "../../../components/ProjectGrid";
import { getProjects } from "../../../lib/content";
import { toProj } from "../../../lib/map";

export const metadata = { title: "Projects", description: "Space systems, embedded AI, computer vision and research builds." };

export default async function Projects() {
  const p = await getProjects();
  return (
    <div className="wrap" style={{ paddingBottom: 88 }}>
      <header className="page-head">
        <span className="eyebrow">Projects · {p.length}</span>
        <h1 className="page">Orbit to <em>factory floor</em></h1>
        <p className="lede">Every card opens a case study. Employer work is described, never shown.</p>
      </header>
      <ProjectGrid items={p.map(toProj)} />
    </div>
  );
}
