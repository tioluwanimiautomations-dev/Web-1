export interface Link {
  label: string;
  href: string;
}

export interface NavigationItem extends Link {
  /** Treat as current page when the visitor is on this path (or below it). */
  matchPath?: string;
}

export interface SiteConfig {
  /** Full site name, used in titles and structured data. */
  name: string;
  description: string;
  /** Language of the site content. */
  lang: string;
  /** Locale for Open Graph, e.g. en_US. */
  locale: string;
  /** Public contact email. Empty until the founder supplies one. */
  email: string;
  founder: { name: string; linkedin: string };
  seo: {
    /** Appended to page titles: "Page | PracticeOp". */
    titleSeparator: string;
    defaultTitle: string;
    /** Social sharing image in /public. Empty until a 1200x627 image exists. */
    ogImage: string;
    ogImageAlt: string;
    themeColor: string;
  };
  /** The one call to action used everywhere on the site. */
  cta: { label: string; href: string };
  /** Booking scheduler URL. Empty until the founder confirms cal.com or Calendly. */
  bookingUrl: string;
}
