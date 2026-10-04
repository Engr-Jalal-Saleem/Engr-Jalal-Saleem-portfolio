import { notFound } from "next/navigation";
import ItemList, { type Row } from "../../../../components/admin/ItemList";
import { COLLECTIONS, listItems } from "../../../../lib/store";
import { createEntry } from "../../actions";

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const c = COLLECTIONS[collection];
  if (!c) notFound();
  const items = await listItems(collection);
  const rows: Row[] = items.map((i) => ({
    slug: i.slug,
    title: String(i.data[c.titleKey] ?? i.slug),
    meta: [i.data.issuer, i.data.venue, i.data.org, i.data.year, i.data.issued, i.data.status, i.data.kicker].filter(Boolean).join(" · "),
    visible: i.data.visible !== false,
    featured: "featured" in i.data ? Boolean(i.data.featured) : null,
  }));
  const add = async (fd: FormData) => { "use server"; await createEntry(collection, String(fd.get("title") || "Untitled")); };
  return (
    <>
      <div className="top"><div><h1>{c.label}</h1><p className="sub">Drag to reorder. Flip switches to show, hide or feature. Click a row to edit everything.</p></div></div>
      <form action={add} className="tools" style={{ maxWidth: 620 }}>
        <input type="text" name="title" id="new-title" placeholder={`New ${c.label.toLowerCase().replace(/s$/, "")} title`} required aria-label="New item title" />
        <button className="btn pri" type="submit">+ Add</button>
      </form>
      <ItemList collection={collection} rows={rows} />
    </>
  );
}
