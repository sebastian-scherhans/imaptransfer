import { LANGS, type Lang } from './content.ts';
import type { LegalKind } from './legal.ts';

export type PageKind = 'home' | LegalKind;

/** The languages the legal notice is written in; every other language links the English one. */
export type ImprintLang = 'en' | 'de';
export const IMPRINT_LANGS: ImprintLang[] = ['en', 'de'];

/**
 * Where each page lives, per language. English is the root; every other language lives under its
 * code. The legal notice of a language without its own is the English one.
 */
export const PATHS: Record<PageKind, Record<Lang, string>> = {
  home: { en: '/', de: '/de/', fr: '/fr/', es: '/es/', it: '/it/', nl: '/nl/', pt: '/pt/' },
  imprint: { en: '/legal-notice/', de: '/de/impressum/', fr: '/legal-notice/', es: '/legal-notice/', it: '/legal-notice/', nl: '/legal-notice/', pt: '/legal-notice/' },
  privacy: { en: '/privacy/', de: '/de/datenschutz/', fr: '/fr/confidentialite/', es: '/es/privacidad/', it: '/it/privacy/', nl: '/nl/privacy/', pt: '/pt/privacidade/' },
};

/** The languages a kind of page is written in: the alternates of each other. */
export const langsOf = (kind: PageKind): Lang[] => (kind === 'imprint' ? IMPRINT_LANGS : LANGS);

/** The language the legal notice is read in by someone who reads this one. */
export const imprintLang = (lang: Lang): ImprintLang => (lang === 'de' ? 'de' : 'en');

/** The anchor of the section on liability for the app, in the legal notice. */
export const LIABILITY: Record<ImprintLang, string> = { de: 'haftung', en: 'liability' };

/** That section; the downloads, the footer of every page and the privacy policy link to it. */
export const liabilityPath = (lang: Lang) => `${PATHS.imprint[lang]}#${LIABILITY[imprintLang(lang)]}`;
