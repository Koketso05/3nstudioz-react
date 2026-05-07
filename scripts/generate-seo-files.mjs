import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const rootDir = process.cwd();
const distDir = join(rootDir, "dist");
const envFilePath = join(rootDir, ".env");

const readEnvFile = (filePath) => {
  if (!existsSync(filePath)) {
    return {};
  }

  return readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .reduce((accumulator, line) => {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) {
        return accumulator;
      }

      const separatorIndex = trimmed.indexOf("=");

      if (separatorIndex === -1) {
        return accumulator;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();

      accumulator[key] = value;
      return accumulator;
    }, {});
};

const normalizeSiteUrl = (siteUrl) => siteUrl.trim().replace(/\/+$/, "");

const envValues = readEnvFile(envFilePath);
const configuredSiteUrl = normalizeSiteUrl(process.env.VITE_SITE_URL || envValues.VITE_SITE_URL || "");

const publicRoutes = ["/", "/about", "/booking", "/contact", "/portfolio", "/services", "/terms-and-conditions"];

mkdirSync(distDir, { recursive: true });

const robotsLines = ["User-agent: *", "Allow: /", "Disallow: /admin", "Disallow: /admin/"];

if (configuredSiteUrl) {
  robotsLines.push(`Sitemap: ${configuredSiteUrl}/sitemap.xml`);
}

writeFileSync(join(distDir, "robots.txt"), `${robotsLines.join("\n")}\n`);

if (!configuredSiteUrl) {
  console.warn("SEO build: VITE_SITE_URL is not set, skipped sitemap.xml generation.");
  process.exit(0);
}

const generatedAt = new Date().toISOString();
const urlEntries = publicRoutes
  .map((route) => {
    const url = route === "/" ? `${configuredSiteUrl}/` : `${configuredSiteUrl}${route}`;
    const priority = route === "/" ? "1.0" : route === "/booking" || route === "/services" ? "0.9" : "0.8";

    return [
      "  <url>",
      `    <loc>${url}</loc>`,
      `    <lastmod>${generatedAt}</lastmod>`,
      "    <changefreq>weekly</changefreq>",
      `    <priority>${priority}</priority>`,
      "  </url>",
    ].join("\n");
  })
  .join("\n");

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  urlEntries,
  '</urlset>',
  '',
].join("\n");

writeFileSync(join(distDir, "sitemap.xml"), sitemap);
console.log(`SEO build: wrote sitemap.xml for ${publicRoutes.length} public routes.`);