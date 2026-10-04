import { getPosts } from "../../../../lib/content";
import { siteUrl } from "../../../../lib/site";

export const revalidate = 3600;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** RSS feed of blog posts, so readers and aggregators can follow new writing. */
export async function GET() {
  const site = siteUrl();
  const items = (await getPosts()).map((p) => `<item><title>${esc(p.entry.title)}</title><link>${site}/blog/${p.slug}</link><guid>${site}/blog/${p.slug}</guid>${p.entry.date ? `<pubDate>${new Date(p.entry.date).toUTCString()}</pubDate>` : ""}<description>${esc(p.entry.excerpt)}</description></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Jalal Saleem · Blog</title><link>${site}/blog</link><description>Notes on research, embedded AI and engineering.</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
