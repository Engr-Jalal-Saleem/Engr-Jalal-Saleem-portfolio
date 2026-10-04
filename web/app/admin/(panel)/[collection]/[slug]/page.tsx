import Link from "next/link";
import { notFound } from "next/navigation";
import Editor from "../../../../../components/admin/Editor";
import { COLLECTIONS, getItem } from "../../../../../lib/store";

const VIEW: Record<string, (s: string) => string> = {
  projects: (s) => `/projects/${s}`, publications: () => "/publications", certificates: () => "/certificates",
  experience: () => "/experience", honors: () => "/experience", skills: () => "/experience", chapters: () => "/story",
};

export default async function EditPage({ params }: { params: Promise<{ collection: string; slug: string }> }) {
  const { collection, slug } = await params;
  const c = COLLECTIONS[collection];
  const it = c && (await getItem(collection, slug));
  if (!it) notFound();
  return (
    <>
      <div className="top"><div><Link href={`/admin/${collection}`} className="sub">← {c.label}</Link><h1>{String(it.data[c.titleKey] ?? slug)}</h1></div></div>
      <Editor kind="item" name={collection} slug={slug} data={it.data} body={it.body} viewHref={VIEW[collection]?.(slug)} />
    </>
  );
}
