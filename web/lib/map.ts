/** Convert Keystatic entries into the plain props client components expect. */
import { STATUS_LABEL } from "./content";
import type { Proj } from "../components/ProjectGrid";
import type { Pub } from "../components/PubList";
import type { Cert } from "../components/CertList";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const toProj = ({ slug, entry: e }: any): Proj => ({
  slug, title: e.title, kicker: e.kicker, summary: e.summary, categories: [...e.categories], status: e.status, statusLabel: STATUS_LABEL[e.status] ?? e.status, cover: e.cover,
});
export const toPub = ({ slug, entry: e }: any): Pub => ({
  slug, title: e.title, authors: e.authors, venue: e.venue, year: e.year, status: e.status, statusLabel: STATUS_LABEL[e.status] ?? e.status,
  summary: e.summary, keyResult: e.keyResult, pdf: e.pdf, link: e.link, bibtex: e.bibtex, project: e.project,
});
export const toCert = ({ slug, entry: e }: any): Cert => ({
  slug, title: e.title, issuer: e.issuer, issued: e.issued, url: e.url, credentialId: e.credentialId, category: e.category, file: e.file,
});
