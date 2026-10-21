import type { Link, NavigationItem } from '../types';

export const mainNav: NavigationItem[] = [
  { label: 'How it works', href: '/how-it-works', matchPath: '/how-it-works' },
  { label: 'Founding pilot', href: '/founding-pilot', matchPath: '/founding-pilot' },
  { label: 'Free resources', href: '/resources', matchPath: '/resources' },
  { label: 'About', href: '/about', matchPath: '/about' },
];

export const footerNav: Link[] = [
  ...mainNav,
  { label: 'Data and privacy', href: '/data-and-privacy' },
];

export const legalLinks: Link[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];
