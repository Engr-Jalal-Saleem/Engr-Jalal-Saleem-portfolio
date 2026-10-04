import PostList from "../../../components/PostList";
import SplitText from "../../../components/SplitText";
import { getPosts } from "../../../lib/content";

export const metadata = { alternates: { canonical: "/blog" }, title: "Blog", description: "Notes on satellites, edge AI and trustworthy ML, written in plain language." };

export default async function Blog() {
  const posts = await getPosts();
  return (
    <div className="wrap" style={{ paddingBottom: 88 }}>
      <header className="page-head">
        <span className="eyebrow">Blog · {posts.length} {posts.length === 1 ? "post" : "posts"}</span>
        <SplitText as="h1" className="page" text="Notes from the" em="lab bench" />
        <p className="lede">What I learned building things. Plain language, real numbers, and what went wrong.</p>
      </header>
      {posts.length ? (
        <PostList posts={posts.map((p) => ({ slug: p.slug, title: p.entry.title, date: p.entry.date, excerpt: p.entry.excerpt, tags: p.entry.tags, cover: p.entry.cover, minutes: p.minutes }))} />
      ) : <p className="lede">No posts yet. Add one in the admin under Blog posts.</p>}
    </div>
  );
}
