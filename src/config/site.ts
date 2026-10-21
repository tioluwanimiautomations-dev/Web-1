import type { SiteConfig } from '../types';

/**
 * Central site configuration. Every component reads from here.
 * Empty strings are open placeholders: the pages show a visible [PLACEHOLDER] until they are filled.
 */
export const siteConfig: SiteConfig = {
  name: 'PracticeOp',
  description:
    'Intake system for criminal defense firms: every call, web form and ad lead answered 24/7 in English and Spanish, conflict-screened and booked, with the attorney approving each one by text.',
  lang: 'en',
  locale: 'en_US',

  // [PLACEHOLDER: contact email]
  email: '',
  founder: { name: 'Stephen Adeniji', linkedin: 'https://www.linkedin.com/in/practiceop' },

  seo: {
    titleSeparator: ' | ',
    defaultTitle: 'PracticeOp: intake system for criminal defense firms',
    // [PLACEHOLDER: 1200x627 Open Graph image, e.g. '/og-image.png']
    ogImage: '',
    ogImageAlt: 'PracticeOp, intake system for criminal defense firms.',
    themeColor: '#1E4D3B',
  },

  cta: { label: 'Book a 25-minute intake audit', href: '/book#schedule' },

  // [PLACEHOLDER: booking URL. Founder must confirm cal.com/practiceop/audit or Calendly]
  bookingUrl: '',
};
