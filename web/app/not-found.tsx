/** Any unknown URL lands here. Reuses the site's own 404 inside the normal nav and footer. */
import SiteLayout from "./(site)/layout";
import NotFound from "./(site)/not-found";

export const metadata = { title: "Not found", robots: { index: false } };

export default function RootNotFound() {
  return <SiteLayout><NotFound /></SiteLayout>;
}
