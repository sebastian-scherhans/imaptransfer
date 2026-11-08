import { LANGS, type Lang } from './content.ts';
import type { LegalKind } from './legal.ts';

export type PageKind = 'home' | LegalKind;

/** The languages the legal notice is written in; every other language links the English one. */
export type ImprintLang = 'en' | 'de';
export const IMPRINT_LANGS: ImprintLang[] = ['en', 'de'];

/**
 * Where each page lives, per language: every language under its code, English too. The root has no
 * page of its own; the server sends it on to a language (see `languageOf`). The legal notice of a
 * language without its own is the English one.
 */
export const PATHS: Record<PageKind, Record<Lang, string>> = {
  home: { en: '/en/', de: '/de/', fr: '/fr/', es: '/es/', it: '/it/', nl: '/nl/', pt: '/pt/' },
  imprint: { en: '/en/legal-notice/', de: '/de/impressum/', fr: '/en/legal-notice/', es: '/en/legal-notice/', it: '/en/legal-notice/', nl: '/en/legal-notice/', pt: '/en/legal-notice/' },
  privacy: { en: '/en/privacy/', de: '/de/datenschutz/', fr: '/fr/confidentialite/', es: '/es/privacidad/', it: '/it/privacy/', nl: '/nl/privacy/', pt: '/pt/privacidade/' },
};

/**
 * Where the English pages lived until they moved under /en/. Released versions of the app link to
 * them, so they send on to the new place for good and must stay.
 */
export const MOVED: Record<string, string> = {
  '/privacy/': PATHS.privacy.en,
  '/legal-notice/': PATHS.imprint.en,
};

/**
 * The language the root sends a visitor to: the first one the browser asks for, if the site speaks
 * it, else English. Only the first, because that is what the server can read from the header too.
 */
export function languageOf(acceptLanguage: string | undefined): Lang {
  const first = (acceptLanguage ?? '').trim().split(/[-_,;\s]/)[0]?.toLowerCase() ?? '';
  return LANGS.find((lang) => lang === first) ?? 'en';
}

/** The language of an address by its first folder; English for any address outside the languages. */
export const languageOfPath = (path: string): Lang => LANGS.find((lang) => path.startsWith(PATHS.home[lang])) ?? 'en';

/**
 * The page for a visitor whose language is not known (hreflang x-default): the root for the start
 * page, which sends them on to theirs; the English one for the others.
 */
export const defaultPath = (kind: PageKind) => (kind === 'home' ? '/' : PATHS[kind].en);

/** The not-found page of a language, at the root of its pages. */
export const notFoundPath = (lang: Lang) => `${PATHS.home[lang]}404.html`;

/** The languages a kind of page is written in: the alternates of each other. */
export const langsOf = (kind: PageKind): Lang[] => (kind === 'imprint' ? IMPRINT_LANGS : LANGS);

/** The language the legal notice is read in by someone who reads this one. */
export const imprintLang = (lang: Lang): ImprintLang => (lang === 'de' ? 'de' : 'en');

/** The anchor of the section on liability for the app, in the legal notice. */
export const LIABILITY: Record<ImprintLang, string> = { de: 'haftung', en: 'liability' };

/** That section; the downloads, the footer of every page and the privacy policy link to it. */
export const liabilityPath = (lang: Lang) => `${PATHS.imprint[lang]}#${LIABILITY[imprintLang(lang)]}`;
