import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdoc from "@markdoc/markdoc";
import React from "react";
import Reveal from "../../../../components/Reveal";
import { getProject, getProjects, STATUS_LABEL } from "../../../../lib/content";

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProject((await params).slug);
  return p ? { title: p.title, description: p.summary, openGraph: { images: p.cover ? [p.cover] : [] } } : {};
}

export default async function Project({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProject((await params).slug);
  if (!p) notFound();
  const { node } = p.body;
  const html = Markdoc.renderers.react(Markdoc.transform(node as unknown as Parameters<typeof Markdoc.transform>[0]), React);
  return (
    <div className="wrap" style={{ paddingBottom: 88 }}>
      <header className="page-head" style={{ paddingBottom: 28 }}>
        <Link className="more" href="/projects">← ALL PROJECTS</Link>
        <p className="eyebrow" style={{ marginTop: 18 }}>{p.kicker} · {STATUS_LABEL[p.status]}</p>
        <h1 className="page">{p.title}</h1>
        <p className="lede">{p.summary}</p>
      </header>
      <div className="case">
        <div>
          {p.video ? (
            <div className="video" style={{ marginBottom: 36 }}><video src={p.video} poster={p.video.replace(/\.mp4$/, ".jpg")} controls preload="none" playsInline /></div>
          ) : p.cover ? (
            <Reveal><div className="cover"><Image src={p.cover} alt={p.title} fill priority sizes="(max-width:880px) 100vw, 760px" /></div></Reveal>
          ) : null}
          <div className="prose">{html}</div>
          {p.gallery.length > 0 && <div className="grid" style={{ marginTop: 32 }}>{p.gallery.map((g, i) => g && <div key={i} className="cover" style={{ margin: 0 }}><Image src={g} alt="" fill sizes="380px" /></div>)}</div>}
        </div>
        <aside className="aside">
          <div><h4>My role</h4><p style={{ margin: 0, fontSize: 14.5 }}>{p.role}</p></div>
          {p.results.length > 0 && <div><h4>Results</h4><ul>{p.results.map((r, i) => <li key={i}>{r}</li>)}</ul></div>}
          {p.stack.length > 0 && <div><h4>Stack</h4><div className="tags">{p.stack.map((t) => <span key={t}>{t}</span>)}</div></div>}
          {(p.repo || p.demo) && <div className="btns">{p.repo && <a className="btn g" href={p.repo}>Code ↗</a>}{p.demo && <a className="btn" href={p.demo}>Live ↗</a>}</div>}
        </aside>
      </div>
    </div>
  );
}
