import { useEffect } from "react";
import { useLocation } from "react-router";

type SeoDefinition = {
  title: string;
  description: string;
  keywords: string;
  noindex?: boolean;
};

const SITE_NAME = "3NStudioz";
const DEFAULT_IMAGE = "https://res.cloudinary.com/djqvmg7pb/image/upload/v1775557926/711A2748_pr1wck.jpg";
const LOGO_IMAGE = "https://res.cloudinary.com/djqvmg7pb/image/upload/v1775561534/LOGO_1_cmx2wn.png";
const DEFAULT_ROBOTS = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
const NOINDEX_ROBOTS = "noindex,nofollow";

const ROUTE_SEO: Record<string, SeoDefinition> = {
  "/": {
    title: "3NStudioz | Photography & Videography in Pretoria",
    description:
      "3NStudioz offers professional photography and videography in Pretoria for weddings, events, portraits, and private celebrations across South Africa.",
    keywords:
      "Pretoria photographer, Pretoria videographer, wedding photography Pretoria, event videography South Africa, portrait photography, 3NStudioz",
  },
  "/about": {
    title: "About 3NStudioz | Pretoria Photography & Videography Team",
    description:
      "Learn about 3NStudioz, a Pretoria-based photography and videography team focused on weddings, events, portraits, and cinematic storytelling across South Africa.",
    keywords:
      "about 3NStudioz, Pretoria photography studio, videography team South Africa, wedding media team",
  },
  "/booking": {
    title: "Book 3NStudioz | Photography & Videography Bookings",
    description:
      "Book 3NStudioz for weddings, portraits, parties, and events. Choose your service, date, location, and package details online.",
    keywords:
      "book photographer Pretoria, book videographer Pretoria, photography booking South Africa, event booking 3NStudioz",
  },
  "/contact": {
    title: "Contact 3NStudioz | Pretoria Photography & Videography",
    description:
      "Contact 3NStudioz in Pretoria for photography and videography quotes, package questions, and event availability.",
    keywords:
      "contact photographer Pretoria, videography quote South Africa, 3NStudioz contact, photography inquiry",
  },
  "/portfolio": {
    title: "Portfolio | 3NStudioz Photography & Videography Work",
    description:
      "Explore the 3NStudioz portfolio featuring wedding photography, event coverage, portrait sessions, and video highlights from recent projects.",
    keywords:
      "photography portfolio Pretoria, videography portfolio South Africa, wedding gallery, event media showcase",
  },
  "/services": {
    title: "Services | 3NStudioz Photography & Videography Packages",
    description:
      "Browse 3NStudioz photography and videography packages for weddings, parties, portraits, and events, with flexible timing and custom package options.",
    keywords:
      "photography packages Pretoria, videography packages Pretoria, wedding packages South Africa, event media services",
  },
};

const ADMIN_SEO: SeoDefinition = {
  title: "3NStudioz Admin",
  description: "Private administration area for 3NStudioz.",
  keywords: "",
  noindex: true,
};

const NOT_FOUND_SEO: SeoDefinition = {
  title: "Page Not Found | 3NStudioz",
  description: "The page you requested could not be found on the 3NStudioz website.",
  keywords: "",
  noindex: true,
};

const normalizePathname = (pathname: string) => {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
};

const getSiteOrigin = () => {
  const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.trim();

  if (configuredSiteUrl) {
    return configuredSiteUrl.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
};

const buildCanonicalUrl = (pathname: string) => {
  const origin = getSiteOrigin();

  if (!origin) return "";
  if (pathname === "/") return `${origin}/`;

  return `${origin}${pathname}`;
};

const resolveSeoDefinition = (pathname: string): SeoDefinition => {
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname.startsWith("/admin")) {
    return normalizedPathname === "/admin/login"
      ? {
          ...ADMIN_SEO,
          title: "Admin Login | 3NStudioz",
          description: "Private sign-in page for the 3NStudioz administration area.",
        }
      : ADMIN_SEO;
  }

  return ROUTE_SEO[normalizedPathname] ?? NOT_FOUND_SEO;
};

const upsertMetaTag = (attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const upsertLinkTag = (rel: string, href: string) => {
  let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

const upsertJsonLd = (payload: Record<string, unknown>) => {
  const selector = 'script[data-seo="route-json-ld"]';
  let element = document.head.querySelector(selector) as HTMLScriptElement | null;

  if (!element) {
    element = document.createElement("script");
    element.type = "application/ld+json";
    element.dataset.seo = "route-json-ld";
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(payload);
};

const createStructuredData = (pathname: string, seo: SeoDefinition, canonicalUrl: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${getSiteOrigin() || canonicalUrl || ""}/#business`,
      name: SITE_NAME,
      description:
        "Photography and videography studio based in Pretoria for weddings, portraits, events, and private celebrations.",
      image: DEFAULT_IMAGE,
      logo: LOGO_IMAGE,
      url: getSiteOrigin() || canonicalUrl,
      telephone: "+27 76 123 2491",
      email: "3nstudioz@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Pretoria",
        addressCountry: "ZA",
      },
      areaServed: {
        "@type": "Country",
        name: "South Africa",
      },
      sameAs: [
        "https://www.facebook.com/profile.php?id=61582804560474",
        "https://www.tiktok.com/@3nstudioz",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${getSiteOrigin() || canonicalUrl || ""}/#website`,
      name: SITE_NAME,
      url: getSiteOrigin() || canonicalUrl,
      inLanguage: "en-ZA",
    },
    {
      "@type": "WebPage",
      "@id": `${canonicalUrl || pathname}#webpage`,
      name: seo.title,
      description: seo.description,
      url: canonicalUrl,
      isPartOf: {
        "@id": `${getSiteOrigin() || canonicalUrl || ""}/#website`,
      },
    },
  ],
});

export function Seo() {
  const location = useLocation();

  useEffect(() => {
    const pathname = normalizePathname(location.pathname);
    const seo = resolveSeoDefinition(pathname);
    const canonicalUrl = buildCanonicalUrl(pathname);
    const robots = seo.noindex ? NOINDEX_ROBOTS : DEFAULT_ROBOTS;

    document.title = seo.title;
    document.documentElement.lang = "en-ZA";

    upsertMetaTag("name", "description", seo.description);
    upsertMetaTag("name", "keywords", seo.keywords);
    upsertMetaTag("name", "robots", robots);
    upsertMetaTag("name", "twitter:card", "summary_large_image");
    upsertMetaTag("name", "twitter:title", seo.title);
    upsertMetaTag("name", "twitter:description", seo.description);
    upsertMetaTag("name", "twitter:image", DEFAULT_IMAGE);
    upsertMetaTag("property", "og:site_name", SITE_NAME);
    upsertMetaTag("property", "og:locale", "en_ZA");
    upsertMetaTag("property", "og:type", "website");
    upsertMetaTag("property", "og:title", seo.title);
    upsertMetaTag("property", "og:description", seo.description);
    upsertMetaTag("property", "og:image", DEFAULT_IMAGE);
    upsertMetaTag("property", "og:url", canonicalUrl || pathname);

    if (canonicalUrl) {
      upsertLinkTag("canonical", canonicalUrl);
    }

    upsertJsonLd(createStructuredData(pathname, seo, canonicalUrl));
  }, [location.pathname]);

  return null;
}