import Reveal from "../../../components/Reveal";
import SplitText from "../../../components/SplitText";
import { getHome } from "../../../lib/content";

export const metadata = { title: "Research", description: "Onboard autonomy for satellites, edge AI, trustworthy ML and vision." };

export default async function Research() {
  const h = await getHome();
  return (
    <div className="wrap">
      <header className="page-head">
        <span className="eyebrow">Research</span>
        <SplitText as="h1" className="page" text="Fast decisions on cheap hardware, that you can" em="trust" />
      </header>
      <div className="research" style={{ paddingBottom: 88 }}>
        <Reveal className="interests">
          {h.interests.map((x, i) => (
            <div className="int" key={i}><i>0{i + 1}</i><div><b>{x.title}</b><span>{x.body}</span></div></div>
          ))}
        </Reveal>
        <Reveal delay={0.1}>
          <div className="video"><video src="/videos/pulse-explainer.mp4" poster="/videos/pulse-explainer.jpg" controls preload="none" playsInline /></div>
          <div className="nextq"><b>NEXT QUESTION</b><p>{h.researchQuestion}</p></div>
        </Reveal>
      </div>
    </div>
  );
}
