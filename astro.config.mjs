// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Production URL of the site. Used for canonical URLs, Open Graph tags,
 * the sitemap and the RSS feed.
 *
 * Set the SITE_URL environment variable when you build, or replace the
 * placeholder below with your own domain.
 */
// [PLACEHOLDER: domain] Set SITE_URL when building, or replace this default.
const site = process.env.SITE_URL ?? 'https://example.com';

/**
 * Optional sub-path, e.g. "/web-1" for a GitHub Pages project site.
 * Leave unset when the site is served from the domain root.
 */
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});
