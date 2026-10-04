import CertList from "../../../components/CertList";
import { getCertificates } from "../../../lib/content";
import { toCert } from "../../../lib/map";

export const metadata = { title: "Certificates", description: "All certificates, each linked to the issuer's verify page." };

export default async function Certs() {
  const c = await getCertificates();
  return (
    <div className="wrap" style={{ paddingBottom: 88 }}>
      <header className="page-head">
        <span className="eyebrow">Certificates · {c.length}</span>
        <h1 className="page">Every one, <em>verifiable</em></h1>
        <p className="lede">Click any card to open the issuer&apos;s verify page.</p>
      </header>
      <CertList items={c.map(toCert)} />
    </div>
  );
}
