import "../admin.css";
export const metadata = { title: "Admin login", robots: { index: false } };
export default async function Login({ searchParams }: { searchParams: Promise<{ e?: string; next?: string }> }) {
  const { e, next } = await searchParams;
  return (
    <div className="login">
      <form method="post" action="/api/admin/login">
        <h1>jalal<span>.</span>admin</h1>
        <p>Sign in to edit your portfolio.</p>
        <input type="hidden" name="next" value={next || "/admin"} />
        <label htmlFor="pw" className="sr" style={{ position: "absolute", left: -9999 }}>Password</label>
        <input id="pw" name="password" type="password" placeholder="Password" autoFocus required />
        {e === "1" && <p className="err">Wrong password. Try again.</p>}
        {e === "locked" && <p className="err">Too many attempts. Wait 15 minutes and try again.</p>}
        {e === "unset" && <p className="err">No admin password is set. Add ADMIN_PASSWORD in Vercel settings.</p>}
        <button type="submit">Sign in</button>
        {process.env.NODE_ENV !== "production" && !process.env.ADMIN_PASSWORD && <p>Local dev password: <b>admin</b></p>}
      </form>
    </div>
  );
}
