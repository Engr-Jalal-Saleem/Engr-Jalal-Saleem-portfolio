import Link from "next/link";
import { notFound } from "next/navigation";
import Markdoc from "@markdoc/markdoc";
import React from "react";
import Parallax from "../../../../components/Parallax";
import ReadProgress from "../../../../components/ReadProgress";
import SplitText from "../../../../components/SplitText";
import { getPost, getPosts } from "../../../../lib/content";

export const revalidate = 3600;
export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getPost((await params).slug);
  return p ? { title: p.title, description: p.excerpt, openGraph: { type: "article", images: p.cover ? [p.cover] : [] } } : {};
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) notFound();
  const all = await getPosts();
  const i = all.findIndex((x) => x.slug === slug);
  const next = all[i + 1] ?? all[0];
  const html = Markdoc.renderers.react(Markdoc.transform(Markdoc.parse(p.body)), React);
  return (
    <article className="wrap" style={{ paddingBottom: 88 }}>
      <ReadProgress />
      <header className="page-head" style={{ paddingBottom: 28, maxWidth: 860 }}>
        <Link className="more" href="/blog">← ALL POSTS</Link>
        <p className="eyebrow" style={{ marginTop: 18 }}>{p.date} · {p.minutes} min read{p.tags.length ? " · " + p.tags.join(" · ") : ""}</p>
        <SplitText as="h1" className="page" text={p.title} />
        <p className="lede">{p.excerpt}</p>
      </header>
      {p.cover && <div style={{ marginBottom: 48, maxWidth: 980 }}><Parallax src={p.cover} alt="" /></div>}
      <div className="prose post-prose">{html}</div>
      {next && next.slug !== slug && (
        <Link href={`/blog/${next.slug}`} className="next-post" data-cursor="NEXT">
          <span className="eyebrow">Next post</span><b>{next.entry.title}</b>
        </Link>
      )}
    </article>
  );
}
