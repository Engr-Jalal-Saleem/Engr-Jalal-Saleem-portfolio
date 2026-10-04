import CopyEmail from "../../../components/CopyEmail";
import { getSettings } from "../../../lib/content";

export const metadata = { title: "CV" };

export default async function CV() {
  const s = await getSettings();
  return (
    <div className="wrap" style={{ paddingBottom: 88 }}>
      <header className="page-head">
        <span className="eyebrow">CV</span>
        <h1 className="page">Curriculum <em>vitae</em></h1>
        {s.cvFile ? (
          <a className="btn" href={s.cvFile} download>Download PDF</a>
        ) : (
          <p className="lede">Upload your CV PDF in the admin panel under Site settings and it will appear here.</p>
        )}
      </header>
      {s.cvFile && <iframe className="cv-frame" src={s.cvFile} title="CV" />}
      <div style={{ marginTop: 40 }}><CopyEmail email={s.email} /></div>
    </div>
  );
}
