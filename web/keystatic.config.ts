/**
 * Admin panel schema (Keystatic).
 *
 * Every collection has `visible` and `order`, so any item can be hidden or
 * re-ordered from /keystatic without touching code. Content is stored as
 * plain JSON/Markdoc files under /content, and each save is a Git commit.
 *
 * Storage mode:
 *  - local (default): edits write straight to the files on disk. Use with `npm run dev`.
 *  - github: set KEYSTATIC_STORAGE=github plus the GitHub App env vars on Vercel,
 *    then edit live at https://<your-domain>/keystatic.
 */
import { config, collection, singleton, fields } from "@keystatic/core";

const useGithub = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === "github";

const visible = fields.checkbox({ label: "Show on site", defaultValue: true });
const order = fields.integer({ label: "Order (lower shows first)", defaultValue: 100 });

const statusOptions = [
  { label: "Published", value: "published" },
  { label: "Accepted", value: "accepted" },
  { label: "Under review", value: "under-review" },
  { label: "In preparation", value: "in-preparation" },
  { label: "Thesis", value: "thesis" },
] as const;

const projectStatus = [
  { label: "Published", value: "published" },
  { label: "Under review", value: "under-review" },
  { label: "Deployed", value: "deployed" },
  { label: "Prototype", value: "prototype" },
  { label: "Built", value: "built" },
  { label: "Employer work", value: "employer" },
  { label: "Concept, not built yet", value: "concept" },
] as const;

export default config({
  storage: useGithub
    ? { kind: "github", repo: "Engr-Jalal-Saleem/Engr-Jalal-Saleem-portfolio", branchPrefix: "content/" }
    : { kind: "local" },
  ui: {
    brand: { name: "Jalal · Admin" },
    navigation: {
      Site: ["settings", "home"],
      Story: ["chapters"],
      Work: ["publications", "projects", "experience"],
      Credentials: ["honors", "certificates", "skills"],
    },
  },

  singletons: {
    settings: singleton({
      label: "Site settings",
      path: "content/settings",
      format: { data: "json" },
      schema: {
        name: fields.text({ label: "Name" }),
        headline: fields.text({ label: "Headline (under the name)" }),
        email: fields.text({ label: "Email" }),
        linkedin: fields.url({ label: "LinkedIn URL" }),
        github: fields.url({ label: "GitHub URL" }),
        scholar: fields.url({ label: "Google Scholar URL (leave empty to hide)" }),
        orcid: fields.url({ label: "ORCID URL (leave empty to hide)" }),
        researchgate: fields.url({ label: "ResearchGate URL (leave empty to hide)" }),
        cvFile: fields.file({ label: "CV PDF", directory: "public/files", publicPath: "/files/" }),
        seekingNote: fields.text({ label: "Availability note (empty hides it)" }),
        nav: fields.array(
          fields.object({
            label: fields.text({ label: "Label" }),
            href: fields.text({ label: "Link (e.g. /projects)" }),
            visible,
          }),
          { label: "Navigation links", itemLabel: (p) => p.fields.label.value },
        ),
      },
    }),
    home: singleton({
      label: "Home page",
      path: "content/home",
      format: { data: "json" },
      schema: {
        eyebrow: fields.text({ label: "Small line above the intro" }),
        intro: fields.text({ label: "Intro paragraph", multiline: true }),
        introHighlight: fields.text({ label: "Words in the intro to highlight in amber" }),
        chips: fields.array(
          fields.object({ strong: fields.text({ label: "Bold part" }), rest: fields.text({ label: "Rest" }), visible }),
          { label: "Proof chips under the intro", itemLabel: (p) => `${p.fields.strong.value} ${p.fields.rest.value}` },
        ),
        stats: fields.array(
          fields.object({
            value: fields.number({ label: "Number" }),
            decimals: fields.integer({ label: "Decimals", defaultValue: 0 }),
            prefix: fields.text({ label: "Prefix" }),
            suffix: fields.text({ label: "Suffix" }),
            label: fields.text({ label: "Label" }),
            visible,
          }),
          { label: "Counter tiles", itemLabel: (p) => p.fields.label.value },
        ),
        researchQuestion: fields.text({ label: "The research question I want to pursue next", multiline: true }),
        interests: fields.array(
          fields.object({ title: fields.text({ label: "Title" }), body: fields.text({ label: "Body", multiline: true }) }),
          { label: "Research interests", itemLabel: (p) => p.fields.title.value },
        ),
        sections: fields.multiselect({
          label: "Sections shown on the home page",
          options: [
            { label: "Story", value: "story" },
            { label: "Stats", value: "stats" },
            { label: "Research", value: "research" },
            { label: "Selected publications", value: "publications" },
            { label: "Selected projects", value: "projects" },
            { label: "Featured certificates", value: "certificates" },
            { label: "Contact", value: "contact" },
          ],
          defaultValue: ["story", "stats", "research", "publications", "projects", "certificates", "contact"],
        }),
      },
    }),
  },

  collections: {
    chapters: collection({
      label: "Story chapters",
      path: "content/chapters/*",
      slugField: "title",
      format: { data: "json" },
      columns: ["title", "year"],
      schema: {
        title: fields.slug({ name: { label: "Chapter title" } }),
        year: fields.text({ label: "Year or range" }),
        place: fields.text({ label: "Place" }),
        body: fields.text({ label: "Text", multiline: true }),
        image: fields.image({ label: "Image", directory: "public/images/story", publicPath: "/images/story/" }),
        order,
        visible,
      },
    }),

    publications: collection({
      label: "Publications",
      path: "content/publications/*",
      slugField: "title",
      format: { data: "json" },
      columns: ["title", "status"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        authors: fields.text({ label: "Authors (wrap your name in **double stars** to bold it)" }),
        venue: fields.text({ label: "Venue" }),
        year: fields.integer({ label: "Year" }),
        status: fields.select({ label: "Status", options: statusOptions, defaultValue: "published" }),
        summary: fields.text({ label: "Plain-English summary (2 sentences)", multiline: true }),
        keyResult: fields.text({ label: "Key result" }),
        pdf: fields.file({ label: "PDF (only if it can be public)", directory: "public/papers", publicPath: "/papers/" }),
        link: fields.url({ label: "External link (DOI, Zenodo, IEEE)" }),
        bibtex: fields.text({ label: "BibTeX", multiline: true }),
        project: fields.relationship({ label: "Related project", collection: "projects" }),
        featured: fields.checkbox({ label: "Show on home page", defaultValue: true }),
        order,
        visible,
      },
    }),

    projects: collection({
      label: "Projects",
      path: "content/projects/*",
      slugField: "title",
      format: { contentField: "body" },
      columns: ["title", "status"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        kicker: fields.text({ label: "Small label (e.g. KAUST · SPACE)" }),
        summary: fields.text({ label: "One-line summary", multiline: true }),
        categories: fields.multiselect({
          label: "Categories",
          options: [
            { label: "Space", value: "space" },
            { label: "Embedded", value: "embedded" },
            { label: "Vision", value: "vision" },
            { label: "AI", value: "ai" },
            { label: "Research", value: "research" },
            { label: "Concept", value: "concept" },
          ],
        }),
        status: fields.select({ label: "Status", options: projectStatus, defaultValue: "built" }),
        cover: fields.image({ label: "Cover image", directory: "public/images/projects", publicPath: "/images/projects/" }),
        video: fields.text({ label: "Video path or URL (optional)" }),
        role: fields.text({ label: "My role", multiline: true }),
        stack: fields.array(fields.text({ label: "Tech" }), { label: "Tech stack", itemLabel: (p) => p.value }),
        results: fields.array(fields.text({ label: "Result" }), { label: "Key results", itemLabel: (p) => p.value }),
        repo: fields.url({ label: "GitHub repo (empty if private)" }),
        demo: fields.url({ label: "Live demo" }),
        gallery: fields.array(
          fields.image({ label: "Image", directory: "public/images/projects", publicPath: "/images/projects/" }),
          { label: "Gallery" },
        ),
        body: fields.markdoc({ label: "Case study (problem, approach, what I'd do next)" }),
        featured: fields.checkbox({ label: "Show on home page", defaultValue: false }),
        order,
        visible,
      },
    }),

    experience: collection({
      label: "Experience",
      path: "content/experience/*",
      slugField: "role",
      format: { data: "json" },
      columns: ["role", "org"],
      schema: {
        role: fields.slug({ name: { label: "Role" } }),
        org: fields.text({ label: "Organization" }),
        location: fields.text({ label: "Location" }),
        mapPlace: fields.select({
          label: "Point on the ground-track map",
          options: [
            { label: "Lahore", value: "Lahore" },
            { label: "Thuwal", value: "Thuwal" },
            { label: "Beijing", value: "Beijing" },
            { label: "Riyadh", value: "Riyadh" },
            { label: "Faisalabad", value: "Faisalabad" },
            { label: "Karachi", value: "Karachi" },
            { label: "None", value: "none" },
          ],
          defaultValue: "Lahore",
        }),
        start: fields.text({ label: "Start (e.g. Jul 2025)" }),
        end: fields.text({ label: "End (e.g. Present)" }),
        description: fields.text({ label: "What I did", multiline: true }),
        minor: fields.checkbox({ label: "Show small, at the bottom", defaultValue: false }),
        order,
        visible,
      },
    }),

    honors: collection({
      label: "Honors",
      path: "content/honors/*",
      slugField: "title",
      format: { data: "json" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        detail: fields.text({ label: "Detail" }),
        year: fields.text({ label: "Year" }),
        link: fields.url({ label: "Proof link (optional)" }),
        order,
        visible,
      },
    }),

    certificates: collection({
      label: "Certificates",
      path: "content/certificates/*",
      slugField: "title",
      format: { data: "json" },
      columns: ["title", "issuer"],
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        issuer: fields.text({ label: "Issuer" }),
        issued: fields.text({ label: "Issued (e.g. Mar 2025)" }),
        credentialId: fields.text({ label: "Credential ID" }),
        url: fields.url({ label: "Verify link" }),
        file: fields.file({ label: "Certificate file (optional)", directory: "public/certificates", publicPath: "/certificates/" }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "AI & ML", value: "AI & ML" },
            { label: "Embedded & IoT", value: "Embedded & IoT" },
            { label: "Security", value: "Security" },
            { label: "Cloud & Data", value: "Cloud & Data" },
            { label: "Research", value: "Research" },
            { label: "Professional", value: "Professional" },
          ],
          defaultValue: "AI & ML",
        }),
        featured: fields.checkbox({ label: "Feature on home page", defaultValue: false }),
        order,
        visible,
      },
    }),

    skills: collection({
      label: "Skill groups",
      path: "content/skills/*",
      slugField: "group",
      format: { data: "json" },
      schema: {
        group: fields.slug({ name: { label: "Group name" } }),
        items: fields.array(fields.text({ label: "Skill" }), { label: "Skills", itemLabel: (p) => p.value }),
        order,
        visible,
      },
    }),
  },
});
