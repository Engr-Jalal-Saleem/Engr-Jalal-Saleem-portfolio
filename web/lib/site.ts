/**
 * Public base URL of the site. Order: explicit NEXT_PUBLIC_SITE_URL, then Vercel's
 * production domain, then the current deployment URL, then localhost for dev.
 * Without this, Open Graph images and canonicals pointed at localhost on Vercel.
 */
export function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "localhost:3000";
  const withProto = raw.startsWith("http") ? raw : (raw.startsWith("localhost") ? "http://" : "https://") + raw;
  return withProto.replace(/\/$/, "");
}
